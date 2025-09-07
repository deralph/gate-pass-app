import { View, Text, TouchableOpacity } from "react-native";
import { ReactNode } from "react";

type Props = {
  icon: ReactNode;
  title: string;
  subtitle: string;
  tag?: string;
  onPress?: ()=> void;
};

export default function DashboardCard({ icon, title, subtitle, tag, onPress }: Props) {
  return (
    <TouchableOpacity onPress = {onPress} className="bg-white rounded-2xl p-5 shadow-sm w-[48%] mb-4">
      <View className="mb-3">{icon}</View>
      <Text className="text-gray-800 font-semibold text-base">{title}</Text>
      <Text className="text-gray-500 text-sm">{subtitle}</Text>
      {tag && (
        <View className="bg-blue-100 px-3 py-1 rounded-full mt-3 self-start">
          <Text className="text-blue-600 text-xs font-semibold">{tag}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
