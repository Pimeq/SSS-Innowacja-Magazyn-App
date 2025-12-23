import { useEffect, useMemo, useState } from "react"
import {
	View,
	Text,
	ActivityIndicator,
	FlatList,
	TouchableOpacity,
	ScrollView,
} from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { apiClient } from "../api/config"

export default function Products() {
	const router = useRouter()
	const [loading, setLoading] = useState(true)
	const [products, setProducts] = useState<
		Array<{ id: number; name: string; qr_code: string }>
	>([])
	const [locations, setLocations] = useState<
		Array<{ id: number; name: string }>
	>([])
	const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
		null
	)
	const [stockByLocation, setStockByLocation] = useState<
		Array<{
			product_id: number
			product_name: string
			qr_code: string
			location_id: number
			location_name: string
			quantity: number
		}>
	>([])
	const [error, setError] = useState<string>("")

	useEffect(() => {
		const load = async () => {
			try {
				setLoading(true)
				setError("")
				const [prodRes, locRes] = await Promise.all([
					apiClient.getProducts(),
					apiClient.getLocations(),
				])
				if (prodRes.success) setProducts(prodRes.data)
				if (locRes.success) setLocations(locRes.data)
			} catch (e: any) {
				setError(e?.message || "Failed to load products")
			} finally {
				setLoading(false)
			}
		}
		load()
	}, [])

	useEffect(() => {
		const loadStock = async () => {
			if (!selectedLocationId) {
				setStockByLocation([])
				return
			}
			try {
				setLoading(true)
				const res = await apiClient.getStockByLocation(selectedLocationId)
				if (res.success) setStockByLocation(res.data)
			} catch (e: any) {
				setError(e?.message || "Failed to load stock for location")
			} finally {
				setLoading(false)
			}
		}
		loadStock()
	}, [selectedLocationId])

	const productsToRender = useMemo(() => {
		if (!selectedLocationId)
			return products.map((p) => ({
				...p,
				quantity: undefined as number | undefined,
			}))
		const map = new Map(stockByLocation.map((s) => [s.product_id, s.quantity]))
		// Only show products that exist at this location
		return products
			.filter((p) => map.has(p.id))
			.map((p) => ({ ...p, quantity: map.get(p.id)! }))
	}, [products, stockByLocation, selectedLocationId])

	return (
		<View className="flex-1 bg-gray-50 px-6 pt-12">
			<View className="flex-row items-center justify-between mb-6">
				<TouchableOpacity
					className="bg-white p-2 rounded-full shadow-sm border border-gray-100"
					onPress={() => router.back()}>
					<Ionicons
						name="arrow-back"
						size={24}
						color="#374151"
					/>
				</TouchableOpacity>
				<Text className="text-xl font-bold text-gray-900">Products</Text>
				<View className="w-10" />
			</View>

			{/* Filters */}
			<View className="mb-4">
				<Text className="text-xs text-gray-500 uppercase font-bold mb-2">
					Filter by location
				</Text>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}>
					<View className="flex-row gap-2">
						<TouchableOpacity
							className={`px-3 py-2 rounded-lg border ${selectedLocationId === null ? "bg-blue-600 border-blue-600" : "bg-white border-gray-200"}`}
							onPress={() => setSelectedLocationId(null)}>
							<Text
								className={`${selectedLocationId === null ? "text-white" : "text-gray-800"} font-medium`}>
								All
							</Text>
						</TouchableOpacity>
						{locations.map((loc) => (
							<TouchableOpacity
								key={loc.id}
								className={`px-3 py-2 rounded-lg border ${selectedLocationId === loc.id ? "bg-blue-600 border-blue-600" : "bg-white border-gray-200"}`}
								onPress={() => setSelectedLocationId(loc.id)}>
								<Text
									className={`${selectedLocationId === loc.id ? "text-white" : "text-gray-800"} font-medium`}>
									{loc.name}
								</Text>
							</TouchableOpacity>
						))}
					</View>
				</ScrollView>
			</View>

			{loading ?
				<View className="flex-1 items-center justify-center">
					<ActivityIndicator />
					<Text className="text-gray-600 mt-2">Loading...</Text>
				</View>
			: error ?
				<View className="flex-1 items-center justify-center">
					<Text className="text-red-600">{error}</Text>
				</View>
			:	<FlatList
					data={productsToRender}
					keyExtractor={(item) => String(item.id)}
					renderItem={({ item }) => (
						<View className="bg-white p-4 rounded-2xl mb-3 flex-row items-center shadow-sm border border-gray-100">
							<View className="w-12 h-12 bg-gray-50 rounded-xl items-center justify-center mr-4 border border-gray-100">
								<Ionicons
									name="cube-outline"
									size={20}
									color="#6b7280"
								/>
							</View>
							<View className="flex-1">
								<Text className="font-bold text-gray-900 text-base">
									{item.name}
								</Text>
								<Text className="text-gray-500 text-xs mt-0.5">
									QR: {item.qr_code}
								</Text>
								{selectedLocationId ?
									<Text className="text-gray-900 text-xs mt-0.5 font-semibold">
										Qty at location:{" "}
										{(
											"quantity" in item && (item as any).quantity !== undefined
										) ?
											(item as any).quantity
										:	0}
									</Text>
								:	<Text className="text-gray-900 text-xs mt-0.5 font-semibold">
										Total qty:{" "}
										{(
											"total_quantity" in item &&
											(item as any).total_quantity !== undefined
										) ?
											(item as any).total_quantity
										:	0}
									</Text>
								}
							</View>
						</View>
					)}
				/>
			}
		</View>
	)
}
