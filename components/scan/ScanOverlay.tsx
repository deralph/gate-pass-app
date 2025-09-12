import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function ScanOverlay({
  data,
  userDetails,
  carDetails,
  decision,
  onReset,
}: {
  data?: any;
  userDetails?: any;
  carDetails?: any;
  decision?: "Approved" | "Denied" | null;
  onReset?: () => void;
}) {
  const isApproved = decision === "Approved";

  // Default scanning overlay
  if (!decision) {
    return (
      <View className="items-center mt-6">
        {/* Top warning box */}
        <View className="bg-gray-800 rounded-xl px-4 py-3 w-[90%] items-center">
          <Ionicons name="warning" size={28} color="#FACC15" />
          <Text className="text-white font-poppins600 mt-2 text-sm">Align barcode inside the frame</Text>
          <Text className="text-gray-300 font-poppins400 text-xs text-center">Position the vehicle barcode clearly within the scanning area</Text>
        </View>

        {/* Scanning Frame */}
        <View className="border border-gray-300 mt-8 w-[85%] h-[280px] rounded-md" />
      </View>
    );
  }

  // Decision UI inside the frame (matches your screenshots)
  return (
    <View className="items-center mt-6 w-full px-4">
      {/* Status chip */}
      <View className="w-[90%] rounded-xl p-4 items-center" style={{ backgroundColor: isApproved ? '#0F5132' : '#4C1D1D' }}>
        <Ionicons name={isApproved ? 'checkmark-circle' : 'warning'} size={28} color={isApproved ? '#10B981' : '#EF4444'} />
        <Text className="font-poppins600 mt-2" style={{ color: isApproved ? '#10B981' : '#EF4444' }}>
          {isApproved ? 'Access Granted' : 'Access Denied'}
        </Text>
        <Text className="text-gray-200 mt-1 text-sm">{isApproved ? 'Driver match detected' : 'Driver mismatch detected'}</Text>
      </View>

      {/* Inner info card (inside frame) */}
      <View className="mt-4 w-[90%] rounded-xl p-4" style={{ backgroundColor: isApproved ? '#0B3F2F' : '#3F1A1A' }}>
        {isApproved ? (
          <>
            <Text className="text-white font-poppins600">Driver: {userDetails?.fullName || 'Unknown'}</Text>
            <Text className="text-gray-200 mt-1 text-sm">{carDetails?.model || 'Vehicle'} • {carDetails?.plateNumber || 'Plate'}</Text>
          </>
        ) : (
          <>
            <Text className="text-red-400 font-poppins600">Driver does not match</Text>
            <Text className="text-gray-200 mt-1 text-sm">The scanned driver does not match the registered details for this vehicle.</Text>
          </>
        )}

        <View className="mt-3 px-3 py-2 rounded-md" style={{ backgroundColor: isApproved ? '#11302A' : '#5A1B1B' }}>
          <Text className="text-yellow-300 text-sm">Scan time: {data?.timestamp ? new Date(data.timestamp).toLocaleTimeString() : '-'}</Text>
          <Text className="text-yellow-300 text-sm">Barcode: {data?.plateNumber || 'Unknown'}</Text>
        </View>
      </View>

      {/* Action row: scan again */}
      <TouchableOpacity onPress={() => onReset && onReset()} className="mt-6 bg-white px-6 py-3 rounded-full">
        <Text className="text-green-800 font-poppins600">Scan again</Text>
      </TouchableOpacity>
    </View>
  );
}