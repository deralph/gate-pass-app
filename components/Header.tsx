import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Header({ title, subtitle,admin }: { title: string; subtitle?: string,admin?: boolean }) {
  const router = useRouter();

  return (
    <View className={`flex-row items-center px-4 py-4 ${admin?"":"bg-white"} mt-12`}>
      <TouchableOpacity onPress={() => router.back()} className="mr-3">
        <Ionicons name="chevron-back" size={24} color="#ffffff" />
      </TouchableOpacity>
      <View className="ml-4">
        <Text className={`text-lg font-poppins600 ${admin?"text-white":"text-gray-800"}`}>{title}</Text>
        {subtitle && (
          <Text className={`text-sm ${admin?"text-white":"text-gray-500"} font-poppins400`}>{subtitle}</Text>
        )}
      </View>
    </View>
  );
}
