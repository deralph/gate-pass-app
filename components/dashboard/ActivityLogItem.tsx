import { View, Text } from "react-native";
import { ReactNode } from "react";

type Props = {
  icon: ReactNode;
  title: string;
  subtitle: string;
  time: string;
};

export default function ActivityLogItem({ icon, title, subtitle, time }: Props) {
  return (
    <View className="flex-row items-center justify-between bg-gray-50 p-4 rounded-2xl mb-4 mx-6 ">
      <View className="flex-row items-center">
        <View className="mr-3">{icon}</View>
        <View>
          <Text className="text-gray-800 font-medium">{title}</Text>
          <Text className="text-gray-500 text-xs">{subtitle}</Text>
        </View>
      </View>
      <Text className="text-gray-400 text-xs">{time}</Text>
    </View>
  );
}
