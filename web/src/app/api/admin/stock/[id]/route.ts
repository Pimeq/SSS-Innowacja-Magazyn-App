import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/__nextauth/authOptions";

const sql = neon(process.env.DATABASE_URL!);

export async function PUT(
  request: Request,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const body: unknown = await request.json();
    const resolvedParams = await context.params;
    const idParam = resolvedParams.id;
    const id = Number.parseInt(idParam, 10);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "Invalid stock id" }, { status: 400 });
    }

    const quantityRaw = (body as { quantity?: unknown })?.quantity;
    const quantity =
      typeof quantityRaw === "number"
        ? quantityRaw
        : Number.parseInt(String(quantityRaw), 10);
    if (!Number.isFinite(quantity) || !Number.isInteger(quantity) || quantity < 0) {
      return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    const actorId = session?.user?.id ? parseInt(session.user.id) : null;
    // Fetch existing to compute delta
    const existing = await sql`SELECT * FROM stock WHERE id = ${id}`;
    if (existing.length === 0) {
      return NextResponse.json({ error: "Stock not found" }, { status: 404 });
    }
    const prev = existing[0];
    const prevQty = Number(prev.quantity);
    const delta = quantity - (Number.isFinite(prevQty) ? prevQty : 0);
    const result = await sql`UPDATE stock SET quantity = ${quantity}, updated_at = NOW() WHERE id = ${id} RETURNING *`;

    if (result.length === 0) {
      return NextResponse.json({ error: "Stock not found" }, { status: 404 });
    }
    // Log change in history (from = to = location)
    const historyType = delta === 0 ? null : delta > 0 ? "stock_add" : "stock_remove";
    if (historyType && actorId !== null && Number.isFinite(actorId)) {
      try {
        await sql`INSERT INTO stock_history (product_id, from_locations_id, to_locations_id, quantity, type, user_id, created_at) 
          VALUES (${prev.product_id}, ${prev.location_id}, ${prev.location_id}, ${delta}, ${historyType}, ${actorId}, NOW())`;
      } catch (historyError) {
        console.warn("Stock updated but failed to write history:", historyError);
      }
    }

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
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await context.params;
    const idParam = resolvedParams.id;
    const id = Number.parseInt(idParam, 10);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "Invalid stock id" }, { status: 400 });
    }

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
    if (actorId !== null && Number.isFinite(actorId)) {
      try {
        const prevQty = Number(prev.quantity);
        await sql`INSERT INTO stock_history (product_id, from_locations_id, to_locations_id, quantity, type, user_id, created_at) 
          VALUES (${prev.product_id}, ${prev.location_id}, ${prev.location_id}, ${-Math.abs(Number.isFinite(prevQty) ? prevQty : 0)}, ${"stock_remove"}, ${actorId}, NOW())`;
      } catch (historyError) {
        console.warn("Stock deleted but failed to write history:", historyError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting stock:", error);
    return NextResponse.json(
      { error: "Failed to delete stock" },
      { status: 500 }
    );
  }
}
