import { View, Text, StyleSheet, Platform, Alert } from "react-native";
import { useEffect, useState } from "react";
import { Camera, CameraView } from "expo-camera";
import { StatusBar } from "expo-status-bar";
import ScanOverlay from "../../components/scan/ScanOverlay";
import UserDetailsModal from "../../components/scan/UserDetailsModal";
import { useRouter } from "expo-router";
import Header from "../../components/Header";
import { processScan, sendNotification,handleAccessDenied, handleVehicleUsageAlert } from "../../services/scanService";
import { auth, db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function ScanBarcode() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [decision, setDecision] = useState<"Approved" | "Denied" | null>(null);
  const [scanData, setScanData] = useState<any>(null);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [carDetails, setCarDetails] = useState<any>(null);
  const [processing, setProcessing] = useState(false);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned || processing) return;
    
    setScanned(true);
    setProcessing(true);

    try {
      // Process the scan (this will verify the QR code and get user/car data)
      const adminId = auth.currentUser?.uid;
      if (!adminId) {
        Alert.alert("Error", "Admin not authenticated");
        return;
      }

      const result = await processScan(data, adminId);
      
      if (result.success) {
        setScanData(result.scanData);
        
        // Get additional user and car details
        const [userDoc, carDoc] = await Promise.all([
          getDoc(doc(db, 'users', result.scanData.userId)),
          getDoc(doc(db, 'cars', `${result.scanData.userId}_${result.scanData.plateNumber}`))
        ]);
        
        if (userDoc.exists()) setUserDetails(userDoc.data());
        if (carDoc.exists()) setCarDetails(carDoc.data());
        
        setModalVisible(true);
      } else {
        Alert.alert("Scan Error", result.error);
        setScanned(false);
      }
    } catch (error) {
      console.error("Scan error:", error);
      Alert.alert("Error", "Failed to process QR code");
      setScanned(false);
    } finally {
      setProcessing(false);
    }
  };

  const handleApprove = async () => {
    setDecision("Approved");
    setModalVisible(false);
    
    // Send notification to user
    if (scanData) {
      await sendNotification(
        scanData.userId, 
        'access_approved', 
        {
          plateNumber: scanData.plateNumber,
          timestamp: new Date().toISOString(),
          adminId: auth.currentUser?.uid
        }
      );
      await handleVehicleUsageAlert(
      scanData.userId, 
      scanData.plateNumber, 
      scanData
    );
    }
  };

  const handleReject = async () => {
    setDecision("Denied");
    setModalVisible(false);
    
    // Send notification to user
    if (scanData) {
      await sendNotification(
        scanData.userId, 
        'access_denied', 
        {
          plateNumber: scanData.plateNumber,
          timestamp: new Date().toISOString(),
          adminId: auth.currentUser?.uid,
          reason: "Driver mismatch detected"
        }
      );
      await handleAccessDenied(
      scanData.userId, 
      scanData.plateNumber, 
      auth.currentUser?.uid,
      "Driver mismatch detected"
    );
    }
  };

  const resetToScan = () => {
    setDecision(null);
    setScanData(null);
    setUserDetails(null);
    setCarDetails(null);
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

      <Header title="Scan Barcode" admin />

      {/* Camera live view (fills remaining) */}
      <View style={styles.cameraContainer}>
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "pdf417"]
          }}
        />

        {/* Overlay sits above camera */}
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <ScanOverlay 
            data={scanData} 
            userDetails={userDetails}
            carDetails={carDetails}
            decision={decision} 
            onReset={resetToScan} 
          />
        </View>
      </View>

      {/* Modal with details + Approve/Reject */}
      <UserDetailsModal
        visible={modalVisible}
        data={scanData}
        userDetails={userDetails}
        carDetails={carDetails}
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