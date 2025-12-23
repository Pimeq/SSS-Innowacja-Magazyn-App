# Mobile App API Setup Guide

This guide explains how to configure the mobile Expo app to communicate with the
Next.js backend API.

## Overview

The mobile app connects to dedicated API endpoints that don't require user
authentication. Instead, they use a simple verification mechanism based on a
shared API key.

## Backend Setup (Next.js Web App)

### 1. Environment Variables

Add the mobile app key to your `Web/.env.local` file:

```env
MOBILE_APP_KEY=sss-mobile-app-2024
```

**Important**: Change this to a secure random string in production!

### 2. Available Endpoints

The following endpoints are available for the mobile app:

- `GET /api/mobile/products` - List all products
- `GET /api/mobile/locations` - List all locations
- `GET /api/mobile/stock/by-qr?qrCode=XXX` - Get stock by QR code
- `POST /api/mobile/stock/add` - Add stock to location

For detailed API documentation, see
[Web/src/app/api/mobile/README.md](../Web/src/app/api/mobile/README.md)

## Mobile App Setup (Expo)

### 1. Create API Configuration

Copy the example configuration file:

```bash
cd Mobile
cp api/config.example.ts api/config.ts
```

### 2. Configure Your Server URL

Edit `Mobile/api/config.ts`:

```typescript
export const API_CONFIG = {
	// For local development, use your computer's local IP address
	// Find it with: ipconfig (Windows) or ifconfig (Mac/Linux)
	BASE_URL: "http://192.168.1.100:3000/api/mobile", // Replace with your IP

	// Must match MOBILE_APP_KEY in Web/.env.local
	MOBILE_APP_KEY: "sss-mobile-app-2024",

	TIMEOUT: 10000,
}
```

**Finding Your Local IP Address:**

- **Windows**: Open CMD and run `ipconfig`, look for "IPv4 Address"
- **Mac/Linux**: Open Terminal and run `ifconfig`, look for "inet" under your
  network interface
- **Never use `localhost` or `127.0.0.1`** - these won't work from a mobile
  device/emulator

### 3. Usage Example

```typescript
import { apiClient } from "./api/config"

// In your component
const handleBarcodeScan = async (qrCode: string) => {
	try {
		// Get product info by QR code
		const result = await apiClient.getStockByQR(qrCode)

		if (result.success) {
			console.log("Product:", result.data.product)
			console.log("Stock:", result.data.stock)
		}
	} catch (error) {
		console.error("Error:", error)
	}
}

// Add stock after scanning
const handleAddStock = async (
	qrCode: string,
	locationId: number,
	quantity: number
) => {
	try {
		const result = await apiClient.addStock(qrCode, locationId, quantity)

		if (result.success) {
			alert("Stock added successfully!")
		}
	} catch (error) {
		console.error("Error adding stock:", error)
	}
}
```

## Testing the Connection

### 1. Start the Next.js Server

```bash
cd Web
npm run dev
```

The server should start on `http://localhost:3000`

### 2. Start the Expo App

```bash
cd Mobile
npx expo start
```

### 3. Test the API

Create a simple test in your mobile app:

```typescript
import { useEffect } from "react"
import { apiClient } from "./api/config"

function TestConnection() {
	useEffect(() => {
		const test = async () => {
			try {
				const products = await apiClient.getProducts()
				console.log("Connection successful!", products)
			} catch (error) {
				console.error("Connection failed:", error)
			}
		}

		test()
	}, [])

	return null
}
```

## Troubleshooting

### "Network request failed" or "Connection refused"

1. **Check your IP address** - Make sure you're using your computer's local IP,
   not localhost
2. **Same network** - Ensure your phone/emulator is on the same network as your
   computer
3. **Firewall** - Check if your firewall is blocking port 3000
4. **Server running** - Verify the Next.js dev server is running

### "Unauthorized - Mobile app access only"

1. **Check API key** - Ensure `MOBILE_APP_KEY` matches in both `.env.local` and
   `config.ts`
2. **Headers** - Verify the `x-mobile-app-key` header is being sent
3. **Restart** - Restart both the Next.js server and Expo app after changing
   environment variables

### "Product not found with this QR code"

1. **Database** - Ensure the product exists in the database with that QR code
2. **Case sensitivity** - QR codes are case-sensitive
3. **Whitespace** - Check for extra spaces in the QR code

## Production Deployment

### Backend (Next.js)

1. Deploy your Next.js app (e.g., Vercel, Netlify)
2. Set the `MOBILE_APP_KEY` environment variable
3. Note your production URL

### Mobile App

Update `Mobile/api/config.ts` with your production URL:

```typescript
export const API_CONFIG = {
	BASE_URL: "https://your-app.vercel.app/api/mobile",
	MOBILE_APP_KEY: "your-production-key",
	TIMEOUT: 10000,
}
```

## Security Considerations

⚠️ **Important**: The current implementation uses a simple shared key for
verification, which is suitable for internal apps but not for public production
use.

**For production, consider:**

1. Implementing proper API authentication (JWT, OAuth)
2. Adding rate limiting
3. Using HTTPS only
4. Rotating the API key regularly
5. Adding request logging and monitoring
6. Implementing user-specific access controls

## API Response Examples

### Get Products

```json
{
	"success": true,
	"data": [{ "id": 1, "name": "Widget A", "qr_code": "WGT001" }],
	"count": 1
}
```

### Add Stock

```json
{
	"success": true,
	"message": "Operacja zakończona sukcesem",
	"data": {
		"product": { "id": 1, "name": "Widget A", "qr_code": "WGT001" },
		"locationId": 2,
		"quantity": 10
	}
}
```

### Error Response

```json
{
	"success": false,
	"error": "Product not found with this QR code",
	"qrCode": "INVALID"
}
```

## Next Steps

1. Create UI components in the mobile app for:

   - Displaying product information after scanning
   - Selecting location from a dropdown
   - Entering quantity
   - Confirming stock addition

2. Add error handling and user feedback

3. Implement offline support with local storage

4. Add stock movement history tracking

For more details, see the
[full API documentation](../Web/src/app/api/mobile/README.md).
