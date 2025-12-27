import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get("location_id");

    let result;
    if (locationId) {
      const locId = parseInt(locationId);
      result = await sql`
        SELECT 
          s.id, 
          s.product_id, 
          s.location_id, 
          s.quantity,
          p.name as product_name,
          p.qr_code,
          l.name as location_name,
          s.updated_at
        FROM stock s
        JOIN products p ON s.product_id = p.id
        JOIN locations l ON s.location_id = l.id
        WHERE s.location_id = ${locId}
        ORDER BY s.updated_at DESC
      `;
    } else {
      result = await sql`
        SELECT 
          s.id, 
          s.product_id, 
          s.location_id, 
          s.quantity,
          p.name as product_name,
          p.qr_code,
          l.name as location_name,
          s.updated_at
        FROM stock s
        JOIN products p ON s.product_id = p.id
        JOIN locations l ON s.location_id = l.id
        ORDER BY s.updated_at DESC
      `;
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching stock:", error);
    return NextResponse.json(
      { error: "Failed to fetch stock" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { product_id, location_id, quantity } = body;

    const existingStock = await sql`SELECT * FROM stock WHERE product_id = ${product_id} AND location_id = ${location_id}`;

    if (existingStock.length > 0) {
      const result = await sql`UPDATE stock 
         SET quantity = quantity + ${quantity}, updated_at = NOW() 
         WHERE product_id = ${product_id} AND location_id = ${location_id} 
         RETURNING *`;
      return NextResponse.json(result[0]);
    } else {
      const result = await sql`INSERT INTO stock (product_id, location_id, quantity) 
         VALUES (${product_id}, ${location_id}, ${quantity}) 
         RETURNING *`;
      return NextResponse.json(result[0]);
    }
  } catch (error) {
    console.error("Error creating/updating stock:", error);
    return NextResponse.json(
      { error: "Failed to create/update stock" },
      { status: 500 }
    );
  }
}
