import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/__nextauth/authOptions";

const sql = neon(process.env.DATABASE_URL!);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get("location_id");
    const productId = searchParams.get("product_id");

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
    } else if (productId) {
      const prodId = parseInt(productId);
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
        WHERE s.product_id = ${prodId}
        ORDER BY l.name ASC
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
    const session = await getServerSession(authOptions);
    const actorId = session?.user?.id ? parseInt(session.user.id) : null;

    const existingStock = await sql`SELECT * FROM stock WHERE product_id = ${product_id} AND location_id = ${location_id}`;

    if (existingStock.length > 0) {
      const result = await sql`UPDATE stock 
         SET quantity = quantity + ${quantity}, updated_at = NOW() 
         WHERE product_id = ${product_id} AND location_id = ${location_id} 
         RETURNING *`;
      // Log adjustment in history (from = to = location)
      if (actorId !== null && Number.isFinite(actorId)) {
        try {
          await sql`INSERT INTO stock_history (product_id, from_locations_id, to_locations_id, quantity, type, user_id, created_at) 
            VALUES (${product_id}, ${location_id}, ${location_id}, ${quantity}, ${"stock_add"}, ${actorId}, NOW())`;
        } catch (historyError) {
          console.warn("Stock updated but failed to write history:", historyError);
        }
      }
      return NextResponse.json(result[0]);
    } else {
      const result = await sql`INSERT INTO stock (product_id, location_id, quantity) 
         VALUES (${product_id}, ${location_id}, ${quantity}) 
         RETURNING *`;
      // Log creation/add in history (from = to = location)
      if (actorId !== null && Number.isFinite(actorId)) {
        try {
          await sql`INSERT INTO stock_history (product_id, from_locations_id, to_locations_id, quantity, type, user_id, created_at) 
            VALUES (${product_id}, ${location_id}, ${location_id}, ${quantity}, ${"stock_add"}, ${actorId}, NOW())`;
        } catch (historyError) {
          console.warn("Stock inserted but failed to write history:", historyError);
        }
      }
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
