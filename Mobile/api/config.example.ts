// Mobile App API Configuration
// Copy this file to config.ts and update with your actual values

export const API_CONFIG = {
	// Your Next.js server URL
	// For local development with Expo:
	// - Use your computer's local IP address (not localhost)
	// - Example: 'http://192.168.1.100:3000/api/mobile'
	// For production:
	// - Use your deployed Next.js app URL
	// - Example: 'https://your-app.vercel.app/api/mobile'
	BASE_URL: "http://10.0.0.72:3000/api/mobile",

	// Mobile app key - must match MOBILE_APP_KEY in your Web/.env.local
	MOBILE_APP_KEY: "sss-mobile-app-2024",

	// Request timeout in milliseconds
	TIMEOUT: 10000,
}

// API Client with built-in authentication
export class ApiClient {
	private headers: HeadersInit

	constructor() {
		this.headers = {
			"Content-Type": "application/json",
			"x-mobile-app-key": API_CONFIG.MOBILE_APP_KEY,
		}
	}

	private async request<T>(
		endpoint: string,
		options?: RequestInit
	): Promise<T> {
		const url = `${API_CONFIG.BASE_URL}${endpoint}`

		try {
			const response = await fetch(url, {
				...options,
				headers: {
					...this.headers,
					...options?.headers,
				},
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || "Request failed")
			}

			return data
		} catch (error) {
			console.error("API Request Error:", error)
			throw error
		}
	}

	// Get all products
	async getProducts() {
		return this.request<{
			success: boolean
			data: Array<{ id: number; name: string; qr_code: string }>
			count: number
		}>("/products")
	}

	// Get all locations
	async getLocations() {
		return this.request<{
			success: boolean
			data: Array<{ id: number; name: string }>
			count: number
		}>("/locations")
	}

	// Get stock information by QR code
	async getStockByQR(qrCode: string) {
		return this.request<{
			success: boolean
			data: {
				product: { id: number; name: string; qr_code: string }
				stock: Array<{
					id: number
					locationId: number
					locationName: string
					quantity: number
					updatedAt: string
				}>
				totalQuantity: number
			}
		}>(`/stock/by-qr?qrCode=${encodeURIComponent(qrCode)}`)
	}

	// Add stock to a location
	async addStock(qrCode: string, locationId: number, quantity: number) {
		return this.request<{
			success: boolean
			message: string
			data: {
				product: { id: number; name: string; qr_code: string }
				locationId: number
				quantity: number
			}
		}>("/stock/add", {
			method: "POST",
			body: JSON.stringify({ qrCode, locationId, quantity }),
		})
	}
}

// Export a singleton instance
export const apiClient = new ApiClient()
