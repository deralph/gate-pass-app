import { ScrollView, View, Text } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import DashboardHeader from "../../../components/dashboard/DashboardHeader";
import DashboardCard from "../../../components/dashboard/DashboardCard";
import ActivityLogItem from "../../../components/dashboard/ActivityLogItem";
import {useRouter} from 'expo-router'


export default function Dashboard() {

const router = useRouter()

  return (
    <ScrollView className="flex-1 bg-gray-100 mt-12">
      <DashboardHeader />

      {/* Quick Actions */}
      <View className="flex-row flex-wrap justify-between px-6 mt-6">
        <DashboardCard
          icon={<FontAwesome5 name="car" size={24} color="#2563eb" />}
          title="My Cars"
          subtitle="View my vehicles"
          tag="2 Active"
        />
        <DashboardCard
          icon={<FontAwesome5 name="plus" size={24} color="#2563eb" />}
          title="Add Car"
          subtitle="Register new vehicles"
          tag="Quick"
          onPress={()=>router.push('/add-car')}
        />
        <DashboardCard
          icon={<FontAwesome5 name="qrcode" size={24} color="#16a34a" />}
          title="Show QR-Code"
          subtitle="Quick access to QR-Code"
          tag="Scan"
        />
      </View>

      {/* Activity Logs */}
      <View className="mt-6 px-6 flex-row justify-between items-center">
        <Text className="text-gray-800 font-semibold text-base">
          Recent Activity Logs
        </Text>
        <Text className="text-blue-600 text-sm font-medium">View All</Text>
      </View>

      <View className="mt-3 bg-white rounded-2xl mx-6 py-4">
        <ActivityLogItem
          icon={
            <View className="bg-green-100 rounded-full p-2">
              <FontAwesome5 name="check" size={14} color="#16a34a" />
            </View>
          }
          title="Access Approved"
          subtitle="Honda Civic • ABC-123"
          time="2 hours ago"
        />
        <ActivityLogItem
          icon={
            <View className="bg-purple-100 rounded-full p-2">
              <FontAwesome5 name="qrcode" size={14} color="#9333ea" />
            </View>
          }
          title="QR Code Generated"
          subtitle="Toyota Camry • XYZ-789"
          time="1 day ago"
        />
        <ActivityLogItem
          icon={
            <View className="bg-blue-100 rounded-full p-2">
              <FontAwesome5 name="car" size={14} color="#2563eb" />
            </View>
          }
          title="Vehicle Registered"
          subtitle="Honda civic added successfully"
          time="3 days ago"
        />
      </View>
    </ScrollView>
  );
}
