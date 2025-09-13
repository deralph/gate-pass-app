import { View, Text, StyleSheet, Platform, Alert, ActivityIndicator } from "react-native";
import { useEffect, useState, useRef } from "react";
import { Camera, CameraView } from "expo-camera";
import { StatusBar } from "expo-status-bar";
import ScanOverlay from "../../components/scan/ScanOverlay";
import UserDetailsModal from "../../components/scan/UserDetailsModal";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import Header from "../../components/Header";
import { processScan, updateScanResult } from "../../services/scanService";
import { useAuth } from "../../contexts/AuthContext";

type ScanData = {
  time: string;
  raw: string;
  parsed: { name?: string; vehicle?: string; plate?: string } | null;
  scanResult?: any;
};

export default function ScanBarcode() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [decision, setDecision] = useState<"Approved" | "Denied" | null>(null);
  const [scanData, setScanData] = useState<ScanData | null>(null);
  const [processing, setProcessing] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    if (!data) return;

    setScanned(true);
    setProcessing(true);

    const now = new Date();
    const time = now.toLocaleTimeString();

    try {
      console.log("Scanned QR data:", data);
      
      // Parse the QR code data based on your format: USER:userId|ID:userIdentifier|CAR:plateNumber|TIMESTAMP:timestamp
      const parts = data.split('|');
      const parsedData: any = {};
      
      parts.forEach(part => {
        const [key, value] = part.split(':');
        if (key && value) {
          parsedData[key] = value;
        }
      });
      
      console.log("Parsed QR data:", parsedData);
      
      // Process the scan with the server
      const result = await processScan(data, user?.id);
      
      if (result.success) {
        const payload: ScanData = { 
          time, 
          raw: data, 
          parsed: {
            name: result.user?.fullName,
            vehicle: result.car?.model,
            plate: result.car?.plateNumber
          },
          scanResult: result
        };
        
        console.log("QR processed successfully:", payload);
        setScanData(payload);
        setModalVisible(true);
      } else {
        Alert.alert("Scan Failed", result.error || "Failed to process QR code");
        setScanned(false);
      }
    } catch (error: any) {
      console.error("Scan error:", error);
      Alert.alert("Error", error.message || "Failed to process scan");
      setScanned(false);
    } finally {
      setProcessing(false);
    }
  };

  const handleApprove = async () => {
    if (!scanData?.scanResult?.scan?._id) return;
    
    setProcessing(true);
    try {
      const result = await updateScanResult(scanData.scanResult.scan._id, "approved");
      
      if (result.success) {
        setDecision("Approved");
        setModalVisible(false);
      } else {
        Alert.alert("Error", result.message || "Failed to approve scan");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to approve scan");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!scanData?.scanResult?.scan?._id) return;
    
    setProcessing(true);
    try {
      const result = await updateScanResult(scanData.scanResult.scan._id, "denied", "Driver mismatch detected");
      
      if (result.success) {
        setDecision("Denied");
        setModalVisible(false);
      } else {
        Alert.alert("Error", result.message || "Failed to reject scan");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to reject scan");
    } finally {
      setProcessing(false);
    }
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

      <Header title="Scan Barcode" admin/>

      {/* Camera live view (fills remaining) */}
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "pdf417"]
          }}
        />

        {/* Overlay sits above camera */}
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          {processing && (
            <View className="absolute inset-0 bg-black/70 justify-center items-center">
              <ActivityIndicator size="large" color="#34A75E" />
              <Text className="text-white mt-4">Processing scan...</Text>
            </View>
          )}
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
        processing={processing}
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