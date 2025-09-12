import { View, ScrollView, Text, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatCard from "../../components/admin/StatCard";
import MenuCard from "../../components/admin/MenuCard";
import { db } from "../../config/firebase";
import { collection, query, where, getCountFromServer, getDocs, Timestamp } from "firebase/firestore";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalVehicles: 0,
    activeUsers: 0,
    todaysAccess: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total vehicles count
        const vehiclesQuery = query(collection(db, 'cars'), where('isActive', '==', true));
        const vehiclesSnapshot = await getCountFromServer(vehiclesQuery);
        const totalVehicles = vehiclesSnapshot.data().count;

        // Get active users count (users who have logged in recently)
        const usersQuery = query(
          collection(db, 'users'), 
          where('lastLogin', '>=', Timestamp.fromDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))) // Last 30 days
        );
        const usersSnapshot = await getCountFromServer(usersQuery);
        const activeUsers = usersSnapshot.data().count;

        // Get today's access count
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const scansQuery = query(
          collection(db, 'scans'), 
          where('timestamp', '>=', Timestamp.fromDate(today))
        );
        const scansSnapshot = await getCountFromServer(scansQuery);
        const todaysAccess = scansSnapshot.data().count;

        setStats({
          totalVehicles,
          activeUsers,
          todaysAccess
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 bg-admin justify-center items-center">
        <ActivityIndicator size="large" color="#fff" />
        <Text className="text-white mt-4">Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-admin mt-12">
      <DashboardHeader admin />

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
          onPress={() => router.push("/(admin)/logs")}
        />
        <MenuCard
          title="Search"
          subtitle="Find Vehicle Records"
          icon="search"
          color="#10B981"
          onPress={() => router.push("/(admin)/search")}
        />
      </ScrollView>
    </View>
  );
}