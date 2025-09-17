import { View, ScrollView, ActivityIndicator, Text } from "react-native";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatCard from "../../components/admin/StatCard";
import MenuCard from "../../components/admin/MenuCard";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { getAdminStats } from "../../services/adminService";
// import { useAuth } from "../../contexts/AuthContext";

export default function AdminDashboard() {
  const router = useRouter();
  // const { user } = useAuth();
  const [stats, setStats] = useState({
    totalVehicles: 0,
    activeUsers: 0,
    todaysAccess: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const result = await getAdminStats();
      if (result.success) {
        setStats({
          totalVehicles: result.totalVehicles || 0,
          activeUsers: result.activeUsers || 0,
          todaysAccess: result.todaysAccess || 0,
        });
      } else {
        console.error("Failed to fetch stats:", result.message);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-admin justify-center items-center">
        <ActivityIndicator size="large" color="#34A75E" />
        <Text className="text-white mt-4">Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-admin mt-12">
      <DashboardHeader admin userName={""} />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Stat Cards */}
        <View className="flex-row my-6">
          <StatCard
            title="Total Vehicles"
            value={stats.totalVehicles}
            icon="car"
            change="+12% from last month"
            changeColor="#34D399"
          />
          <StatCard
            title="Active Users"
            value={stats.activeUsers}
            icon="people"
            change="+8% from last month"
            changeColor="#34D399"
          />
          <StatCard
            title="Today's Access"
            value={stats.todaysAccess}
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
