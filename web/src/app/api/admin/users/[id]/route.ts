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
    const { username, password, first_name, last_name, role, active } = body;

    let query =
      "UPDATE users SET username = $1, first_name = $2, last_name = $3, role = $4, active = $5";
    let values: any[] = [username, first_name, last_name, role, active, params.id];

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ", password = $6";
      values = [username, first_name, last_name, role, active, hashedPassword, params.id];
    }

    query += " WHERE id = $" + (values.length) + " RETURNING id, username, first_name, last_name, role, active";

    const result = await sql(query, values);

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
    await sql("DELETE FROM users WHERE id = $1", [params.id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
