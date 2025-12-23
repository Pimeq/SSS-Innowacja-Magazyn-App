import { Ionicons } from "@expo/vector-icons"
import { CameraView, useCameraPermissions } from "expo-camera"
import { useRouter } from "expo-router"
import { useEffect, useRef, useState } from "react"
import {
	Animated,
	Easing,
	StatusBar,
	Text,
	TouchableOpacity,
	View,
	ActivityIndicator,
	Alert,
	TextInput,
	ScrollView,
} from "react-native"
import { apiClient } from "../api/config"

export default function Scanner() {
	const router = useRouter()
	const [permission, requestPermission] = useCameraPermissions()
	const [scanned, setScanned] = useState(false)
	const [scannedData, setScannedData] = useState<string>("")

	// Data fetching state
	const [loading, setLoading] = useState(false)
	const [productName, setProductName] = useState<string>("")
	const [totalQty, setTotalQty] = useState<number>(0)
	const [locations, setLocations] = useState<
		Array<{ id: number; name: string }>
	>([])
	const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
		null
	)
	const [quantity, setQuantity] = useState<string>("1")
	const [submitting, setSubmitting] = useState(false)
	const [lastSuccess, setLastSuccess] = useState<{
		qty: number
		location: string
	} | null>(null)
	const [stockRows, setStockRows] = useState<
		Array<{
			locationId: number
			locationName: string
			quantity: number
		}>
	>([])
	const [productMissing, setProductMissing] = useState(false)
	const [newProductName, setNewProductName] = useState("")
	const [creatingProduct, setCreatingProduct] = useState(false)

	// Animation for scan line
	const scanAnim = useRef(new Animated.Value(0)).current

	useEffect(() => {
		if (!scanned) {
			const startAnimation = () => {
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
			}
			startAnimation()
		} else {
			scanAnim.stopAnimation()
		}
	}, [scanned])

	const translateY = scanAnim.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 280],
	})

	// Load product info and locations when a code is scanned
	useEffect(() => {
		const loadData = async () => {
			if (!scanned || !scannedData) return
			setLoading(true)
			setProductName("")
			setTotalQty(0)
			setLocations([])
			setSelectedLocationId(null)
			try {
				setProductMissing(false)
				setNewProductName("")
				// Try load product by QR (non-throwing 404 case)
				const stockRes: any = await apiClient.getStockByQR(scannedData)
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
					setProductName("")
					setTotalQty(0)
					setStockRows([])
				} else if (stockRes && stockRes.error) {
					throw new Error(stockRes.error)
				}

				// Load locations even if product missing
				try {
					const locRes = await apiClient.getLocations()
					if (locRes.success) {
						setLocations(locRes.data)
						if (locRes.data.length > 0) setSelectedLocationId(locRes.data[0].id)
					}
				} catch (e) {
					// surface location load errors
					throw e
				}
			} catch (err: any) {
				Alert.alert("Error", err?.message || "Failed to load data")
			} finally {
				setLoading(false)
			}
		}
		loadData()
	}, [scanned, scannedData])

	const handleCreateProduct = async () => {
		if (!scannedData) return
		const name = (newProductName || "").trim()
		if (!name) {
			Alert.alert("Missing name", "Please enter a product name")
			return
		}
		try {
			setCreatingProduct(true)
			const res = await apiClient.createProduct(scannedData, name)
			if (res.success) {
				setProductMissing(false)
				setProductName(res.data.name)
				setTotalQty(0)
				setStockRows([])
				setNewProductName("")
			}
		} catch (e: any) {
			Alert.alert("Create Failed", e?.message || "Unable to create product")
		} finally {
			setCreatingProduct(false)
		}
	}

	const handleAdd = async () => {
		if (!scannedData) return
		const qty = parseInt(quantity || "0", 10)
		if (!selectedLocationId) {
			Alert.alert("Select Location", "Please choose a target location")
			return
		}
		if (!qty || qty <= 0) {
			Alert.alert("Invalid Quantity", "Quantity must be greater than 0")
			return
		}
		try {
			setSubmitting(true)
			const res = await apiClient.addStock(scannedData, selectedLocationId, qty)
			if (res.success) {
				const locName =
					locations.find((l) => l.id === selectedLocationId)?.name || "Location"
				setTotalQty((prev) => prev + qty)
				setLastSuccess({ qty, location: locName })
				setQuantity("1")
				// Update local per-location stock rows
				setStockRows((prev) => {
					const idx = prev.findIndex((r) => r.locationId === selectedLocationId)
					if (idx >= 0) {
						const copy = [...prev]
						copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + qty }
						return copy
					}
					return [
						...prev,
						{
							locationId: selectedLocationId!,
							locationName: locName,
							quantity: qty,
						},
					]
				})
			}
		} catch (err: any) {
			Alert.alert("Add Failed", err?.message || "Unable to add item")
		} finally {
			setSubmitting(false)
		}
	}

	// Auto-hide success chip after a short delay
	useEffect(() => {
		if (!lastSuccess) return
		const t = setTimeout(() => setLastSuccess(null), 3000)
		return () => clearTimeout(t)
	}, [lastSuccess])

	if (!permission) {
		return <View className="flex-1 bg-black" />
	}

	if (!permission.granted) {
		return (
			<View className="flex-1 bg-gray-900 justify-center items-center px-6">
				<View className="bg-gray-800 p-6 rounded-2xl items-center w-full max-w-sm">
					<View className="bg-gray-700 p-4 rounded-full mb-4">
						<Ionicons
							name="camera-outline"
							size={32}
							color="#9ca3af"
						/>
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
					<TouchableOpacity
						onPress={() => router.back()}
						className="mt-4 py-2">
						<Text className="text-gray-500 font-medium">Cancel</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}

	const handleBarcodeScanned = ({
		type,
		data,
	}: {
		type: string
		data: string
	}) => {
		setScanned(true)
		setScannedData(data)
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
							<Ionicons
								name="arrow-back"
								size={24}
								color="white"
							/>
						</TouchableOpacity>
						<Text className="text-white font-bold text-lg tracking-wider">
							SCANNER
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
						{scanned ?
							"Product Scanned!"
						:	"Align the barcode within the frame to scan"}
					</Text>
				</View>
			</View>

			{scanned && (
				<View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 z-20 shadow-2xl">
					<View className="items-center mb-6">
						<View className="w-12 h-1.5 bg-gray-300 rounded-full mb-6" />
						<View className="bg-green-100 p-4 rounded-full mb-4">
							<Ionicons
								name="checkmark-circle"
								size={48}
								color="#16a34a"
							/>
						</View>
						<Text className="text-2xl font-bold text-gray-900 text-center mb-1">
							{loading ?
								"Fetching product..."
							: productMissing ?
								"New Product"
							:	productName || "Product"}
						</Text>
						<Text className="text-gray-500 text-center mb-6">
							{loading ?
								"Please wait"
							: productMissing ?
								"Not yet created"
							:	`Total in stock: ${totalQty}`}
						</Text>

						{/* Not found banner */}
						{productMissing && (
							<View className="w-full mb-4 bg-amber-50 border border-amber-200 rounded-xl p-3 flex-row items-start">
								<View className="mr-2 mt-0.5">
									<Ionicons
										name="information-circle"
										size={18}
										color="#b45309"
									/>
								</View>
								<View className="flex-1">
									<Text className="text-amber-800 font-semibold mb-1">
										No product found for this QR
									</Text>
									<Text className="text-amber-800">
										Enter a name below to create it, then add stock to a
										location.
									</Text>
								</View>
							</View>
						)}

						{/* Per-location stock breakdown */}
						{!productMissing && (
							<View className="w-full mb-4">
								<Text className="text-xs text-gray-500 uppercase font-bold mb-2 text-left">
									Stock by location
								</Text>
								{loading ?
									<View className="flex-row items-center gap-2">
										<ActivityIndicator />
										<Text className="text-gray-600">Loading stock...</Text>
									</View>
								: stockRows.length === 0 ?
									<Text className="text-gray-500">No stock recorded yet</Text>
								:	<View className="bg-gray-50 rounded-xl border border-gray-200">
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

						{/* New product creation */}
						{productMissing && (
							<View className="w-full mb-4">
								<Text className="text-xs text-gray-500 uppercase font-bold mb-2">
									New Product
								</Text>
								<View className="bg-white border border-gray-200 rounded-xl p-3">
									<Text className="text-gray-700 mb-2">
										Enter product name to create
									</Text>
									<TextInput
										placeholder="Product name"
										value={newProductName}
										onChangeText={setNewProductName}
										className="px-4 py-3 rounded-lg border border-gray-200 bg-white mb-3"
									/>
									<TouchableOpacity
										className="bg-emerald-600 py-3 rounded-xl items-center active:bg-emerald-700"
										onPress={handleCreateProduct}
										disabled={creatingProduct}>
										{creatingProduct ?
											<ActivityIndicator color="#fff" />
										:	<Text className="text-white font-bold">
												Create Product
											</Text>
										}
									</TouchableOpacity>
								</View>
							</View>
						)}

						{/* Location selector */}
						<View className="w-full mb-4">
							<Text className="text-xs text-gray-500 uppercase font-bold mb-2">
								Select Location
							</Text>
							{loading ?
								<View className="flex-row items-center gap-2">
									<ActivityIndicator />
									<Text className="text-gray-600">Loading locations...</Text>
								</View>
							:	<ScrollView
									horizontal
									showsHorizontalScrollIndicator={false}>
									<View className="flex-row gap-2">
										{locations.map((loc) => {
											const qtyForLoc =
												stockRows.find((r) => r.locationId === loc.id)
													?.quantity ?? 0
											const selected = selectedLocationId === loc.id
											return (
												<TouchableOpacity
													key={loc.id}
													className={`px-3 py-2 rounded-lg border ${
														selected ?
															"bg-blue-600 border-blue-600"
														:	"bg-white border-gray-200"
													}`}
													onPress={() => setSelectedLocationId(loc.id)}>
													<Text
														className={`font-medium ${selected ? "text-white" : "text-gray-800"}`}>
														{loc.name}
														{qtyForLoc ? ` (${qtyForLoc})` : ""}
													</Text>
												</TouchableOpacity>
											)
										})}
									</View>
								</ScrollView>
							}
						</View>

						{/* Quantity input */}
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
												Math.max(1, (parseInt(quantity || "0", 10) || 1) - 1)
											)
										)
									}>
									<Text className="text-lg font-bold">-</Text>
								</TouchableOpacity>
								<TextInput
									keyboardType="number-pad"
									value={quantity}
									onChangeText={setQuantity}
									editable={!(submitting || loading)}
									className="flex-1 px-4 py-3 rounded-lg border border-gray-200 bg-white text-center text-base"
								/>
								<TouchableOpacity
									className="px-3 py-2 rounded-lg bg-gray-100"
									onPress={() =>
										setQuantity(
											String((parseInt(quantity || "0", 10) || 0) + 1)
										)
									}>
									<Text className="text-lg font-bold">+</Text>
								</TouchableOpacity>
							</View>
						</View>

						{/* Success chip */}
						{lastSuccess && (
							<View className="w-full mb-4 bg-green-50 border border-green-200 rounded-xl p-3">
								<Text className="text-green-800 font-semibold">
									Added +{lastSuccess.qty} to {lastSuccess.location}
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
								className="flex-1 bg-blue-600 py-4 rounded-xl items-center active:bg-blue-700 shadow-lg shadow-blue-200"
								onPress={handleAdd}
								disabled={submitting || loading}>
								{submitting ?
									<ActivityIndicator color="#fff" />
								:	<Text className="text-white font-bold text-lg">Add Item</Text>}
							</TouchableOpacity>
						</View>
					</View>
				</View>
			)}
		</View>
	)
}
