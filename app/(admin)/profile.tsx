import { ScrollView, View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from 'expo-router';
import { auth, db } from "../../config/firebase";
import { doc, getDoc, collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import ActivityLogItem from "../../components/dashboard/ActivityLogItem";

export default function AdminProfile() {
  const router = useRouter();
  const [adminData, setAdminData] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (user) {
        // Fetch admin data
        const adminDoc = await getDoc(doc(db, 'users', user.uid));
        if (adminDoc.exists()) {
          setAdminData(adminDoc.data());
        }
        
        // Fetch admin activities (scans processed, etc.)
        const activitiesQuery = query(
          collection(db, 'activities'),
          where('userId', '==', user.uid),
          orderBy('timestamp', 'desc'),
          limit(10)
        );
        
        const querySnapshot = await getDocs(activitiesQuery);
        const adminActivities: any[] = [];
        
        querySnapshot.forEach((doc) => {
          adminActivities.push({ id: doc.id, ...doc.data() });
        });
        
        setActivities(adminActivities);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace('/admin-login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-admin justify-center items-center">
        <ActivityIndicator size="large" color="#fff" />
        <Text className="text-white mt-4">Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-admin">
      {/* Header */}
      <View className="bg-green-800 px-6 pt-16 pb-6">
        <View className="flex-row items-center">
          {adminData?.profileURL ? (
            <Image 
              source={{ uri: adminData.profileURL }} 
              className="w-20 h-20 rounded-full border-4 border-white"
            />
          ) : (
            <View className="w-20 h-20 rounded-full border-4 border-white bg-green-700 justify-center items-center">
              <FontAwesome5 name="user-shield" size={32} color="white" />
            </View>
          )}
          
          <View className="ml-4">
            <Text className="text-white text-xl font-bold">
              {adminData?.fullName || 'Admin User'}
            </Text>
            <Text className="text-green-100">
              {adminData?.email || 'Administrator'}
            </Text>
            <Text className="text-green-100 text-sm mt-1">
              AAUA Security Personnel
            </Text>
          </View>
        </View>
      </View>

      {/* Account Details */}
      <View className="px-6 mt-6">
        <Text className="text-white font-bold text-lg mb-4">Account Details</Text>
        
        <View className="bg-green-700/30 rounded-2xl p-4 border border-green-600">
          <View className="flex-row items-center py-3 border-b border-green-600">
            <Ionicons name="person-outline" size={20} color="#9CA3AF" />
            <Text className="text-gray-300 ml-3 flex-1">Full Name</Text>
            <Text className="text-white font-medium">{adminData?.fullName || 'Not set'}</Text>
          </View>
          
          <View className="flex-row items-center py-3 border-b border-green-600">
            <Ionicons name="id-card-outline" size={20} color="#9CA3AF" />
            <Text className="text-gray-300 ml-3 flex-1">Admin ID</Text>
            <Text className="text-white font-medium">{adminData?.adminId || 'Not set'}</Text>
          </View>
          
          <View className="flex-row items-center py-3 border-b border-green-600">
            <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
            <Text className="text-gray-300 ml-3 flex-1">Email</Text>
            <Text className="text-white font-medium">{adminData?.email || 'Not set'}</Text>
          </View>
          
          <View className="flex-row items-center py-3">
            <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
            <Text className="text-gray-300 ml-3 flex-1">Member since</Text>
            <Text className="text-white font-medium">
              {adminData?.createdAt ? new Date(adminData.createdAt).toLocaleDateString() : 'Unknown'}
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="px-6 mt-6">
        <TouchableOpacity 
          className="flex-row items-center bg-green-700/30 border border-green-600 rounded-2xl p-4 mb-3"
          onPress={() => router.push('/(admin)/edit-profile')}
        >
          <Ionicons name="create-outline" size={20} color="#10B981" />
          <Text className="text-green-400 ml-3 flex-1">Edit Profile</Text>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="flex-row items-center bg-green-700/30 border border-green-600 rounded-2xl p-4 mb-3"
          onPress={() => router.push('/(admin)/change-password')}
        >
          <Ionicons name="lock-closed-outline" size={20} color="#10B981" />
          <Text className="text-green-400 ml-3 flex-1">Change Password</Text>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="flex-row items-center bg-green-700/30 border border-green-600 rounded-2xl p-4"
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text className="text-red-400 ml-3 flex-1">Log Out</Text>
        </TouchableOpacity>
      </View>

      {/* Activity Logs */}
      <View className="mt-6 px-6 mb-8">
        <Text className="text-white font-bold text-lg mb-4">Recent Activities</Text>
        
        <View className="bg-green-700/30 rounded-2xl p-4 border border-green-600">
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
              <Text className="text-gray-400 mt-2">No activities yet</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

// Helper functions for activity display
const getActivityIcon = (action: string) => {
  let iconName = "clipboard";
  let iconColor = "#6B7280";
  
  if (action.includes('login')) {
    iconName = "sign-in-alt";
    iconColor = "#2563eb";
  } else if (action.includes('scan')) {
    iconName = "camera";
    iconColor = "#10B981";
  } else if (action.includes('processed')) {
    iconName = "check-circle";
    iconColor = "#10B981";
  }
  
  return (
    <View className="bg-gray-100 rounded-full p-2">
      <FontAwesome5 name={iconName} size={14} color={iconColor} />
    </View>
  );
};

const getActivityTitle = (action: string) => {
  switch (action) {
    case 'admin_login':
      return 'Admin Login';
    case 'processed_scan_in':
      return 'Processed Entry';
    case 'processed_scan_out':
      return 'Processed Exit';
    default:
      return 'Activity Recorded';
  }
};

const getActivitySubtitle = (activity: any) => {
  if (activity.details) {
    if (activity.details.plateNumber) {
      return `Vehicle: ${activity.details.plateNumber}`;
    } else if (activity.details.userId) {
      return `User: ${activity.details.userId.substring(0, 8)}...`;
    }
  }
  return 'Admin activity';
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