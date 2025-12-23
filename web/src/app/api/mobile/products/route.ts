import { NextRequest, NextResponse } from "next/server"
import { createProduct, getAllProducts, getProductByQrCode, getProductTotals } from "@/lib/db"
import { verifyMobileRequest } from "@/lib/mobileAuth"

export async function GET(request: NextRequest) {
	// Verify this is a mobile app request
	if (!verifyMobileRequest(request)) {
		return NextResponse.json(
			{ error: "Unauthorized - Mobile app access only" },
			{ status: 401 }
		)
	}

	try {
		const products = await getAllProducts()
		const totals = await getProductTotals()
		const totalsMap = new Map<number, number>(totals.map(t => [t.product_id, Number(t.total_quantity) || 0]))
		const productsWithTotals = products.map(p => ({ ...p, total_quantity: totalsMap.get(p.id) ?? 0 }))
		return NextResponse.json(
			{
				success: true,
				data: productsWithTotals,
				count: products.length,
			},
			{
				headers: {
					"Cache-Control": "no-store, max-age=0",
				},
			}
		)
	} catch (error) {
		console.error("Error fetching products for mobile:", error)
		return NextResponse.json(
			{ success: false, error: "Failed to fetch products" },
			{ status: 500 }
		)
	}
}

export async function POST(request: NextRequest) {
	if (!verifyMobileRequest(request)) {
		return NextResponse.json(
			{ error: "Unauthorized - Mobile app access only" },
			{ status: 401 }
		)
	}

	try {
		const body = await request.json()
		const { qrCode, name } = body || {}

		if (!qrCode || !name) {
			return NextResponse.json(
				{ success: false, error: "Missing required fields: qrCode, name" },
				{ status: 400 }
			)
		}

		// If already exists, return it
		const existing = await getProductByQrCode(qrCode)
		if (existing) {
			return NextResponse.json(
				{ success: true, data: existing },
				{ status: 200 }
			)
		}

		const created = await createProduct(name, qrCode)
		if (!created) {
			return NextResponse.json(
				{ success: false, error: "Failed to create product" },
				{ status: 500 }
			)
		}

		return NextResponse.json({ success: true, data: created }, { status: 201 })
	} catch (error) {
		console.error("Error creating product from mobile:", error)
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		)
	}
}
