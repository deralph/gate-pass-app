import { View, Text, StyleSheet, Platform } from "react-native";
import { useEffect, useState } from "react";
import { Camera, CameraView } from "expo-camera";
import { StatusBar } from "expo-status-bar";
import ScanOverlay from "../../components/scan/ScanOverlay";
import UserDetailsModal from "../../components/scan/UserDetailsModal";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import Header from "../../components/Header";

type ScanData = {
  time: string;
  raw: string;
  parsed: { name?: string; vehicle?: string; plate?: string } | null;
};

export default function ScanBarcode() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [decision, setDecision] = useState<"Approved" | "Denied" | null>(null);
  const [scanData, setScanData] = useState<ScanData | null>(null);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const extractor = (event: any) => event?.nativeEvent?.data ?? event?.data ?? null;

  const handleBarCodeScanned = (event: any) => {
    if (scanned) return;
    const data = extractor(event);
    if (!data) return;

    setScanned(true);
    setModalVisible(true);

    const now = new Date();
    const time = now.toLocaleTimeString();

    let parsed = null;
    try { parsed = JSON.parse(data); } catch (e) { parsed = null; }

    const payload: ScanData = { time, raw: data, parsed };
    console.log("📡 QR scanned:", payload);
    setScanData(payload);
  };

  const handleApprove = () => {
    setDecision("Approved");
    setModalVisible(false);
    // camera remains visible; overlay will show approved state
  };
  const handleReject = () => {
    setDecision("Denied");
    setModalVisible(false);
  };

  const resetToScan = () => {
    setDecision(null);
    setScanData(null);
    setScanned(false);
    setModalVisible(false);
  };

  if (hasPermission === null) {
    return (
      <View className="flex-1 bg-green-900 justify-center items-center">
        <Text className="text-white">Requesting camera permission...</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View className="flex-1 bg-green-900 justify-center items-center">
        <Text className="text-white">No access to camera</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-green-900">
      {Platform.OS === "android" ? <StatusBar hidden /> : <StatusBar style="auto" />}

  <Header title="Scan Barcode"  admin/>

      {/* Camera live view (fills remaining) */}
      <View style={styles.cameraContainer}>
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        />

        {/* Overlay sits above camera */}
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <ScanOverlay data={scanData} decision={decision} onReset={resetToScan} />
        </View>
      </View>

      {/* Modal with details + Approve/Reject */}
      <UserDetailsModal
        visible={modalVisible}
        data={scanData}
        onClose={() => {
          setModalVisible(false);
          setScanned(false);
        }}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    position: "relative",
  },
});
