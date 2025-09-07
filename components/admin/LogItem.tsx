import { View, Text,TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function LogItem({
  name,
  vehicle,
  status,
  time,
  date,onPress
}: {
  name: string;
  vehicle: string;
  status: "Approved" | "Denied";
  time: string;
  date: string;
  onPress:()=> void;
}) {
  const isApproved = status === "Approved";

  return (
    <TouchableOpacity onPress={onPress} className="bg-[#4A814940] border border-[#4A8149] rounded-xl px-4 py-3 mb-4">
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Ionicons
            name={isApproved ? "checkmark-circle" : "close-circle"}
            size={24}
            color={isApproved ? "#10B981" : "#EF4444"}
          />
          <Text className="ml-2 text-white font-poppins600 text-2xl">
            {name}
          </Text>
        </View>
        <Text
          className={`font-poppins600 text-xl`}
          style={{ color: isApproved ? "#10B981" : "#EF4444" }}
        >
          {status}
        </Text>
      </View>

      <Text className="text-gray-200 text-base font-poppins400 text-xl mt-2 ml-6">
        {vehicle}
      </Text>
      <Text className="text-gray-400 font-poppins400 text-right text-base mt-1">
        {time} . {date}
      </Text>
    </TouchableOpacity>
  );
}
