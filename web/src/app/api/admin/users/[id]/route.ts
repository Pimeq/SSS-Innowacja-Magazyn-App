import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcrypt";

const sql = neon(process.env.DATABASE_URL || "");

export async function PUT(
  request: Request,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { username, first_name, last_name, password, role, active } = body;
    const resolvedParams = await context.params;
    const id = Number.parseInt(resolvedParams.id, 10);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
    }

    let result;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      result = await sql`UPDATE users SET username = ${username}, first_name = ${first_name}, last_name = ${last_name}, password = ${hashedPassword}, role = ${role}, active = ${active} WHERE id = ${id} RETURNING id, username, first_name, last_name, role, active`;
    } else {
      result = await sql`UPDATE users SET username = ${username}, first_name = ${first_name}, last_name = ${last_name}, role = ${role}, active = ${active} WHERE id = ${id} RETURNING id, username, first_name, last_name, role, active`;
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
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await context.params;
    const id = Number.parseInt(resolvedParams.id, 10);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
    }

    // Best-effort cleanup to avoid FK constraint failures.
    // Keep history rows, but detach actor reference.
    try {
      await sql`DELETE FROM sessions WHERE user_id = ${id}`;
    } catch (error) {
      console.warn("Failed to cleanup sessions for user:", id, error);
    }

    try {
      await sql`DELETE FROM accounts WHERE user_id = ${id}`;
    } catch (error) {
      // Table may not exist in current schema
      console.warn("Failed to cleanup accounts for user:", id, error);
    }

    try {
      await sql`UPDATE stock_history SET user_id = NULL WHERE user_id = ${id}`;
    } catch (error) {
      console.warn("Failed to detach stock_history user_id; deleting history rows instead:", id, error);
      try {
        await sql`DELETE FROM stock_history WHERE user_id = ${id}`;
      } catch (nestedError) {
        console.warn("Failed to delete stock_history rows for user:", id, nestedError);
      }
    }

    const result = await sql`DELETE FROM users WHERE id = ${id} RETURNING id`;
    if (result.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      {
        error: "Failed to delete user",
        ...(process.env.NODE_ENV !== "production" && {
          details:
            error instanceof Error
              ? { message: error.message, name: error.name, stack: error.stack }
              : String(error),
        }),
      },
      { status: 500 }
    );
  }
}
