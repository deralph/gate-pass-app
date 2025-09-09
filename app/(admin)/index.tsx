import { View, ScrollView } from "react-native";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatCard from "../../components/admin/StatCard";
import MenuCard from "../../components/admin/MenuCard";
import { useRouter } from "expo-router";

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-admin mt-12">
      <DashboardHeader admin/>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Stat Cards */}
        <View className="flex-row my-6">
          <StatCard
            title="Total Vehicles"
            value={84}
            icon="car"
            change="+12% from last month"
            changeColor="#34D399"
          />
          <StatCard
            title="Active Users"
            value={68}
            icon="people"
            change="+8% from last month"
            changeColor="#34D399"
          />
          <StatCard
            title="Today’s Access"
            value={66}
            icon="log-in"
            change="+3% from yesterday"
            changeColor="#34D399"
          />
        </View>

        {/* Menu Cards */}
        <MenuCard
          title="Scan Barcode"
          subtitle="Vehicle Access control"
          icon="qr-code"
          color="#10B981"
          onPress={() => router.push("/(admin)/scan")}
        />
        <MenuCard
          title="Access Logs"
          subtitle="View entry records"
          icon="clipboard"
          color="#10B981"
          onPress={() => router.push("/(admin)/(logs)")}
          />
        <MenuCard
          title="Search"
          subtitle="Find Vehicle Records"
          icon="search"
          color="#10B981"
          onPress={() => router.push("/(admin)/(logs)")}
        />
      </ScrollView>
    </View>
  );
}
