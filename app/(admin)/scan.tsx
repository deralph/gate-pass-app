import { View, Text } from "react-native";
import { useEffect, useState } from "react";
import { Camera } from "expo-camera";
import ScanOverlay from "../../components/scan/ScanOverlay";
import UserDetailsModal from "../../components/scan/UserDetailsModal";
import AccessResult from "../../components/scan/AccessResult";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "expo-router";

export default function ScanBarcode() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [decision, setDecision] = useState<null | "Approved" | "Denied">(null);

  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (!scanned) {
      setScanned(true);
      setModalVisible(true);
      console.log("QR Data:", data);
    }
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
      {/* Header */}
      <View className="flex-row items-center px-6 pt-6 pb-2">
        <Ionicons
          name="arrow-back"
          size={24}
          color="#fff"
          onPress={() => navigation.goBack()}
        />
        <Text className="ml-4 text-lg font-poppins600 text-white">
          Scan Barcode
        </Text>
      </View>

      {decision ? (
        <AccessResult
          status={decision}
          details={{
            name: "Ralph Johnson",
            vehicle: "Lexus RX 350",
            plate: "DEF-123",
          }}
        />
      ) : (
        <>
          {/* Camera Scanner */}
          <Camera
            type={Camera?.Constants?.Type?.back}   // ✅ fixed here
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            className="flex-1"
            barCodeScannerSettings={{
              barCodeTypes: ["qr"],
            }}
          >
            <ScanOverlay />
          </Camera>

          {/* Modal for details */}
          <UserDetailsModal
            visible={modalVisible}
            onClose={() => {
              setModalVisible(false);
              setScanned(false);
            }}
            onApprove={() => {
              setDecision("Approved");
              setModalVisible(false);
            }}
            onReject={() => {
              setDecision("Denied");
              setModalVisible(false);
            }}
          />
        </>
      )}
    </View>
  );
}
