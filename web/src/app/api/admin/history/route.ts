import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);

export async function GET(request: Request) {
  try {
    const result = await sql`
      SELECT 
        sh.id,
        sh.product_id,
        sh.from_location_id,
        sh.to_location_id,
        sh.quantity,
        sh.type,
        sh.user_id,
        sh.created_at,
        p.name as product_name,
        l1.name as from_location_name,
        l2.name as to_location_name,
        u.first_name,
        u.last_name
      FROM stock_history sh
      JOIN products p ON sh.product_id = p.id
      JOIN locations l1 ON sh.from_location_id = l1.id
      JOIN locations l2 ON sh.to_location_id = l2.id
      LEFT JOIN users u ON sh.user_id = u.id
      ORDER BY sh.created_at DESC
    `;
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching history:", error);
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { product_id, from_location_id, to_location_id, quantity, type, user_id } = body;

    const result = await sql`
      INSERT INTO stock_history (product_id, from_location_id, to_location_id, quantity, type, user_id, created_at) 
      VALUES (${product_id}, ${from_location_id}, ${to_location_id}, ${quantity}, ${type}, ${user_id}, NOW()) 
      RETURNING *
    `;

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error creating history entry:", error);
    return NextResponse.json(
      { error: "Failed to create history entry" },
      { status: 500 }
    );
  }
}
