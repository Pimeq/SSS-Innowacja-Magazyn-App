import { CameraView, useCameraPermissions } from "expo-camera"
import { useState } from "react"
import { Button, StyleSheet, Text, View } from "react-native"

export default function Scanner() {
	const [permission, requestPermission] = useCameraPermissions()
	const [scanned, setScanned] = useState(false)
	const [scannedData, setScannedData] = useState<string>("")

	if (!permission) {
		return <View />
	}

	if (!permission.granted) {
		return (
			<View style={styles.container}>
				<Text style={styles.message}>
					We need your permission to show the camera
				</Text>
				<Button
					onPress={requestPermission}
					title="Grant permission"
				/>
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
		alert(`Bar code with type ${type} and data ${data} has been scanned!`)
	}

	return (
		<View style={styles.container}>
			<CameraView
				style={styles.camera}
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
			{/* Scanner Frame Overlay */}
			<View style={styles.scannerOverlay}>
				{/* Top Dark Overlay */}
				<View style={styles.darkOverlay} />

				{/* Middle Row with Scanner Frame */}
				<View style={styles.middleRow}>
					<View style={styles.darkOverlay} />
					<View style={styles.scanFrame}>
						{/* Corner Brackets */}
						<View style={[styles.corner, styles.topLeft]} />
						<View style={[styles.corner, styles.topRight]} />
						<View style={[styles.corner, styles.bottomLeft]} />
						<View style={[styles.corner, styles.bottomRight]} />

						{/* Scanning Line Animation */}
						{!scanned && <View style={styles.scanLine} />}
					</View>
					<View style={styles.darkOverlay} />
				</View>

				{/* Bottom Dark Overlay with Instructions */}
				<View style={styles.darkOverlay}>
					<Text style={styles.instructionText}>
						{scanned ? "" : "Position barcode within the frame"}
					</Text>
				</View>
			</View>

			<View style={styles.overlay}>
				{scanned && (
					<View style={styles.resultContainer}>
						<Text style={styles.resultText}>Scanned: {scannedData}</Text>
						<Button
							title="Tap to Scan Again"
							onPress={() => setScanned(false)}
						/>
					</View>
				)}
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
	},
	message: {
		textAlign: "center",
		paddingBottom: 10,
	},
	camera: {
		flex: 1,
	},
	scannerOverlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
	darkOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.6)",
		justifyContent: "center",
		alignItems: "center",
	},
	middleRow: {
		flexDirection: "row",
		height: 250,
	},
	scanFrame: {
		width: 250,
		height: 250,
		position: "relative",
	},
	corner: {
		position: "absolute",
		width: 30,
		height: 30,
		borderColor: "#fff",
	},
	topLeft: {
		top: 0,
		left: 0,
		borderTopWidth: 4,
		borderLeftWidth: 4,
	},
	topRight: {
		top: 0,
		right: 0,
		borderTopWidth: 4,
		borderRightWidth: 4,
	},
	bottomLeft: {
		bottom: 0,
		left: 0,
		borderBottomWidth: 4,
		borderLeftWidth: 4,
	},
	bottomRight: {
		bottom: 0,
		right: 0,
		borderBottomWidth: 4,
		borderRightWidth: 4,
	},
	scanLine: {
		position: "absolute",
		left: 0,
		right: 0,
		height: 2,
		backgroundColor: "#00ff00",
		top: "50%",
		shadowColor: "#00ff00",
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.8,
		shadowRadius: 10,
	},
	instructionText: {
		color: "white",
		fontSize: 16,
		marginTop: 20,
		textAlign: "center",
	},
	overlay: {
		position: "absolute",
		bottom: 40,
		left: 0,
		right: 0,
		alignItems: "center",
	},
	resultContainer: {
		backgroundColor: "rgba(0, 0, 0, 0.8)",
		padding: 20,
		borderRadius: 10,
		alignItems: "center",
	},
	resultText: {
		color: "white",
		fontSize: 16,
		marginBottom: 10,
		textAlign: "center",
	},
})
