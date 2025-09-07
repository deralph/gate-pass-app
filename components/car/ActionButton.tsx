import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ActionButton({
  title,
  icon,
  color = "#111827",
  onPress,
}: {
  title: string;
  icon: string;
  color?: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between bg-white rounded-2xl px-4 py-4 mb-3"
    >
      <View className="flex-row items-center space-x-3">
        <View className="w-9 h-9 rounded-full items-center justify-center" >
          <Ionicons name={icon} size={18} color={color} />
        </View>
        <Text className="text-gray-700 ml-6 font-poppins500">{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );
}
