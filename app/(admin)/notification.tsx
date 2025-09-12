import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import Header from "../../components/Header";
import { getUserNotifications } from "../../services/notificationService";
import { auth } from "../../config/firebase";
import { FontAwesome5 } from "@expo/vector-icons";

export default function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchNotifications = async () => {
      const user = auth.currentUser;
      if (user) {
        const result = await getUserNotifications(user.uid);
        if (result.success) {
          setNotifications(result.notifications);
        }
      }
      setLoading(false);
    };

    fetchNotifications();
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'access_approved':
        return { icon: 'check-circle', color: '#10B981' };
      case 'access_denied':
        return { icon: 'times-circle', color: '#EF4444' };
      case 'qr_regenerated':
        return { icon: 'qrcode', color: '#9333EA' };
      default:
        return { icon: 'bell', color: '#6B7280' };
    }
  };

  const getNotificationTitle = (type: string) => {
    switch (type) {
      case 'access_approved':
        return 'Access Approved';
      case 'access_denied':
        return 'Access Denied';
      case 'qr_regenerated':
        return 'QR Code Regenerated';
      default:
        return 'Notification';
    }
  };

  const getNotificationMessage = (notification: any) => {
    switch (notification.type) {
      case 'access_approved':
        return `Your vehicle ${notification.data.plateNumber} was granted access`;
      case 'access_denied':
        return `Access denied for ${notification.data.plateNumber}: ${notification.data.reason || 'Driver mismatch'}`;
      case 'qr_regenerated':
        return `Your QR code for ${notification.data.plateNumber} has been regenerated`;
      default:
        return 'You have a new notification';
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-admin justify-center items-center">
        <ActivityIndicator size="large" color="#fff" />
        <Text className="text-white mt-4">Loading notifications...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-admin">
      <Header title="Notifications" admin />
      
      <ScrollView className="flex-1 px-4 mt-4">
        {notifications.length > 0 ? (
          notifications.map((notification, index) => {
            const { icon, color } = getNotificationIcon(notification.type);
            
            return (
              <TouchableOpacity
                key={index}
                className="bg-green-700/30 border border-green-600 rounded-xl p-4 mb-3"
                onPress={() => {
                  // Mark as read and potentially navigate to relevant screen
                }}
              >
                <View className="flex-row items-center">
                  <View className="bg-green-800 rounded-full p-2 mr-3">
                    <FontAwesome5 name={icon} size={16} color={color} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-poppins600">
                      {getNotificationTitle(notification.type)}
                    </Text>
                    <Text className="text-gray-300 mt-1">
                      {getNotificationMessage(notification)}
                    </Text>
                    <Text className="text-gray-400 text-xs mt-2">
                      {new Date(notification.createdAt).toLocaleString()}
                    </Text>
                  </View>
                  {!notification.read && (
                    <View className="w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View className="py-10 items-center">
            <FontAwesome5 name="bell-slash" size={32} color="#6B7280" />
            <Text className="text-gray-400 mt-4">No notifications yet</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}