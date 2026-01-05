import { NextRequest, NextResponse } from "next/server"
import { getStockByLocation } from "@/lib/db"
import { verifyMobileRequest } from "@/lib/mobileAuth"

export async function GET(request: NextRequest) {
	if (!verifyMobileRequest(request)) {
		return NextResponse.json(
			{ error: "Unauthorized - Mobile app access only" },
			{ status: 401 }
		)
	}

	const { searchParams } = new URL(request.url)
	const locationIdParam = searchParams.get("locationId")
	const locationId = locationIdParam ? parseInt(locationIdParam, 10) : NaN
	if (!locationId || Number.isNaN(locationId)) {
		return NextResponse.json(
			{ success: false, error: "Missing or invalid locationId" },
			{ status: 400 }
		)
	}

	try {
		const items = await getStockByLocation(locationId)
		return NextResponse.json(
			{ success: true, data: items, count: items.length },
			{ headers: { "Cache-Control": "no-store, max-age=0" } }
		)
	} catch (e) {
		return NextResponse.json(
			{ success: false, error: "Failed to fetch stock by location" },
			{ status: 500 }
		)
	}
}
