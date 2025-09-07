import { View, Text } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function HeaderSuccess() {
  return (
    <View className="bg-green-500 items-center justify-center py-8 px-4">
      <View className=" my-6">
        <Ionicons name="checkmark-circle" size={50} className="text-blue-900" />
      </View>
      <Text className="text-white text-xl font-semibold">Account Created!</Text>
      <Text className="text-white text-sm mt-3 text-center">
        Your unique barcode has been generated successfully
      </Text>
    </View>
  );
}
