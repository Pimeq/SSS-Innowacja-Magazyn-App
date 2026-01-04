import { neon } from "@neondatabase/serverless"
import bcrypt from "bcrypt"

const sql = neon(process.env.DATABASE_URL || "")

export interface User {
	id: number
	username: string
	first_name: string
	last_name: string
	password: string
	role: "admin" | "worker" | "viewer"
	created_at: Date
	updated_at: Date
	active: boolean
}

export interface Session {
	id: number
	user_id: number
	session_token: string
	expires: Date
	created_at: Date
}

export type Role = "worker" | "admin" | "viewer"

interface SessionJoinRow {
	id: number
	user_id: number
	session_token: string
	expires: Date
	created_at: Date
	username: string
	first_name: string
	last_name: string
	password: string
	role: string
	active: boolean
	user_created_at: Date
	updated_at: Date
}

// User functions

export async function getUserByUsername(
	username: string
): Promise<User | null> {
	try {
		const result = await sql`
      SELECT * FROM users WHERE username = ${username}
    `
		return result.length > 0 ? (result[0] as User) : null
	} catch (error) {
		console.error("Error getting user by username:", error)
		return null
	}
}

export async function getUserById(id: number): Promise<User | null> {
	try {
		const result = await sql`
      SELECT * FROM users WHERE id = ${id}
    `
		return result.length > 0 ? (result[0] as User) : null
	} catch (error) {
		console.error("Error getting user by id:", error)
		return null
	}
}

export async function createUser(
	username: string,
	password: string,
	first_name: string,
	last_name: string
): Promise<User | null> {
	try {
		const hashedPassword = await bcrypt.hash(password, 10)

		const result = await sql`
      INSERT INTO users (username, password, first_name, last_name)
      VALUES (${username}, ${hashedPassword}, ${first_name}, ${last_name})
      RETURNING *
    `
		return result.length > 0 ? (result[0] as User) : null
	} catch (error) {
		console.error("Error creating user:", error)
		return null
	}
}

export async function verifyPassword(
	password: string,
	hash: string
): Promise<boolean> {
	try {
		return await bcrypt.compare(password, hash)
	} catch (error) {
		console.error("Error verifying password:", error)
		return false
	}
}

