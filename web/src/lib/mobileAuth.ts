import { NextRequest } from "next/server"

// Simple mobile app verification using a custom header
// This is not secure authentication, just a way to identify mobile app requests
const MOBILE_APP_KEY = process.env.MOBILE_APP_KEY || "sss-mobile-app-2024"

export function verifyMobileRequest(request: NextRequest): boolean {
	const mobileKey = request.headers.get("x-mobile-app-key")
	const userAgent = request.headers.get("user-agent") || ""

	// Check if the request has the mobile app key header
	// OR if the user agent indicates it's from the Expo mobile app
	return (
		mobileKey === MOBILE_APP_KEY ||
		userAgent.includes("Expo") ||
		userAgent.includes("ReactNative")
	)
}

export function getMobileAppKey(): string {
	return MOBILE_APP_KEY
}
