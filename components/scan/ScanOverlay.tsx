import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function ScanOverlay() {
  return (
    <View className="items-center mt-6">
      {/* Warning Box */}
      <View className="bg-gray-800 rounded-xl px-4 py-3 w-[90%] items-center">
        <Ionicons name="warning" size={28} color="#FACC15" />
        <Text className="text-white font-poppins600 mt-2 text-sm">
          Align barcode inside the frame
        </Text>
        <Text className="text-gray-300 font-poppins400 text-xs text-center">
          Position the vehicle barcode clearly within the scanning area
        </Text>
      </View>

      {/* Scanning Frame */}
      <View className="border border-gray-300 mt-8 w-[85%] h-[280px] rounded-md" />
    </View>
  );
}
