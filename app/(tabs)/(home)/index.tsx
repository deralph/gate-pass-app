import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useRouter } from 'expo-router';
import DashboardHeader from "../../../components/dashboard/DashboardHeader";
import DashboardCard from "../../../components/dashboard/DashboardCard";
import ActivityLogItem from "../../../components/dashboard/ActivityLogItem";
import { getUserActivities } from "../../../services/activityService";
import { getUserCars } from "../../../services/carService";
import { auth } from "../../../config/firebase";

export default function Dashboard() {
  const router = useRouter();
  const [activities, setActivities] = useState<any[]>([]);
  const [carCount, setCarCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (user) {
        // Fetch user activities
        const activitiesResult = await getUserActivities(user.uid, 3); // Get last 3 activities
        if (activitiesResult.success) {
          setActivities(activitiesResult.activities);
        }
        
        // Fetch user cars count
        const carsResult = await getUserCars(user.uid);
        if (carsResult.success) {
          setCarCount(carsResult.cars.length);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 bg-gray-100 justify-center items-center">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="mt-4 text-gray-600">Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-100 mt-12">
      <DashboardHeader />

      {/* Quick Actions */}
      <View className="flex-row flex-wrap justify-between px-6 mt-6">
        <DashboardCard
          icon={<FontAwesome5 name="car" size={24} color="#2563eb" />}
          title="My Cars"
          subtitle="View my vehicles"
          tag={`${carCount} Active`}
          onPress={() => router.push('/cars')}
        />
        <DashboardCard
          icon={<FontAwesome5 name="plus" size={24} color="#2563eb" />}
          title="Add Car"
          subtitle="Register new vehicles"
          tag="Quick"
          onPress={() => router.push('/(home)/add-car')}
        />
        <DashboardCard
          icon={<FontAwesome5 name="qrcode" size={24} color="#16a34a" />}
          title="Show QR-Code"
          subtitle="Quick access to QR-Code"
          tag="Scan"
          onPress={() => router.push('/scan')}
        />
      </View>

      {/* Activity Logs */}
      <View className="mt-6 px-6 flex-row justify-between items-center">
        <Text className="text-gray-800 font-semibold text-base">
          Recent Activity Logs
        </Text>
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <Text className="text-blue-600 text-sm font-medium">View All</Text>
        </TouchableOpacity>
      </View>

      <View className="mt-3 bg-white rounded-2xl mx-6 py-4">
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <ActivityLogItem
              key={index}
              icon={getActivityIcon(activity.action)}
              title={getActivityTitle(activity.action)}
              subtitle={getActivitySubtitle(activity)}
              time={formatTime(activity.timestamp)}
            />
          ))
        ) : (
          <View className="py-6 items-center">
            <FontAwesome5 name="clipboard-list" size={24} color="#9CA3AF" />
            <Text className="text-gray-500 mt-2">No activities yet</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

// Helper function to get appropriate icon for activity type
const getActivityIcon = (action: string) => {
  let iconName = "clipboard";
  let iconColor = "#6B7280";
  
  if (action.includes('login')) {
    iconName = "sign-in-alt";
    iconColor = "#2563eb";
  } else if (action.includes('signup')) {
    iconName = "user-plus";
    iconColor = "#9333ea";
  } else if (action.includes('car_added')) {
    iconName = "car";
    iconColor = "#16a34a";
  } else if (action.includes('qr_')) {
    iconName = "qrcode";
    iconColor = "#9333ea";
  } else if (action.includes('scan')) {
    iconName = "camera";
    iconColor = "#dc2626";
  }
  
  return (
    <View className="bg-gray-100 rounded-full p-2">
      <FontAwesome5 name={iconName} size={14} color={iconColor} />
    </View>
  );
};

// Helper function to get activity title
const getActivityTitle = (action: string) => {
  switch (action) {
    case 'user_signup':
      return 'Account Created';
    case 'user_login':
      return 'Login Successful';
    case 'car_added':
      return 'Vehicle Registered';
    case 'car_updated':
      return 'Vehicle Updated';
    case 'qr_generated':
      return 'QR Code Generated';
    case 'qr_regenerated':
      return 'QR Code Regenerated';
    case 'scan_in':
      return 'Access Granted';
    case 'scan_out':
      return 'Exit Recorded';
    default:
      return 'Activity Recorded';
  }
};

// Helper function to get activity subtitle
const getActivitySubtitle = (activity: any) => {
  if (activity.details) {
    if (activity.details.plateNumber) {
      return `${activity.details.model || 'Vehicle'} • ${activity.details.plateNumber}`;
    } else if (activity.details.email) {
      return activity.details.email;
    }
  }
  return 'Activity completed';
};

// Helper function to format timestamp
const formatTime = (timestamp: string) => {
  const now = new Date();
  const activityTime = new Date(timestamp);
  const diffInHours = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  }
};