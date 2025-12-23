# 🚀 Mobile API Quick Reference

## Setup Checklist

### Backend (Next.js)

- [ ] Add to `Web/.env.local`: `MOBILE_APP_KEY=sss-mobile-app-2024`
- [ ] Run `npm install` in Web directory
- [ ] Start server: `npm run dev`
- [ ] Server runs at: `http://localhost:3000`

### Mobile (Expo)

- [ ] Copy `Mobile/api/config.example.ts` → `Mobile/api/config.ts`
- [ ] Update `BASE_URL` with your local IP
- [ ] Run `npm install` (if needed)
- [ ] Start app: `npx expo start`

## Find Your Local IP

**Windows:**

```bash
ipconfig
# Look for: IPv4 Address (e.g., 192.168.1.100)
```

**Mac/Linux:**

```bash
ifconfig
# Look for: inet (e.g., 192.168.1.100)
```

## API Endpoints

```
GET  /api/mobile/products
GET  /api/mobile/locations
GET  /api/mobile/stock/by-qr?qrCode=XXX
POST /api/mobile/stock/add
```

## Mobile Code Example

```typescript
import { apiClient } from "./api/config"

// Get products
const products = await apiClient.getProducts()

// Get locations
const locations = await apiClient.getLocations()

// Scan and get stock info
const stock = await apiClient.getStockByQR("QR123")

// Add stock
const result = await apiClient.addStock("QR123", locationId, 10)
```

## Common Issues

| Problem                  | Solution                          |
| ------------------------ | --------------------------------- |
| "Network request failed" | Use local IP, not localhost       |
| "Unauthorized"           | Check MOBILE_APP_KEY matches      |
| "Product not found"      | Verify QR code exists in database |
| Can't connect            | Ensure same WiFi network          |

## Response Format

All endpoints return:

```json
{
  "success": true/false,
  "data": {...},        // on success
  "error": "message"    // on failure
}
```

## Header Required

```
x-mobile-app-key: sss-mobile-app-2024
```

## Documentation

- Full API Docs: `Web/src/app/api/mobile/README.md`
- Setup Guide: `MOBILE_API_SETUP.md`
- Implementation Details: `MOBILE_API_IMPLEMENTATION.md`

---

**Ready to go!** 🎉
