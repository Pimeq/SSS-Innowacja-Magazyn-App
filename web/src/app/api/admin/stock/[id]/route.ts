import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/__nextauth/authOptions";

const sql = neon(process.env.DATABASE_URL!);

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { quantity } = body;
    const id = parseInt(params.id);
    const session = await getServerSession(authOptions);
    const actorId = session?.user?.id ? parseInt(session.user.id) : null;
    // Fetch existing to compute delta
    const existing = await sql`SELECT * FROM stock WHERE id = ${id}`;
    if (existing.length === 0) {
      return NextResponse.json({ error: "Stock not found" }, { status: 404 });
    }
    const prev = existing[0];
    const delta = (Number(quantity) || 0) - (Number(prev.quantity) || 0);
    const result = await sql`UPDATE stock SET quantity = ${quantity}, updated_at = NOW() WHERE id = ${id} RETURNING *`;

    if (result.length === 0) {
      return NextResponse.json({ error: "Stock not found" }, { status: 404 });
    }
    // Log adjustment in history (from = to = location)
    await sql`INSERT INTO stock_history (product_id, from_locations_id, to_locations_id, quantity, type, user_id, created_at) 
      VALUES (${prev.product_id}, ${prev.location_id}, ${prev.location_id}, ${delta}, ${"stock_adjust"}, ${actorId}, NOW())`;

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error updating stock:", error);
    return NextResponse.json(
      { error: "Failed to update stock" },
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
    const session = await getServerSession(authOptions);
    const actorId = session?.user?.id ? parseInt(session.user.id) : null;
    // Fetch existing to log removal
    const existing = await sql`SELECT * FROM stock WHERE id = ${id}`;
    if (existing.length === 0) {
      return NextResponse.json({ error: "Stock not found" }, { status: 404 });
    }
    const prev = existing[0];
    const result = await sql`DELETE FROM stock WHERE id = ${id} RETURNING id`;

    if (result.length === 0) {
      return NextResponse.json({ error: "Stock not found" }, { status: 404 });
    }

    // Log removal in history (from = to = location, negative quantity)
    await sql`INSERT INTO stock_history (product_id, from_locations_id, to_locations_id, quantity, type, user_id, created_at) 
      VALUES (${prev.product_id}, ${prev.location_id}, ${prev.location_id}, ${-Number(prev.quantity)}, ${"stock_remove"}, ${actorId}, NOW())`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting stock:", error);
    return NextResponse.json(
      { error: "Failed to delete stock" },
      { status: 500 }
    );
  }
}
