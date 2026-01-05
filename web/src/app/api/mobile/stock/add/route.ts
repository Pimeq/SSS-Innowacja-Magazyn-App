import { NextRequest, NextResponse } from "next/server"
import { getProductByQrCode, processStockMovement } from "@/lib/db"
import { verifyMobileRequest } from "@/lib/mobileAuth"

interface AddStockRequest {
	qrCode: string
	locationId: number
	quantity: number
}

export async function POST(request: NextRequest) {
	// Verify this is a mobile app request
	if (!verifyMobileRequest(request)) {
		return NextResponse.json(
			{ error: "Unauthorized - Mobile app access only" },
			{ status: 401 }
		)
	}

	try {
		const body: AddStockRequest = await request.json()
		const { qrCode, locationId, quantity } = body

		// Validate input
		if (!qrCode || !locationId || !quantity) {
			return NextResponse.json(
				{
					success: false,
					error: "Missing required fields: qrCode, locationId, quantity",
				},
				{ status: 400 }
			)
		}

		if (quantity <= 0) {
			return NextResponse.json(
				{
					success: false,
					error: "Quantity must be greater than 0",
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

		// For mobile app, we use a special user ID (0) to indicate mobile operations
		// You can modify this to use a specific "mobile app" user or system user
		const MOBILE_USER_ID = 0

		// Process stock addition (type 'IN' means adding stock to a location)
		const result = await processStockMovement(
			MOBILE_USER_ID,
			"IN",
			product.id,
			quantity,
			null, // fromLocationId is null for IN operations
			locationId
		)

		if (!result.success) {
			return NextResponse.json(
				{
					success: false,
					error: result.message,
				},
				{ status: 400 }
			)
		}

		return NextResponse.json(
			{
				success: true,
				message: result.message,
				data: {
					product: {
						id: product.id,
						name: product.name,
						qr_code: product.qr_code,
					},
					locationId,
					quantity,
				},
			},
			{ status: 200 }
		)
	} catch (error) {
		console.error("Error adding stock from mobile:", error)
		return NextResponse.json(
			{
				success: false,
				error: "Internal server error",
			},
			{ status: 500 }
		)
	}
}
