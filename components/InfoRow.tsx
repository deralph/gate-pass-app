import { View, Text } from "react-native";
import { ReactNode } from "react";

type InfoRowProps = {
  icon: ReactNode; // accepts any valid React element
  label: string;
};

export default function InfoRow({ icon, label }: InfoRowProps) {
  return (
    <View className="flex-row items-center bg-gray-100 p-4 rounded-xl mx-6 mt-6">
      {icon}
      <Text className="ml-3 text-gray-700 font-medium">{label}</Text>
    </View>
  );
}
