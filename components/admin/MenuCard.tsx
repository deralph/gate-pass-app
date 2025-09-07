import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function MenuCard({
  title,
  subtitle,
  icon,
  color,
  onPress,
}: {
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center border border-[#34A75E] rounded-2xl px-4 py-4 mb-6"
    >
      <View
        className="w-12 h-12 rounded-lg items-center justify-center mr-4"
        style={{ backgroundColor: color }}
      >
        <Ionicons name={icon } size={22} color="#fff" />
      </View>
      <View>
        <Text className="text-white font-poppins600 text-2xl">{title}</Text>
        <Text className="text-gray-200 font-poppins400 text-xl mt-4">{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
}
