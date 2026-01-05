import { NextRequest, NextResponse } from "next/server"
import { getAllLocations } from "@/lib/db"
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
		const locations = await getAllLocations()
		return NextResponse.json(
			{
				success: true,
				data: locations,
				count: locations.length,
			},
			{
				headers: {
					"Cache-Control": "no-store, max-age=0",
				},
			}
		)
	} catch (error) {
		console.error("Error fetching locations for mobile:", error)
		return NextResponse.json(
			{ success: false, error: "Failed to fetch locations" },
			{ status: 500 }
		)
	}
}
