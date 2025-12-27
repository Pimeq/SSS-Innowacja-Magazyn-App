import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);

export async function GET(request: Request) {
  try {
    const result = await sql(
      `SELECT 
        sh.id,
        sh.product_id,
        sh.location_id,
        sh.quantity_change,
        sh.action,
        sh.performed_by,
        sh.created_at,
        p.name as product_name,
        l.name as location_name,
        u.name as performed_by_name
      FROM stock_history sh
      JOIN products p ON sh.product_id = p.id
      JOIN locations l ON sh.location_id = l.id
      LEFT JOIN users u ON sh.performed_by = u.id
      ORDER BY sh.created_at DESC`
    );
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
    const { product_id, location_id, quantity_change, action, performed_by } = body;

    const result = await sql(
      `INSERT INTO stock_history (product_id, location_id, quantity_change, action, performed_by) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [product_id, location_id, quantity_change, action, performed_by]
    );

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error creating history entry:", error);
    return NextResponse.json(
      { error: "Failed to create history entry" },
      { status: 500 }
    );
  }
}
