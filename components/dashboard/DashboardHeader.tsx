import { View, Text } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';

interface DashboardHeaderProps {
  admin?: boolean;
  userName: string;
}

export default function DashboardHeader({ admin, userName }: DashboardHeaderProps) {
  return (
    <View className="flex-row justify-between items-center px-6 mt-4">
      <View>
        <Text className={`text-2xl font-semibold ${admin ? "text-white" : "text-gray-800"} mt-4`}>
          Dashboard
        </Text>
        <Text className={`${admin ? "text-white" : "text-gray-800"} text-xl mt-3`}>
          Welcome back, {userName}
        </Text>
      </View>

      {/* Notification Badge */}
      <View className="relative">
        <Ionicons name="notifications" size={24} color={admin ? "white" : "#6b7280"} />
        <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
          <Text className="text-white text-xs font-semibold">3</Text>
        </View>
      </View>
    </View>
  );
}