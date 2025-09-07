import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function StatCard({
  title,
  value,
  icon,
  change,
  changeColor,
}: {
  title: string;
  value: string | number;
  icon: string;
  change: string;
  changeColor: string;
}) {
  return (
    <View className="flex-1 bg-green-800 rounded-2xl px-4 py-3 mr-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-white font-poppins600 text-lg">{value}</Text>
        <Ionicons name={icon as any} size={20} color="#fff" />
      </View>
      <Text className="text-gray-200 text-xs mt-1">{title}</Text>
      <Text className={`text-xs mt-1 font-poppins500`} style={{ color: changeColor }}>
        {change}
      </Text>
    </View>
  );
}
