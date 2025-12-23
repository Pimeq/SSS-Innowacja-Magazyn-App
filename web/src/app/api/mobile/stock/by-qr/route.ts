import { NextRequest, NextResponse } from "next/server"
import { getProductByQrCode } from "@/lib/db"
import { verifyMobileRequest } from "@/lib/mobileAuth"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL || "")

export async function GET(request: NextRequest) {
	// Verify this is a mobile app request
	if (!verifyMobileRequest(request)) {
		return NextResponse.json(
			{ error: "Unauthorized - Mobile app access only" },
			{ status: 401 }
		)
	}

	try {
		const { searchParams } = new URL(request.url)
		const qrCode = searchParams.get("qrCode")

		if (!qrCode) {
			return NextResponse.json(
				{
					success: false,
					error: "Missing qrCode parameter",
				},
				{ status: 400 }
			)
		}

		// Find product by QR code
		const product = await getProductByQrCode(qrCode)
		if (!product) {
			return NextResponse.json(
				{
					success: false,
					error: "Product not found with this QR code",
					qrCode,
				},
				{ status: 404 }
			)
		}

		// Get stock information for this product across all locations
		const stockData = await sql`
      SELECT 
        s.id,
        s.location_id,
        l.name as location_name,
        s.quantity,
        s.updated_at
      FROM stock s
      JOIN locations l ON s.location_id = l.id
      WHERE s.product_id = ${product.id}
      ORDER BY l.name ASC
    `

		return NextResponse.json(
			{
				success: true,
				data: {
					product: {
						id: product.id,
						name: product.name,
						qr_code: product.qr_code,
					},
					stock: stockData.map((row: any) => ({
						id: row.id,
						locationId: row.location_id,
						locationName: row.location_name,
						quantity: row.quantity,
						updatedAt: new Date(row.updated_at),
					})),
					totalQuantity: stockData.reduce(
						(sum: number, row: any) => sum + row.quantity,
						0
					),
				},
			},
			{
				headers: {
					"Cache-Control": "no-store, max-age=0",
				},
			}
		)
	} catch (error) {
		console.error("Error fetching stock by QR code for mobile:", error)
		return NextResponse.json(
			{
				success: false,
				error: "Internal server error",
			},
			{ status: 500 }
		)
	}
}