export async function createSession(
	userId: number,
	expiresIn: number = 7 * 24 * 60 * 60 * 1000
): Promise<Session | null> {
	try {
		const sessionToken = `sess_${Math.random()
			.toString(36)
			.substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
		const expires = new Date(Date.now() + expiresIn)

		const result = await sql`
      INSERT INTO sessions (user_id, session_token, expires)
      VALUES (${userId}, ${sessionToken}, ${expires.toISOString()})
      RETURNING *
    `
		return result.length > 0 ? (result[0] as Session) : null
	} catch (error) {
		console.error("Error creating session:", error)
		return null
	}
}

export async function getSessionByToken(
	token: string
): Promise<(Session & { user: User }) | null> {
	try {
		const result = await sql`
      SELECT s.*, u.*, u.created_at as user_created_at 
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.session_token = ${token} AND s.expires > NOW()
    `

		if (result.length > 0) {
			const sessionRow = result[0] as unknown as SessionJoinRow

			return {
				id: sessionRow.id,
				user_id: sessionRow.user_id,
				session_token: sessionRow.session_token,
				expires: new Date(sessionRow.expires),
				created_at: new Date(sessionRow.created_at),
				user: {
					id: sessionRow.user_id,
					username: sessionRow.username,
					first_name: sessionRow.first_name,
					last_name: sessionRow.last_name,
					password: sessionRow.password,
					role: sessionRow.role as Role,
					created_at: new Date(
						sessionRow.user_created_at || sessionRow.created_at
					),
					updated_at: new Date(sessionRow.updated_at),
					active: sessionRow.active,
				},
			}
		}
		return null
	} catch (error) {
		console.error("Error getting session by token:", error)
		return null
	}
}

export async function deleteSession(token: string): Promise<boolean> {
	try {
		await sql`
      DELETE FROM sessions WHERE session_token = ${token}
    `
		return true
	} catch (error) {
		console.error("Error deleting session:", error)
		return false
	}
}

export async function cleanupExpiredSessions(): Promise<void> {
	try {
		await sql`
      DELETE FROM sessions WHERE expires < NOW()
    `
	} catch (error) {
		console.error("Error cleaning up expired sessions:", error)
	}
}

// --- STOCK MANAGEMENT FUNCTIONS ---

export interface ProductSimple {
	id: number
	name: string
	qr_code: string
}

export interface LocationSimple {
	id: number
	name: string
}

export async function getAllProducts(): Promise<ProductSimple[]> {
	try {
		const result =
			await sql`SELECT id, name, qr_code FROM products ORDER BY name ASC`
		return result as ProductSimple[]
	} catch (error) {
		console.error("Error fetching products:", error)
		return []
	}
}

export async function getProductTotals(): Promise<Array<{ product_id: number; total_quantity: number }>> {
	try {
		const result = await sql`
			SELECT product_id, SUM(quantity) as total_quantity
			FROM stock
			GROUP BY product_id
		`
		return result as Array<{ product_id: number; total_quantity: number }>
	} catch (error) {
		console.error("Error fetching product totals:", error)
		return []
	}
}

export async function getProductByQrCode(
	qrCode: string
): Promise<ProductSimple | null> {
	try {
		const result = await sql`
      SELECT id, name, qr_code FROM products 
      WHERE qr_code = ${qrCode}
      LIMIT 1
    `
		return result.length > 0 ? (result[0] as ProductSimple) : null
	} catch (error) {
		console.error("Error fetching product by QR code:", error)
		return null
	}
}

export async function createProduct(
	name: string,
	qrCode: string
): Promise<ProductSimple | null> {
	try {
		// Avoid duplicates: check first
		const existing = await getProductByQrCode(qrCode)
		if (existing) return existing

		const result = await sql`
			INSERT INTO products (name, qr_code)
			VALUES (${name}, ${qrCode})
			RETURNING id, name, qr_code
		`
		return result.length > 0 ? (result[0] as ProductSimple) : null
	} catch (error) {
		console.error("Error creating product:", error)
		return null
	}
}

export async function getAllLocations(): Promise<LocationSimple[]> {
	try {
		const result = await sql`SELECT id, name FROM locations ORDER BY name ASC`
		return result as LocationSimple[]
	} catch (error) {
		console.error("Error fetching locations:", error)
		return []
	}
}

export async function getStockQuantity(
	productId: number,
	locationId: number
): Promise<number> {
	const result = await sql`
    SELECT quantity FROM stock 
    WHERE product_id = ${productId} AND location_id = ${locationId}
  `
	return result.length > 0 ? result[0].quantity : 0
}

export async function processStockMovement(
	userId: number,
	type: "IN" | "OUT" | "MOVE",
	productId: number,
	quantity: number,
	fromLocationId: number | null,
	toLocationId: number | null
): Promise<{ success: boolean; message: string }> {
	if (quantity <= 0)
		return { success: false, message: "Ilość musi być dodatnia" }

	try {
		if (type === "OUT" || type === "MOVE") {
			if (!fromLocationId)
				return { success: false, message: "Brak lokalizacji źródłowej" }

			const currentQty = await getStockQuantity(productId, fromLocationId)
			if (currentQty < quantity) {
				return {
					success: false,
					message: `Brak wystarczającej ilości towaru (Dostępne: ${currentQty})`,
				}
			}

			await sql`
        UPDATE stock 
        SET quantity = quantity - ${quantity}, updated_at = NOW()
        WHERE product_id = ${productId} AND location_id = ${fromLocationId}
      `

			await sql`DELETE FROM stock WHERE quantity = 0 AND product_id = ${productId} AND location_id = ${fromLocationId}`
		}

		if (type === "IN" || type === "MOVE") {
			if (!toLocationId)
				return { success: false, message: "Brak lokalizacji docelowej" }

			const existing = await sql`
        SELECT id FROM stock WHERE product_id = ${productId} AND location_id = ${toLocationId}
      `

			if (existing.length > 0) {
				await sql`
          UPDATE stock 
          SET quantity = quantity + ${quantity}, updated_at = NOW()
          WHERE product_id = ${productId} AND location_id = ${toLocationId}
        `
			} else {
				await sql`
          INSERT INTO stock (product_id, location_id, quantity)
          VALUES (${productId}, ${toLocationId}, ${quantity})
        `
			}
		}

		// Insert history entry, but do not fail the whole operation if it errors
		await safeInsertStockHistory(
			productId,
			fromLocationId,
			toLocationId,
			quantity,
			type,
			userId
		)

		return { success: true, message: "Operacja zakończona sukcesem" }
	} catch (error) {
		console.error("Stock transaction error:", error)
		return { success: false, message: "Błąd bazy danych podczas operacji" }
	}
}

export interface StockItemDetailed {
	id: number
	product_id: number
	location_id: number
	product_name: string
	qr_code: string
	location_name: string
	quantity: number
	updated_at: Date
}

type StockItemDetailedRow = Omit<StockItemDetailed, "updated_at"> & {
	updated_at: string | Date
}

export async function getStockList(): Promise<StockItemDetailed[]> {
	try {
		const result = await sql`
			SELECT 
				s.id as id,
				s.product_id as product_id,
				s.location_id as location_id,
				p.name as product_name,
				p.qr_code as qr_code,
				l.name as location_name,
				s.quantity as quantity,
				s.updated_at as updated_at
			FROM stock s
			JOIN products p ON s.product_id = p.id
			JOIN locations l ON s.location_id = l.id
			ORDER BY p.name ASC, l.name ASC
		`

		return (result as StockItemDetailedRow[]).map((row) => ({
			...row,
			updated_at: new Date(row.updated_at),
		}))
	} catch (error) {
		console.error("Error fetching stock list:", error)
		return []
	}
}

export interface ProductQuantityAtLocation {
	product_id: number
	product_name: string
	qr_code: string
	location_id: number
	location_name: string
	quantity: number
}

export async function getStockByLocation(
	locationId: number
): Promise<ProductQuantityAtLocation[]> {
	try {
		const result = await sql`
			SELECT 
				p.id as product_id,
				p.name as product_name,
				p.qr_code as qr_code,
				l.id as location_id,
				l.name as location_name,
				s.quantity as quantity
			FROM stock s
			JOIN products p ON s.product_id = p.id
			JOIN locations l ON s.location_id = l.id
			WHERE s.location_id = ${locationId}
			ORDER BY p.name ASC
		`
		return result as ProductQuantityAtLocation[]
	} catch (error) {
		console.error("Error fetching stock by location:", error)
		return []
	}
}

export async function safeInsertStockHistory(
	productId: number,
	fromLocationId: number | null,
	toLocationId: number | null,
	quantity: number,
	type: "IN" | "OUT" | "MOVE",
	userId: number
): Promise<void> {
	try {
		await sql`
			INSERT INTO stock_history (
				product_id, from_locations_id, to_locations_id, quantity, type, user_id
			) VALUES (
				${productId}, ${fromLocationId}, ${toLocationId}, ${quantity}, ${type}, ${userId}
			)
		`
	} catch (error) {
		// Do not throw: history table or columns may not exist yet; log and continue
		console.warn("Warning: failed to insert stock_history entry:", error)
	}
}
