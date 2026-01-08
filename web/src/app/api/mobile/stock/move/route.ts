import { NextRequest, NextResponse } from "next/server"
import { getOrCreateMobileSystemUserId, getProductByQrCode, processStockMovement } from "@/lib/db"
import { verifyMobileRequest } from "@/lib/mobileAuth"

interface MoveStockRequest {
	qrCode: string
	fromLocationId: number
	toLocationId: number
	quantity: number
}

export async function POST(request: NextRequest) {
	if (!verifyMobileRequest(request)) {
		return NextResponse.json(
			{ error: "Unauthorized - Mobile app access only" },
			{ status: 401 }
		)
	}

	try {
		const body: MoveStockRequest = await request.json()
		const { qrCode, fromLocationId, toLocationId, quantity } = body

		if (!qrCode || !fromLocationId || !toLocationId || !quantity) {
			return NextResponse.json(
				{
					success: false,
					error:
						"Missing required fields: qrCode, fromLocationId, toLocationId, quantity",
				},
				{ status: 400 }
			)
		}

		if (fromLocationId === toLocationId) {
			return NextResponse.json(
				{ success: false, error: "From and to locations must be different" },
				{ status: 400 }
			)
		}

		if (quantity <= 0) {
			return NextResponse.json(
				{ success: false, error: "Quantity must be greater than 0" },
				{ status: 400 }
			)
		}

		const product = await getProductByQrCode(qrCode)
		if (!product) {
			return NextResponse.json(
				{ success: false, error: "Product not found with this QR code", qrCode },
				{ status: 404 }
			)
		}

		const mobileUserId = await getOrCreateMobileSystemUserId()

		const result = await processStockMovement(
			mobileUserId,
			"MOVE",
			product.id,
			quantity,
			fromLocationId,
			toLocationId
		)

		if (!result.success) {
			return NextResponse.json(
				{ success: false, error: result.message },
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
					fromLocationId,
					toLocationId,
					quantity,
				},
			},
			{ status: 200 }
		)
	} catch (error) {
		console.error("Error moving stock from mobile:", error)
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		)
	}
}
