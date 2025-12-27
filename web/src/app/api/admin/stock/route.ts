import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get("location_id");

    let query = `
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
    `;

    const params: any[] = [];

    if (locationId) {
      query += " WHERE s.location_id = $1";
      params.push(parseInt(locationId));
    }

    query += " ORDER BY s.updated_at DESC";

    const result = await sql(query, params.length > 0 ? params : []);
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

    const existingStock = await sql(
      "SELECT * FROM stock WHERE product_id = $1 AND location_id = $2",
      [product_id, location_id]
    );

    if (existingStock.length > 0) {
      const result = await sql(
        `UPDATE stock 
         SET quantity = quantity + $1, updated_at = NOW() 
         WHERE product_id = $2 AND location_id = $3 
         RETURNING *`,
        [quantity, product_id, location_id]
      );
      return NextResponse.json(result[0]);
    } else {
      const result = await sql(
        `INSERT INTO stock (product_id, location_id, quantity) 
         VALUES ($1, $2, $3) 
         RETURNING *`,
        [product_id, location_id, quantity]
      );
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
