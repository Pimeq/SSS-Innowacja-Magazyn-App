import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "");

export async function GET() {
  try {
    const products = await sql(
      "SELECT id, name, qr_code, description, created_at FROM products ORDER BY created_at DESC"
    );

    return NextResponse.json(products);
  } catch (error) {
    console.error("Products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, qr_code, description } = body;

    const result = await sql(
      "INSERT INTO products (name, qr_code, description, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *",
      [name, qr_code, description]
    );

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
