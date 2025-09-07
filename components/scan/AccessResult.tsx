import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function AccessResult({
  status,
  details,
}: {
  status: "Approved" | "Denied";
  details: { name: string; vehicle: string; plate: string };
}) {
  const isApproved = status === "Approved";

  return (
    <View className="flex-1 justify-center items-center px-6">
      <Ionicons
        name={isApproved ? "checkmark-circle" : "close-circle"}
        size={90}
        color={isApproved ? "#10B981" : "#EF4444"}
      />
      <Text
        className="mt-3 font-poppins600 text-2xl"
        style={{ color: isApproved ? "#10B981" : "#EF4444" }}
      >
        {isApproved ? "Access Granted" : "Access Denied"}
      </Text>

      <View className="mt-5 w-full bg-gray-800 rounded-xl p-4">
        <Text className="text-white font-poppins600">{details.name}</Text>
        <Text className="text-gray-300 font-poppins400 text-sm mt-1">
          {details.vehicle}
        </Text>
        <Text className="text-gray-400 font-poppins400 text-xs mt-1">
          Plate: {details.plate}
        </Text>
      </View>
    </View>
  );
}
