import { ScrollView, View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useRouter } from 'expo-router';
import { auth } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { getUserActivities } from "../../services/activityService";
import ActivityLogItem from "../../components/dashboard/ActivityLogItem";

export default function Profile() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (user) {
        // Fetch user data
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
        
        // Fetch user activities
        const activitiesResult = await getUserActivities(user.uid, 20); // Get last 20 activities
        if (activitiesResult.success) {
          setActivities(activitiesResult.activities);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace('/sign-in');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="mt-4 text-gray-600">Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-blue-600 px-6 pt-16 pb-6">
        <View className="flex-row items-center">
          {userData?.profileURL ? (
            <Image 
              source={{ uri: userData.profileURL }} 
              className="w-20 h-20 rounded-full border-4 border-white"
            />
          ) : (
            <View className="w-20 h-20 rounded-full border-4 border-white bg-blue-500 justify-center items-center">
              <FontAwesome5 name="user" size={32} color="white" />
            </View>
          )}
          
          <View className="ml-4">
            <Text className="text-white text-xl font-bold">
              {userData?.fullName || 'User'}
            </Text>
            <Text className="text-blue-100">
              {userData?.matric || userData?.email}
            </Text>
            <Text className="text-blue-100 text-sm mt-1">
              {userData?.role === 'admin' ? 'Administrator' : 'Student/Staff'}
            </Text>
          </View>
        </View>
      </View>

      {/* Account Details */}
      <View className="px-6 mt-6">
        <Text className="text-gray-800 font-bold text-lg mb-4">Account Details</Text>
        
        <View className="bg-gray-50 rounded-2xl p-4">
          <View className="flex-row items-center py-3 border-b border-gray-200">
            <Ionicons name="person-outline" size={20} color="#6B7280" />
            <Text className="text-gray-600 ml-3 flex-1">Full Name</Text>
            <Text className="text-gray-800 font-medium">{userData?.fullName || 'Not set'}</Text>
          </View>
          
          <View className="flex-row items-center py-3 border-b border-gray-200">
            <Ionicons name="id-card-outline" size={20} color="#6B7280" />
            <Text className="text-gray-600 ml-3 flex-1">ID Number</Text>
            <Text className="text-gray-800 font-medium">{userData?.matric || 'Not set'}</Text>
          </View>
          
          <View className="flex-row items-center py-3 border-b border-gray-200">
            <Ionicons name="mail-outline" size={20} color="#6B7280" />
            <Text className="text-gray-600 ml-3 flex-1">Email</Text>
            <Text className="text-gray-800 font-medium">{userData?.email || 'Not set'}</Text>
          </View>
          
          <View className="flex-row items-center py-3">
            <Ionicons name="calendar-outline" size={20} color="#6B7280" />
            <Text className="text-gray-600 ml-3 flex-1">Member since</Text>
            <Text className="text-gray-800 font-medium">
              {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'Unknown'}
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="px-6 mt-6">
        <TouchableOpacity 
          className="flex-row items-center bg-white border border-gray-200 rounded-2xl p-4 mb-3"
          onPress={() => router.push('/(home)/edit-profile')}
        >
          <Ionicons name="create-outline" size={20} color="#2563EB" />
          <Text className="text-blue-600 ml-3 flex-1">Edit Profile</Text>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="flex-row items-center bg-white border border-gray-200 rounded-2xl p-4 mb-3"
          onPress={() => router.push('/change-password')}
        >
          <Ionicons name="lock-closed-outline" size={20} color="#2563EB" />
          <Text className="text-blue-600 ml-3 flex-1">Change Password</Text>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="flex-row items-center bg-white border border-gray-200 rounded-2xl p-4"
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#DC2626" />
          <Text className="text-red-600 ml-3 flex-1">Log Out</Text>
        </TouchableOpacity>
      </View>

      {/* Activity Logs */}
      <View className="mt-6 px-6">
        <Text className="text-gray-800 font-bold text-lg mb-4">Recent Activities</Text>
        
        <View className="bg-gray-50 rounded-2xl p-4">
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
      </View>
      
      {/* App Version */}
      <View className="py-6 items-center">
        <Text className="text-gray-400 text-sm">AAUA Parking App v1.0.0</Text>
      </View>
    </ScrollView>
  );
}

// Reuse the helper functions from Dashboard
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