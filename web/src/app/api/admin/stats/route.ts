import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "");

export async function GET() {
  try {
    const products = await sql("SELECT COUNT(*) as count FROM products");
    const users = await sql(
      "SELECT COUNT(*) as count FROM users WHERE active = true"
    );
    const locations = await sql("SELECT COUNT(*) as count FROM locations");
    const stock = await sql(
      "SELECT SUM(quantity) as total FROM stock"
    );

    return NextResponse.json({
      totalProducts: products[0]?.count || 0,
      activeUsers: users[0]?.count || 0,
      totalLocations: locations[0]?.count || 0,
      totalStockValue: stock[0]?.total || 0,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
