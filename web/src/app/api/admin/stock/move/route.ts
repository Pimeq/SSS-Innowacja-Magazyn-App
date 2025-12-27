import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/__nextauth/authOptions";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { product_id, from_location_id, to_location_id, quantity, user_id } = body;
    const session = await getServerSession(authOptions);
    const actorId = user_id ?? (session?.user?.id ? parseInt(session.user.id) : null);

    if (!product_id || !from_location_id || !to_location_id || !quantity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const moveQty = parseInt(quantity);
    if (isNaN(moveQty) || moveQty <= 0) {
      return NextResponse.json({ error: "Quantity must be a positive number" }, { status: 400 });
    }

    const fromStock = await sql`SELECT id, quantity FROM stock WHERE product_id = ${product_id} AND location_id = ${from_location_id}`;
    if (fromStock.length === 0 || fromStock[0].quantity < moveQty) {
      return NextResponse.json({ error: "Insufficient stock at source location" }, { status: 400 });
    }

    const toStock = await sql`SELECT id, quantity FROM stock WHERE product_id = ${product_id} AND location_id = ${to_location_id}`;

    // Start pseudo-transaction (Neon serverless doesn't support multi-statement transactions by default).
    // Perform updates sequentially; in case of error, caller should reconcile.

    // 1. Deduct from source
    const updatedFrom = await sql`UPDATE stock SET quantity = quantity - ${moveQty}, updated_at = NOW() WHERE id = ${fromStock[0].id} RETURNING *`;

    // 2. Add to destination (insert or update)
    let updatedTo;
    if (toStock.length > 0) {
      updatedTo = await sql`UPDATE stock SET quantity = quantity + ${moveQty}, updated_at = NOW() WHERE id = ${toStock[0].id} RETURNING *`;
    } else {
      updatedTo = await sql`INSERT INTO stock (product_id, location_id, quantity) VALUES (${product_id}, ${to_location_id}, ${moveQty}) RETURNING *`;
    }

    // 3. Write history
    await sql`INSERT INTO stock_history (product_id, from_locations_id, to_locations_id, quantity, type, user_id, created_at) VALUES (${product_id}, ${from_location_id}, ${to_location_id}, ${moveQty}, ${"stock_move"}, ${actorId}, NOW())`;

    return NextResponse.json({ from: updatedFrom[0], to: updatedTo[0] });
  } catch (error) {
    console.error("Error moving stock:", error);
    return NextResponse.json({ error: "Failed to move stock" }, { status: 500 });
  }
}
