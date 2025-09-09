import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function AccessResult({
  status,
  details,
  onReset,
}: {
  status: "Approved" | "Denied";
  details: { name: string; vehicle: string; plate: string; time?: string };
  onReset?: () => void;
}) {
  const isApproved = status === "Approved";

  // colors close to your design
  const headerBg = isApproved ? "bg-emerald-900" : "bg-rose-900";
  const headerTextColor = isApproved ? "#10B981" : "#EF4444";
  const infoBoxBg = isApproved ? "bg-emerald-800" : "bg-[#5A1B1B]"; // slightly different shades

  return (
    <View className="flex-1 items-center px-6 pt-6">
      {/* top rounded header box */}
      <View className={`w-full rounded-xl p-4 items-center ${headerBg}`}>
        <Ionicons name={isApproved ? "checkmark-circle" : "warning"} size={36} color={headerTextColor} />
        <Text className="font-poppins600 text-lg mt-2" style={{ color: headerTextColor }}>
          {isApproved ? "Access Granted" : "Access Denied"}
        </Text>
        <Text className="text-gray-200 text-sm mt-1">{isApproved ? "Driver match detected" : "Driver mismatch detected"}</Text>
      </View>

      {/* middle info */}
      <View className={`mt-6 w-full rounded-xl p-4 ${infoBoxBg}`}>
        <Text className="text-white font-poppins600">{isApproved ? `Driver: ${details.name}` : "Driver does not match"}</Text>
        {isApproved && <Text className="text-gray-200 mt-1">{details.vehicle}</Text>}
        <Text className="text-gray-300 mt-2 text-sm">Scan time: {details.time ?? "-"}</Text>

        {/* highlighted barcode/time pill (like screenshot) */}
        <View className="mt-3 px-3 py-2 rounded-md" style={{ backgroundColor: isApproved ? "#134E4A" : "#7C2D2D" }}>
          <Text className="text-yellow-300 text-sm">Barcode: {details.plate}</Text>
        </View>
      </View>

      {/* action - scan again */}
      <TouchableOpacity onPress={() => onReset && onReset()} className="mt-8 bg-white px-6 py-3 rounded-full">
        <Text className="text-green-800 font-poppins600">Scan again</Text>
      </TouchableOpacity>
    </View>
  );
}
