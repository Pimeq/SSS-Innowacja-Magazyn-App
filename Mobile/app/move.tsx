import { Ionicons } from "@expo/vector-icons"
import { CameraView, useCameraPermissions } from "expo-camera"
import { useRouter } from "expo-router"
import { useEffect, useRef, useState } from "react"
import {
	ActivityIndicator,
	Alert,
	Animated,
	Easing,
	ScrollView,
	StatusBar,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native"
import { apiClient } from "../api/config"

function normalizeScannedCode(raw: string): string {
	const trimmed = (raw || "").trim()
	if (!trimmed) return ""

	// Common patterns: "QR: XXXXX" or similar prefixes
	const withoutPrefix = trimmed.replace(/^\s*(qr|qrcode)\s*:\s*/i, "")

	// If it's a URL / deep link, try to extract a query param
	// Example: https://example.com/?qrCode=ABC123
	const match = withoutPrefix.match(/[?&](qrCode|qrcode|qr|code)=([^&#]+)/i)
	if (match?.[2]) {
		try {
			return decodeURIComponent(match[2]).trim()
		} catch {
			return match[2].trim()
		}
	}

	return withoutPrefix
}

export default function Move() {
	const router = useRouter()
	const [permission, requestPermission] = useCameraPermissions()
	const [scanned, setScanned] = useState(false)
	const [scannedRawData, setScannedRawData] = useState<string>("")
	const [scannedData, setScannedData] = useState<string>("")

	const [loading, setLoading] = useState(false)
	const [submitting, setSubmitting] = useState(false)

	const [productName, setProductName] = useState<string>("")
	const [totalQty, setTotalQty] = useState<number>(0)
	const [productMissing, setProductMissing] = useState(false)

	const [locations, setLocations] = useState<Array<{ id: number; name: string }>>(
		[]
	)
	const [stockRows, setStockRows] = useState<
		Array<{ locationId: number; locationName: string; quantity: number }>
	>([])

	const [fromLocationId, setFromLocationId] = useState<number | null>(null)
	const [toLocationId, setToLocationId] = useState<number | null>(null)
	const [quantity, setQuantity] = useState<string>("1")
	const [lastSuccess, setLastSuccess] = useState<
		{ qty: number; from: string; to: string } | null
	>(null)

	// Animation for scan line
	const scanAnim = useRef(new Animated.Value(0)).current

	useEffect(() => {
		if (!scanned) {
			scanAnim.setValue(0)
			Animated.loop(
				Animated.sequence([
					Animated.timing(scanAnim, {
						toValue: 1,
						duration: 2000,
						easing: Easing.linear,
						useNativeDriver: true,
					}),
					Animated.timing(scanAnim, {
						toValue: 0,
						duration: 0,
						useNativeDriver: true,
					}),
				])
			).start()
		} else {
			scanAnim.stopAnimation()
		}
	}, [scanned, scanAnim])

	const translateY = scanAnim.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 280],
	})

	useEffect(() => {
		const loadData = async () => {
			if (!scanned || !scannedRawData) return
			setLoading(true)
			setLastSuccess(null)
			setProductName("")
			setTotalQty(0)
			setProductMissing(false)
			setStockRows([])
			setLocations([])
			setFromLocationId(null)
			setToLocationId(null)

			try {
				const raw = (scannedRawData || "").trim()
				const normalized = normalizeScannedCode(raw)
				const candidates = Array.from(
					new Set([raw, normalized].filter((v) => (v || "").trim().length > 0))
				)

				let stockRes: any = null
				let resolvedQr: string | null = null
				for (const candidate of candidates) {
					try {
						const res: any = await apiClient.getStockByQR(candidate)
						if (res?.success) {
							stockRes = res
							resolvedQr = candidate
							break
						}
						if (res?.notFound) {
							stockRes = res
							continue
						}
						stockRes = res
					} catch (e) {
						// non-404 errors should bubble up
						throw e
					}
				}

				if (resolvedQr && resolvedQr !== scannedData) {
					setScannedData(resolvedQr)
				} else if (!scannedData) {
					setScannedData(raw)
				}

				if (stockRes?.success) {
					setProductName(stockRes.data.product.name)
					setTotalQty(stockRes.data.totalQuantity)
					setStockRows(
						stockRes.data.stock.map((s: any) => ({
							locationId: s.locationId,
							locationName: s.locationName,
							quantity: s.quantity,
						}))
					)
				} else if (stockRes?.notFound) {
					setProductMissing(true)
				}

				const locRes = await apiClient.getLocations()
				if (locRes.success) {
					setLocations(locRes.data)

					// Defaults: from = first location with stock > 0 (or first), to = first different
					const stockFirst = stockRes?.success
						? stockRes.data.stock.find((s: any) => (s.quantity || 0) > 0)
						: null
					const defaultFrom = stockFirst?.locationId ?? locRes.data[0]?.id ?? null
					const defaultTo =
						locRes.data.find((l: any) => l.id !== defaultFrom)?.id ??
						locRes.data[0]?.id ??
						null
					setFromLocationId(defaultFrom)
					setToLocationId(defaultTo)
				}
			} catch (err: any) {
				Alert.alert("Error", err?.message || "Failed to load data")
			} finally {
				setLoading(false)
			}
		}
		loadData()
	}, [scanned, scannedRawData])

	useEffect(() => {
		if (!lastSuccess) return
		const t = setTimeout(() => setLastSuccess(null), 3000)
		return () => clearTimeout(t)
	}, [lastSuccess])

	const maxQtyFromLocation =
		fromLocationId ?
			stockRows.find((r) => r.locationId === fromLocationId)?.quantity ?? 0
		: 	0

	useEffect(() => {
		// Keep quantity within [0..max] (if max<=0, set 0)
		if (!fromLocationId) return
		const max = maxQtyFromLocation
		const current = parseInt(quantity || "0", 10)
		const currentSafe = Number.isFinite(current) ? current : 0
		if (max <= 0) {
			if (quantity !== "0") setQuantity("0")
			return
		}
		if (currentSafe <= 0) {
			setQuantity("1")
			return
		}
		if (currentSafe > max) {
			setQuantity(String(max))
		}
	}, [fromLocationId, stockRows, maxQtyFromLocation])

	const handleBarcodeScanned = ({ data }: { type: string; data: string }) => {
		const raw = (data || "").trim()
		setScanned(true)
		setScannedRawData(raw)
		setScannedData(raw)
	}

	const handleMove = async () => {
		if (!scannedData) return
		const qty = parseInt(quantity || "0", 10)
		if (!fromLocationId || !toLocationId) {
			Alert.alert("Select Locations", "Please choose source and target locations")
			return
		}
		if (fromLocationId === toLocationId) {
			Alert.alert("Invalid", "Source and target locations must be different")
			return
		}
		if (!qty || qty <= 0) {
			Alert.alert("Invalid Quantity", "Quantity must be greater than 0")
			return
		}
		if (fromLocationId && qty > maxQtyFromLocation) {
			Alert.alert(
				"Invalid Quantity",
				`Quantity cannot exceed available stock (max: ${maxQtyFromLocation})`
			)
			return
		}
		if (productMissing) {
			Alert.alert("Not Found", "Product not found for this QR")
			return
		}

		try {
			setSubmitting(true)
			const res = await apiClient.moveStock(
				scannedData,
				fromLocationId,
				toLocationId,
				qty
			)
			if (res.success) {
				const fromName =
					locations.find((l) => l.id === fromLocationId)?.name || "From"
				const toName =
					locations.find((l) => l.id === toLocationId)?.name || "To"
				setLastSuccess({ qty, from: fromName, to: toName })
				setQuantity("1")

				setStockRows((prev) => {
					const next = [...prev]
					const fromIdx = next.findIndex((r) => r.locationId === fromLocationId)
					if (fromIdx >= 0) {
						next[fromIdx] = {
							...next[fromIdx],
							quantity: Math.max(0, next[fromIdx].quantity - qty),
						}
						if (next[fromIdx].quantity === 0) {
							next.splice(fromIdx, 1)
						}
					}

					const toIdx = next.findIndex((r) => r.locationId === toLocationId)
					if (toIdx >= 0) {
						next[toIdx] = { ...next[toIdx], quantity: next[toIdx].quantity + qty }
					} else {
						next.push({
							locationId: toLocationId,
							locationName: toName,
							quantity: qty,
						})
					}
					return next
				})
			}
		} catch (err: any) {
			Alert.alert("Move Failed", err?.message || "Unable to move items")
		} finally {
			setSubmitting(false)
		}
	}

	if (!permission) {
		return <View className="flex-1 bg-black" />
	}

	if (!permission.granted) {
		return (
			<View className="flex-1 bg-gray-900 justify-center items-center px-6">
				<View className="bg-gray-800 p-6 rounded-2xl items-center w-full max-w-sm">
					<View className="bg-gray-700 p-4 rounded-full mb-4">
						<Ionicons name="camera-outline" size={32} color="#9ca3af" />
					</View>
					<Text className="text-white text-xl font-bold mb-2 text-center">
						Camera Access Required
					</Text>
					<Text className="text-gray-400 text-center mb-6">
						We need permission to access your camera to scan barcodes.
					</Text>
					<TouchableOpacity
						onPress={requestPermission}
						className="bg-blue-600 w-full py-3 rounded-xl active:bg-blue-700">
						<Text className="text-white text-center font-bold text-lg">
							Grant Permission
						</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => router.back()} className="mt-4 py-2">
						<Text className="text-gray-500 font-medium">Cancel</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}

	return (
		<View className="flex-1 bg-black">
			<StatusBar barStyle="light-content" />
			<CameraView
				style={{ flex: 1 }}
				onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
				barcodeScannerSettings={{
					barcodeTypes: [
						"qr",
						"pdf417",
						"aztec",
						"ean13",
						"ean8",
						"code39",
						"code93",
						"code128",
						"datamatrix",
						"itf14",
						"upc_a",
						"upc_e",
					],
				}}
			/>

			<View className="absolute inset-0 z-10">
				<View className="flex-1 bg-black/60 pt-12 px-6">
					<View className="flex-row justify-between items-center">
						<TouchableOpacity
							className="bg-white/20 p-2 rounded-full backdrop-blur-md"
							onPress={() => router.back()}>
							<Ionicons name="arrow-back" size={24} color="white" />
						</TouchableOpacity>
						<Text className="text-white font-bold text-lg tracking-wider">
							MOVE
						</Text>
						<View className="w-10" />
					</View>
				</View>

				<View className="flex-row h-[280px]">
					<View className="flex-1 bg-black/60" />
					<View className="w-[280px] h-[280px] relative">
						<View className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-blue-500 rounded-tl-2xl" />
						<View className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-blue-500 rounded-tr-2xl" />
						<View className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-blue-500 rounded-bl-2xl" />
						<View className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-blue-500 rounded-br-2xl" />

						{!scanned && (
							<Animated.View
								style={{
									height: 2,
									backgroundColor: "#60a5fa",
									width: "100%",
									shadowColor: "#60a5fa",
									shadowOpacity: 1,
									shadowRadius: 10,
									elevation: 5,
									transform: [{ translateY }],
								}}
							/>
						)}
					</View>
					<View className="flex-1 bg-black/60" />
				</View>

				<View className="flex-1 bg-black/60 items-center pt-10 px-8">
					<Text className="text-white/80 text-center text-base font-medium">
						{scanned
							? "Product Scanned!"
							: "Align the QR within the frame to scan"}
					</Text>
				</View>
			</View>

			{scanned && (
				<View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 z-20 shadow-2xl">
					<View className="items-center mb-6">
						<View className="w-12 h-1.5 bg-gray-300 rounded-full mb-6" />
						<View className="bg-indigo-100 p-4 rounded-full mb-4">
							<Ionicons name="swap-horizontal" size={40} color="#4f46e5" />
						</View>
						<Text className="text-2xl font-bold text-gray-900 text-center mb-1">
							{loading
								? "Fetching product..."
								: productMissing
									? "Product not found"
									: productName || "Product"}
						</Text>
						<Text className="text-gray-500 text-center mb-6">
							{loading
								? "Please wait"
								: productMissing
									? "Scan a valid QR code"
									: `Total in stock: ${totalQty}`}
						</Text>

						{!productMissing && (
							<View className="w-full mb-4">
								<Text className="text-xs text-gray-500 uppercase font-bold mb-2 text-left">
									Stock by location
								</Text>
								{loading ? (
									<View className="flex-row items-center gap-2">
										<ActivityIndicator />
										<Text className="text-gray-600">Loading stock...</Text>
									</View>
								) : stockRows.length === 0 ? (
									<Text className="text-gray-500">No stock recorded yet</Text>
								) : (
									<View className="bg-gray-50 rounded-xl border border-gray-200">
										{stockRows.map((row) => (
											<View
												key={row.locationId}
												className="flex-row justify-between items-center px-4 py-3 border-b border-gray-200 last:border-b-0">
												<Text className="text-gray-800 font-medium">
													{row.locationName}
												</Text>
												<Text className="text-gray-900 font-bold">
													{row.quantity}
												</Text>
											</View>
										))}
									</View>
								)
								}
							</View>
						)}

						<View className="bg-gray-50 w-full p-4 rounded-xl border border-gray-200 mb-4">
							<Text className="text-xs text-gray-500 uppercase font-bold mb-2">
								QR Code
							</Text>
							<Text className="text-base font-mono text-gray-900">
								{scannedData}
							</Text>
						</View>

						{/* From location */}
						<View className="w-full mb-4">
							<Text className="text-xs text-gray-500 uppercase font-bold mb-2">
								From Location
							</Text>
							{loading ? (
								<View className="flex-row items-center gap-2">
									<ActivityIndicator />
									<Text className="text-gray-600">Loading locations...</Text>
								</View>
							) : (
								<ScrollView horizontal showsHorizontalScrollIndicator={false}>
									<View className="flex-row gap-2">
										{locations.map((loc) => {
											const qtyForLoc =
												stockRows.find((r) => r.locationId === loc.id)?.quantity ??
												0
											const selected = fromLocationId === loc.id
											return (
												<TouchableOpacity
													key={loc.id}
													className={`px-3 py-2 rounded-lg border ${
														selected
															? "bg-blue-600 border-blue-600"
															: "bg-white border-gray-200"
													}`}
													onPress={() => setFromLocationId(loc.id)}>
													<Text
														className={`font-medium ${
															selected ? "text-white" : "text-gray-800"
														}`}
													>{
														qtyForLoc ? `${loc.name} (${qtyForLoc})` : loc.name
													}</Text>
												</TouchableOpacity>
											)
										})}
									</View>
								</ScrollView>
							)}
						</View>

						{/* To location */}
						<View className="w-full mb-4">
							<Text className="text-xs text-gray-500 uppercase font-bold mb-2">
								To Location
							</Text>
							{loading ? (
								<View className="flex-row items-center gap-2">
									<ActivityIndicator />
									<Text className="text-gray-600">Loading locations...</Text>
								</View>
							) : (
								<ScrollView horizontal showsHorizontalScrollIndicator={false}>
									<View className="flex-row gap-2">
										{locations.map((loc) => {
											const selected = toLocationId === loc.id
											return (
												<TouchableOpacity
													key={loc.id}
													className={`px-3 py-2 rounded-lg border ${
														selected
															? "bg-indigo-600 border-indigo-600"
															: "bg-white border-gray-200"
													}`}
													onPress={() => setToLocationId(loc.id)}>
													<Text
														className={`font-medium ${
															selected ? "text-white" : "text-gray-800"
														}`}
														>{loc.name}</Text>
												</TouchableOpacity>
											)
										})}
									</View>
								</ScrollView>
							)}
						</View>

						{/* Quantity */}
						<View className="w-full mb-6">
							<Text className="text-xs text-gray-500 uppercase font-bold mb-2">
								Quantity
							</Text>
							<View className="flex-row items-center gap-2">
								<TouchableOpacity
									className="px-3 py-2 rounded-lg bg-gray-100"
									onPress={() =>
										setQuantity(
											String(
												Math.max(
													1,
													(parseInt(quantity || "0", 10) || 1) - 1
												)
											)
										)
									}>
									<Text className="text-lg font-bold">-</Text>
								</TouchableOpacity>
								<TextInput
									keyboardType="number-pad"
									value={quantity}
									onChangeText={(text) => {
										const sanitized = (text || "").replace(/[^0-9]/g, "")
										const parsed = parseInt(sanitized || "0", 10)
										const max = maxQtyFromLocation
										if (max <= 0) {
											setQuantity("0")
											return
										}
										const clamped = Math.min(Math.max(parsed || 0, 1), max)
										setQuantity(String(clamped))
									}}
									editable={!(submitting || loading)}
									className="flex-1 px-4 py-3 rounded-lg border border-gray-200 bg-white text-center text-base"
								/>
								<TouchableOpacity
									className="px-3 py-2 rounded-lg bg-gray-100"
									onPress={() => {
										const max = maxQtyFromLocation
										if (max <= 0) {
											setQuantity("0")
											return
										}
										const current = parseInt(quantity || "0", 10) || 0
										setQuantity(String(Math.min(max, Math.max(1, current + 1))))
									}}
									disabled={maxQtyFromLocation > 0 && (parseInt(quantity || "0", 10) || 0) >= maxQtyFromLocation}>
									<Text className="text-lg font-bold">+</Text>
								</TouchableOpacity>
							</View>
						</View>

						{lastSuccess && (
							<View className="w-full mb-4 bg-green-50 border border-green-200 rounded-xl p-3">
								<Text className="text-green-800 font-semibold">
									Moved {lastSuccess.qty} from {lastSuccess.from} to {lastSuccess.to}
								</Text>
							</View>
						)}

						<View className="flex-row gap-3 w-full">
							<TouchableOpacity
								className="flex-1 bg-gray-100 py-4 rounded-xl items-center active:bg-gray-200"
								onPress={() => setScanned(false)}>
								<Text className="text-gray-700 font-bold text-lg">
									Scan Again
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								className="flex-1 bg-indigo-600 py-4 rounded-xl items-center active:bg-indigo-700 shadow-lg shadow-indigo-200"
								onPress={handleMove}
								disabled={submitting || loading || productMissing}>
								{submitting ? (
									<ActivityIndicator color="#fff" />
								) : (
									<Text className="text-white font-bold text-lg">Move</Text>
								)}
							</TouchableOpacity>
						</View>
					</View>
				</View>
			)}
		</View>
	)
}
