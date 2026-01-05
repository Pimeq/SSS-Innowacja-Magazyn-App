import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "");

export async function PUT(
  request: Request,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { name, qr_code, description } = body;
    const resolvedParams = await context.params;
    const id = Number.parseInt(resolvedParams.id, 10);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
    }

    const result = await sql`UPDATE products SET name = ${name}, qr_code = ${qr_code}, description = ${description} WHERE id = ${id} RETURNING *`;

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
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
    const id = Number.parseInt(resolvedParams.id, 10);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
    }

    // Best-effort cleanup to avoid FK constraint failures.
    // If the DB already has ON DELETE CASCADE, these are no-ops.
    try {
      await sql`DELETE FROM stock_history WHERE product_id = ${id}`;
    } catch (error) {
      console.warn("Failed to cleanup stock_history for product:", id, error);
    }

    try {
      await sql`DELETE FROM stock WHERE product_id = ${id}`;
    } catch (error) {
      console.warn("Failed to cleanup stock for product:", id, error);
    }

    const result = await sql`DELETE FROM products WHERE id = ${id} RETURNING id`;
    if (result.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      {
        error: "Failed to delete product",
        ...(process.env.NODE_ENV !== "production" && {
          details:
            error instanceof Error
              ? { message: error.message, name: error.name, stack: error.stack }
              : String(error),
        }),
      },
      { status: 500 }
    );
  }
}
