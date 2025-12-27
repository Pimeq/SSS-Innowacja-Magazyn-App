import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcrypt";

const sql = neon(process.env.DATABASE_URL || "");

export async function GET() {
  try {
    const users = await sql(
      "SELECT id, username, first_name, last_name, role, active, created_at FROM users ORDER BY created_at DESC"
    );

    return NextResponse.json(users);
  } catch (error) {
    console.error("Users error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, first_name, last_name, role, active } = body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await sql(
      "INSERT INTO users (username, password, first_name, last_name, role, active, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING id, username, first_name, last_name, role, active, created_at",
      [username, hashedPassword, first_name, last_name, role, active]
    );

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
