import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import "../global.css"

export default function Index() {
	const router = useRouter()

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

				{/* Quick Stats Row */}
				<View className="flex-row gap-4 mb-8">
					<View className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
						<View className="bg-indigo-50 w-10 h-10 rounded-full items-center justify-center mb-3">
							<Ionicons
								name="cube-outline"
								size={20}
								color="#4f46e5"
							/>
						</View>
						<Text className="text-2xl font-bold text-gray-900">1,234</Text>
						<Text className="text-gray-500 text-xs font-medium">
							Total Items
						</Text>
					</View>
					<View className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
						<View className="bg-green-50 w-10 h-10 rounded-full items-center justify-center mb-3">
							<Ionicons
								name="arrow-up-circle-outline"
								size={20}
								color="#16a34a"
							/>
						</View>
						<Text className="text-2xl font-bold text-gray-900">45</Text>
						<Text className="text-gray-500 text-xs font-medium">
							Added Today
						</Text>
					</View>
				</View>

				{/* Recent Activity Section */}
				<View className="pb-10">
					<View className="flex-row justify-between items-center mb-4">
						<Text className="text-lg font-bold text-gray-900">
							Recent Activity
						</Text>
						<TouchableOpacity>
							<Text className="text-blue-600 font-medium text-sm">See All</Text>
						</TouchableOpacity>
					</View>

					{/* Mock List Items */}
					{[1, 2, 3, 4].map((item) => (
						<View
							key={item}
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
									Product Item #{item}
								</Text>
								<Text className="text-gray-500 text-xs mt-0.5">
									Added 2 mins ago
								</Text>
							</View>
							<View className="bg-green-50 px-3 py-1.5 rounded-lg">
								<Text className="text-green-700 text-xs font-bold">+10</Text>
							</View>
						</View>
					))}
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}
