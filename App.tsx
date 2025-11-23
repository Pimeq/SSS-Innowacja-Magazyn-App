import { StatusBar } from "expo-status-bar"
import { Container } from "components/Container"
import { Text, TouchableOpacity, View } from "react-native"
import { useColorScheme } from "nativewind"
import { CameraView, useCameraPermissions } from "expo-camera"
import { useState } from "react"

import "./global.css"

export default function App() {
	const { colorScheme } = useColorScheme()
	const [lamp, setLamp] = useState(false)
	const [permission, requestPermission] = useCameraPermissions()
	const toggleLamp = () => {
		setLamp(!lamp)
	}

	return (
		<Container>
			<StatusBar />

			{permission?.granted ?
				<Text>Perms granted</Text>
			:	<TouchableOpacity onPress={requestPermission}>
					<Text>No perms click here to request</Text>
				</TouchableOpacity>
			}

			<Text>Hello world</Text>
			<Text className="mt-4 text-blue-500">
				{`the current color scheme is ${colorScheme}`}
			</Text>

			<View>
				<CameraView
					facing="back"
					enableTorch={lamp}
					style={{ width: 300, height: 400 }}
				/>
				<View>
					<TouchableOpacity onPress={toggleLamp}>
						<Text>toggle lamp</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Container>
	)
}
