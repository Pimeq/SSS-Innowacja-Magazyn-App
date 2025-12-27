import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "");

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, description } = body;
    const id = parseInt(params.id);

    const result = await sql`UPDATE locations SET name = ${name}, description = ${description} WHERE id = ${id} RETURNING *`;

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Update location error:", error);
    return NextResponse.json(
      { error: "Failed to update location" },
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
    await sql`DELETE FROM locations WHERE id = ${id}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete location error:", error);
    return NextResponse.json(
      { error: "Failed to delete location" },
      { status: 500 }
    );
  }
}
