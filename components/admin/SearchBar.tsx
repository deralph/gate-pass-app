import { View, TextInput } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function SearchBar({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (text: string) => void;
}) {
  return (
    <View className="flex-row items-center bg-[#4A814940] border border-[#4A8149] rounded-xl px-4 py-3 my-3 mt-6">
      <TextInput
        placeholder="Search by Name, Plate number, or Vehicle"
        placeholderTextColor="#D1D5DB"
        value={value}
        onChangeText={onChangeText}
        className="ml-2 flex-1 text-white font-poppins400 text-xl"
      />
      <Ionicons name="search" size={20} color="#E5E7EB" />
    </View>
  );
}
