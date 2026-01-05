import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import {
	ScrollView,
	Text,
	TouchableOpacity,
	View,
	ActivityIndicator,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useEffect, useState } from "react"
import { apiClient } from "../api/config"
import "../global.css"

export default function Index() {
	const router = useRouter()
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string>("")
	const [productsCount, setProductsCount] = useState<number>(0)
	const [locationsCount, setLocationsCount] = useState<number>(0)
	const [topProducts, setTopProducts] = useState<
		Array<{
			id: number
			name: string
			qr_code: string
			total_quantity?: number
		}>
	>([])

	useEffect(() => {
		const load = async () => {
			try {
				setLoading(true)
				setError("")
				const [prodRes, locRes] = await Promise.all([
					apiClient.getProducts(),
					apiClient.getLocations(),
				])
				if (prodRes.success) {
					setProductsCount(prodRes.count)
					setTopProducts(prodRes.data.slice(0, 5))
				}
				if (locRes.success) {
					setLocationsCount(locRes.count)
				}
			} catch (e: any) {
				setError(e?.message || "Failed to load data")
			} finally {
				setLoading(false)
			}
		}
		load()
	}, [])

	return (
		<SafeAreaView className="flex-1 bg-gray-50">
			<StatusBar style="dark" />
			<ScrollView className="flex-1 px-6 pt-6">
				{/* Header */}
				<View className="mb-8 flex-row justify-between items-center">
					<View>
						<Text className="text-gray-500 text-sm font-medium uppercase tracking-wider">
							Welcome Back
						</Text>
						<Text className="text-3xl font-bold text-gray-900 mt-1">
							Inventory
						</Text>
					</View>
					<TouchableOpacity className="bg-white p-2 rounded-full shadow-sm border border-gray-100">
						<Ionicons
							name="notifications-outline"
							size={24}
							color="#374151"
						/>
					</TouchableOpacity>
				</View>

				{/* Main Action Card */}
				<TouchableOpacity
					className="bg-blue-600 rounded-3xl p-6 shadow-lg shadow-blue-200 mb-8 active:bg-blue-700"
					onPress={() => router.navigate("/scanner")}>
					<View className="flex-row items-center justify-between">
						<View>
							<View className="bg-blue-500/30 self-start px-3 py-1 rounded-full mb-3">
								<Text className="text-blue-50 text-xs font-bold uppercase">
									Quick Action
								</Text>
							</View>
							<Text className="text-white text-2xl font-bold">
								Scan Product
							</Text>
							<Text className="text-blue-100 mt-1 text-sm">
								Add new items to inventory
							</Text>
						</View>
						<View className="bg-white/20 p-4 rounded-2xl">
							<Ionicons
								name="qr-code-outline"
								size={32}
								color="white"
							/>
						</View>
					</View>
				</TouchableOpacity>

				{/* Browse Products */}
				<TouchableOpacity
					className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8"
					onPress={() => router.navigate("/products")}>
					<View className="flex-row items-center justify-between">
						<View>
							<View className="bg-gray-100 self-start px-3 py-1 rounded-full mb-3">
								<Text className="text-gray-700 text-xs font-bold uppercase">
									Inventory
								</Text>
							</View>
							<Text className="text-gray-900 text-2xl font-bold">
								Browse Products
							</Text>
							<Text className="text-gray-500 mt-1 text-sm">
								View all products and QR codes
							</Text>
						</View>
						<View className="bg-indigo-50 p-4 rounded-2xl">
							<Ionicons
								name="list-outline"
								size={28}
								color="#4f46e5"
							/>
						</View>
					</View>
				</TouchableOpacity>

				{/* Live Stats Row */}
				<View className="flex-row gap-4 mb-8">
					<View className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
						<View className="bg-indigo-50 w-10 h-10 rounded-full items-center justify-center mb-3">
							<Ionicons
								name="cube-outline"
								size={20}
								color="#4f46e5"
							/>
						</View>
						{loading ?
							<ActivityIndicator />
						:	<Text className="text-2xl font-bold text-gray-900">
								{productsCount}
							</Text>
						}
						<Text className="text-gray-500 text-xs font-medium">Products</Text>
					</View>
					<View className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
						<View className="bg-amber-50 w-10 h-10 rounded-full items-center justify-center mb-3">
							<Ionicons
								name="location-outline"
								size={20}
								color="#d97706"
							/>
						</View>
						{loading ?
							<ActivityIndicator />
						:	<Text className="text-2xl font-bold text-gray-900">
								{locationsCount}
							</Text>
						}
						<Text className="text-gray-500 text-xs font-medium">Locations</Text>
					</View>
				</View>

				{/* Products Preview (replaces mock recent activity) */}
				<View className="pb-10">
					<View className="flex-row justify-between items-center mb-4">
						<Text className="text-lg font-bold text-gray-900">Products</Text>
						<TouchableOpacity onPress={() => router.navigate("/products")}>
							<Text className="text-blue-600 font-medium text-sm">See All</Text>
						</TouchableOpacity>
					</View>

					{error ?
						<View className="bg-red-50 p-4 rounded-2xl border border-red-200">
							<Text className="text-red-700">{error}</Text>
						</View>
					: loading ?
						<View className="bg-white p-4 rounded-2xl border border-gray-100 items-center">
							<ActivityIndicator />
							<Text className="text-gray-600 mt-2">Loading products...</Text>
						</View>
					: topProducts.length === 0 ?
						<View className="bg-white p-4 rounded-2xl border border-gray-100">
							<Text className="text-gray-600">No products yet</Text>
						</View>
					:	topProducts.map((item) => (
							<View
								key={item.id}
								className="bg-white p-4 rounded-2xl mb-3 flex-row items-center shadow-sm border border-gray-100">
								<View className="w-12 h-12 bg-gray-50 rounded-xl items-center justify-center mr-4 border border-gray-100">
									<Ionicons
										name="barcode-outline"
										size={24}
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
									<Text className="text-gray-900 text-xs mt-0.5 font-semibold">
										Total qty: {item.total_quantity ?? 0}
									</Text>
								</View>
							</View>
						))
					}
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}
