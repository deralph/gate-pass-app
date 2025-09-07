import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  const router = useRouter();

  return (
    <View className="flex-row items-center px-4 py-4 bg-white mt-12">
      <TouchableOpacity onPress={() => router.back()} className="mr-3">
        <Ionicons name="chevron-back" size={24} color="#111827" />
      </TouchableOpacity>
      <View>
        <Text className="text-lg font-poppins600 text-gray-800">{title}</Text>
        {subtitle && (
          <Text className="text-sm text-gray-500 font-poppins400">{subtitle}</Text>
        )}
      </View>
    </View>
  );
}
