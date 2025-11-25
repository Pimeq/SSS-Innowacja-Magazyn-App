import { useRouter } from "expo-router"
import { Button, Text, View } from "react-native"

export default function Index() {
	const router = useRouter()
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
			}}>
			<Text>Hello world</Text>
			<Button
				title="skanner"
				onPress={() => {
					router.navigate("/scanner")
				}}
			/>
		</View>
	)
}
