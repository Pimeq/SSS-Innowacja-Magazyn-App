import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "");

export async function GET() {
  try {
    const locations = await sql(
      "SELECT id, name, description FROM locations ORDER BY name ASC"
    );

    return NextResponse.json(locations);
  } catch (error) {
    console.error("Locations error:", error);
    return NextResponse.json(
      { error: "Failed to fetch locations" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description } = body;

    const result = await sql(
      "INSERT INTO locations (name, description) VALUES ($1, $2) RETURNING *",
      [name, description]
    );

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Create location error:", error);
    return NextResponse.json(
      { error: "Failed to create location" },
      { status: 500 }
    );
  }
}
