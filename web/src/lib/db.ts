import { neon } from "@neondatabase/serverless";
import bcrypt from "bcrypt";

const sql = neon(process.env.DATABASE_URL || "");

export interface User {
  id: number;
  email: string;
  name: string | null;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export interface Session {
  id: number;
  user_id: number;
  session_token: string;
  expires: Date;
  created_at: Date;
}

// User functions
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const result = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;
    return result.length > 0 ? (result[0] as User) : null;
  } catch (error) {
    console.error("Error getting user by email:", error);
    return null;
  }
}

export async function getUserById(id: number): Promise<User | null> {
  try {
    const result = await sql`
      SELECT * FROM users WHERE id = ${id}
    `;
    return result.length > 0 ? (result[0] as User) : null;
  } catch (error) {
    console.error("Error getting user by id:", error);
    return null;
  }
}

export async function createUser(
  email: string,
  password: string,
  name?: string
): Promise<User | null> {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await sql`
      INSERT INTO users (email, password_hash, name)
      VALUES (${email}, ${hashedPassword}, ${name || null})
      RETURNING *
    `;
    return result.length > 0 ? (result[0] as User) : null;
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error("Error verifying password:", error);
    return false;
  }
}

// Session functions
export async function createSession(
  userId: number,
  expiresIn: number = 7 * 24 * 60 * 60 * 1000 // 7 days
): Promise<Session | null> {
  try {
    const sessionToken = `sess_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    const expires = new Date(Date.now() + expiresIn);

    const result = await sql`
      INSERT INTO sessions (user_id, session_token, expires)
      VALUES (${userId}, ${sessionToken}, ${expires.toISOString()})
      RETURNING *
    `;
    return result.length > 0 ? (result[0] as Session) : null;
  } catch (error) {
    console.error("Error creating session:", error);
    return null;
  }
}

export async function getSessionByToken(
  token: string
): Promise<(Session & { user: User }) | null> {
  try {
    const result = await sql`
      SELECT s.*, u.* FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.session_token = ${token} AND s.expires > NOW()
    `;
    if (result.length > 0) {
      const session = result[0] as any;
      return {
        id: session.id,
        user_id: session.user_id,
        session_token: session.session_token,
        expires: new Date(session.expires),
        created_at: new Date(session.created_at),
        user: {
          id: session.user_id,
          email: session.email,
          name: session.name,
          password_hash: session.password_hash,
          created_at: new Date(session.created_at),
          updated_at: new Date(session.updated_at),
        },
      };
    }
    return null;
  } catch (error) {
    console.error("Error getting session by token:", error);
    return null;
  }
}

export async function deleteSession(token: string): Promise<boolean> {
  try {
    await sql`
      DELETE FROM sessions WHERE session_token = ${token}
    `;
    return true;
  } catch (error) {
    console.error("Error deleting session:", error);
    return false;
  }
}

export async function cleanupExpiredSessions(): Promise<void> {
  try {
    await sql`
      DELETE FROM sessions WHERE expires < NOW()
    `;
  } catch (error) {
    console.error("Error cleaning up expired sessions:", error);
  }
}
