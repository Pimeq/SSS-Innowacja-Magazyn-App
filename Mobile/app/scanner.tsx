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
} from "react-native"

export default function Scanner() {
	const router = useRouter()
	const [permission, requestPermission] = useCameraPermissions()
	const [scanned, setScanned] = useState(false)
	const [scannedData, setScannedData] = useState<string>("")

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
							Scan Successful
						</Text>
						<Text className="text-gray-500 text-center mb-6">
							Product code captured successfully
						</Text>

						<View className="bg-gray-50 w-full p-4 rounded-xl border border-gray-200 mb-6">
							<Text className="text-xs text-gray-500 uppercase font-bold mb-1">
								Barcode Data
							</Text>
							<Text className="text-lg font-mono text-gray-900">
								{scannedData}
							</Text>
						</View>

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
								onPress={() => {
									setScanned(false)
									router.back()
								}}>
								<Text className="text-white font-bold text-lg">Add Item</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			)}
		</View>
	)
}
