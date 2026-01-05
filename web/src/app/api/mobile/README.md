# Mobile API Endpoints

This document describes the API endpoints designed specifically for the mobile
Expo app to interface with the warehouse management system.

## Authentication

The mobile endpoints use a simple verification mechanism instead of full
authentication:

1. **Custom Header**: Include `x-mobile-app-key` header with the value from
   `MOBILE_APP_KEY` environment variable
2. **User Agent Detection**: The API also accepts requests from Expo/ReactNative
   user agents

### Environment Variable

Add to your `.env.local` file:

```env
MOBILE_APP_KEY=sss-mobile-app-2024
```

## Endpoints

### 1. List All Products

Get all products with their QR codes.

**Endpoint**: `GET /api/mobile/products`

**Headers**:

```
x-mobile-app-key: sss-mobile-app-2024
```

**Response**:

```json
{
	"success": true,
	"data": [
		{
			"id": 1,
			"name": "Product Name",
			"qr_code": "QR123456"
		}
	],
	"count": 1
}
```

---

### 2. List All Locations

Get all warehouse locations.

**Endpoint**: `GET /api/mobile/locations`

**Headers**:

```
x-mobile-app-key: sss-mobile-app-2024
```

**Response**:

```json
{
	"success": true,
	"data": [
		{
			"id": 1,
			"name": "Warehouse A"
		}
	],
	"count": 1
}
```

---

### 3. Get Stock by QR Code

Get product details and stock information across all locations by scanning a QR
code.

**Endpoint**: `GET /api/mobile/stock/by-qr?qrCode=QR123456`

**Headers**:

```
x-mobile-app-key: sss-mobile-app-2024
```

**Query Parameters**:

- `qrCode` (required): The QR code scanned from the product

**Response**:

```json
{
	"success": true,
	"data": {
		"product": {
			"id": 1,
			"name": "Product Name",
			"qr_code": "QR123456"
		},
		"stock": [
			{
				"id": 1,
				"locationId": 1,
				"locationName": "Warehouse A",
				"quantity": 50,
				"updatedAt": "2024-01-01T12:00:00Z"
			}
		],
		"totalQuantity": 50
	}
}
```

**Error Response** (Product not found):

```json
{
	"success": false,
	"error": "Product not found with this QR code",
	"qrCode": "QR123456"
}
```

---

### 4. Add Stock to Location

Add products to a specific location after scanning a QR code.

**Endpoint**: `POST /api/mobile/stock/add`

**Headers**:

```
Content-Type: application/json
x-mobile-app-key: sss-mobile-app-2024
```

**Request Body**:

```json
{
	"qrCode": "QR123456",
	"locationId": 1,
	"quantity": 10
}
```

**Request Fields**:

- `qrCode` (string, required): The scanned QR code
- `locationId` (number, required): The target location ID
- `quantity` (number, required): The quantity to add (must be > 0)

**Success Response**:

```json
{
	"success": true,
	"message": "Operacja zakończona sukcesem",
	"data": {
		"product": {
			"id": 1,
			"name": "Product Name",
			"qr_code": "QR123456"
		},
		"locationId": 1,
		"quantity": 10
	}
}
```

**Error Responses**:

Missing fields (400):

```json
{
	"success": false,
	"error": "Missing required fields: qrCode, locationId, quantity"
}
```

Invalid quantity (400):

```json
{
	"success": false,
	"error": "Quantity must be greater than 0"
}
```

Product not found (404):

```json
{
	"success": false,
	"error": "Product not found with this QR code",
	"qrCode": "QR123456"
}
```

---

## Mobile App Implementation Example

### Setup API Client

```typescript
// api/client.ts
const API_BASE_URL = "http://your-server.com/api/mobile"
const MOBILE_APP_KEY = "sss-mobile-app-2024"

const headers = {
	"Content-Type": "application/json",
	"x-mobile-app-key": MOBILE_APP_KEY,
}

export async function getProducts() {
	const response = await fetch(`${API_BASE_URL}/products`, { headers })
	return response.json()
}

export async function getLocations() {
	const response = await fetch(`${API_BASE_URL}/locations`, { headers })
	return response.json()
}

export async function getStockByQR(qrCode: string) {
	const response = await fetch(
		`${API_BASE_URL}/stock/by-qr?qrCode=${encodeURIComponent(qrCode)}`,
		{ headers }
	)
	return response.json()
}

export async function addStock(
	qrCode: string,
	locationId: number,
	quantity: number
) {
	const response = await fetch(`${API_BASE_URL}/stock/add`, {
		method: "POST",
		headers,
		body: JSON.stringify({ qrCode, locationId, quantity }),
	})
	return response.json()
}
```

### Example Usage in Mobile App

```typescript
import { addStock, getStockByQR } from "./api/client"

// After scanning a QR code
const handleQRScanned = async (qrCode: string) => {
	try {
		// First, get product info
		const stockInfo = await getStockByQR(qrCode)

		if (stockInfo.success) {
			// Show product details and allow user to select location and quantity
			// Then add stock
			const result = await addStock(qrCode, selectedLocationId, quantity)

			if (result.success) {
				alert("Stock added successfully!")
			} else {
				alert(result.error)
			}
		}
	} catch (error) {
		console.error("Error:", error)
	}
}
```

## Security Notes

⚠️ **Important**: This is a basic verification mechanism, not secure
authentication. For production:

1. Consider implementing proper API authentication (JWT tokens, OAuth, etc.)
2. Add rate limiting to prevent abuse
3. Use HTTPS only
4. Rotate the `MOBILE_APP_KEY` regularly
5. Consider adding user-specific tracking if needed
6. Implement additional validation and sanitization

## Database Schema Requirements

The mobile API requires the following database tables:

- `products` (id, name, qr_code)
- `locations` (id, name)
- `stock` (id, product_id, location_id, quantity, updated_at)
- `stock_history` (product_id, from_locations_id, to_locations_id, quantity,
  type, user_id)

Ensure these tables exist in your database before using the mobile API.
