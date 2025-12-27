import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcrypt";

const sql = neon(process.env.DATABASE_URL || "");

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { email, name, password, role, active } = body;
    const id = parseInt(params.id);

    let result;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      result = await sql`UPDATE users SET email = ${email}, name = ${name}, password = ${hashedPassword}, role = ${role}, active = ${active} WHERE id = ${id} RETURNING id, name, email, role, active`;
    } else {
      result = await sql`UPDATE users SET email = ${email}, name = ${name}, role = ${role}, active = ${active} WHERE id = ${id} RETURNING id, name, email, role, active`;
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    await sql`DELETE FROM users WHERE id = ${id}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
