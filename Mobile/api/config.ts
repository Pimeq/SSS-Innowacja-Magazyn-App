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
			data: Array<{ id: number; name: string; qr_code: string; total_quantity?: number }>
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
		const url = `${API_CONFIG.BASE_URL}/stock/by-qr?qrCode=${encodeURIComponent(qrCode)}`
		const response = await fetch(url, { headers: this.headers })
		let data: any = null
		try {
			data = await response.json()
		} catch {}

		if (response.status === 404) {
			return {
				success: false,
				notFound: true,
				error: data?.error || "Product not found",
			}
		}
		if (!response.ok) {
			throw new Error(data?.error || "Request failed")
		}
		return data as {
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
		}
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

	// Create a new product by QR code
	async createProduct(qrCode: string, name: string) {
		return this.request<{
			success: boolean
			data: { id: number; name: string; qr_code: string }
		}>("/products", {
			method: "POST",
			body: JSON.stringify({ qrCode, name }),
		})
	}

	// Get stock entries for a specific location
	async getStockByLocation(locationId: number) {
		return this.request<{
			success: boolean
			data: Array<{
				product_id: number
				product_name: string
				qr_code: string
				location_id: number
				location_name: string
				quantity: number
			}>
			count: number
		}>(`/stock/by-location?locationId=${locationId}`)
	}
}

// Export a singleton instance
export const apiClient = new ApiClient()
