// app/(tabs)/notifications.tsx
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import Header from "../../components/Header";
import { getUserNotifications, markAsRead, markAllAsRead, Notification } from "../../services/notificationService";
import { auth } from "../../config/firebase";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { formatDistanceToNow } from 'date-fns';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    const user = auth.currentUser;
    if (!user) return;
    
    try {
      const result = await getUserNotifications(user.uid, 50);
      if (result.success) {
        setNotifications(result.notifications);
        // Calculate unread count
        const unread = result.notifications.filter(n => !n.read).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead(notificationId);
    // Update local state
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
    setUnreadCount(unreadCount - 1);
  };

  const handleMarkAllAsRead = async () => {
    const user = auth.currentUser;
    if (!user) return;
    
    const result = await markAllAsRead(user.uid);
    if (result.success) {
      // Update local state
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadNotifications();
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'access_denied':
        return { icon: 'times-circle', color: '#EF4444', bgColor: '#FEE2E2' };
      case 'vehicle_usage':
        return { icon: 'car', color: '#10B981', bgColor: '#D1FAE5' };
      case 'security_alert':
        return { icon: 'shield-alt', color: '#F59E0B', bgColor: '#FEF3C7' };
      case 'qr_regenerated':
        return { icon: 'qrcode', color: '#8B5CF6', bgColor: '#EDE9FE' };
      default:
        return { icon: 'bell', color: '#6B7280', bgColor: '#F3F4F6' };
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="text-gray-600 mt-4">Loading notifications...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <Header 
        title="Notifications" 
        subtitle={unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up!"}
        rightAction={
          unreadCount > 0 ? (
            <TouchableOpacity onPress={handleMarkAllAsRead}>
              <Text className="text-blue-600 font-medium">Mark all as read</Text>
            </TouchableOpacity>
          ) : null
        }
      />

      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {notifications.length > 0 ? (
          notifications.map((notification) => {
            const { icon, color, bgColor } = getNotificationIcon(notification.type);
            
            return (
              <TouchableOpacity
                key={notification.id}
                className={`bg-white rounded-xl p-4 mb-3 border-l-4 ${!notification.read ? 'border-l-blue-500' : 'border-l-gray-300'}`}
                onPress={() => notification.id && handleMarkAsRead(notification.id)}
              >
                <View className="flex-row items-start">
                  <View className={`rounded-full p-2 mr-3`} style={{ backgroundColor: bgColor }}>
                    <FontAwesome5 name={icon} size={16} color={color} />
                  </View>
                  
                  <View className="flex-1">
                    <Text className="font-poppins600 text-gray-900 text-base">
                      {notification.title}
                    </Text>
                    <Text className="text-gray-600 mt-1">
                      {notification.message}
                    </Text>
                    <Text className="text-gray-400 text-xs mt-2">
                      {formatDistanceToNow(notification.createdAt as Date, { addSuffix: true })}
                    </Text>
                    
                    {notification.data?.reason && (
                      <View className="bg-gray-100 rounded-md p-2 mt-2">
                        <Text className="text-gray-700 text-sm">
                          Reason: {notification.data.reason}
                        </Text>
                      </View>
                    )}
                  </View>
                  
                  {!notification.read && (
                    <View className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1" />
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View className="py-10 items-center">
            <FontAwesome5 name="bell-slash" size={40} color="#9CA3AF" />
            <Text className="text-gray-500 mt-4 text-center">
              No notifications yet
            </Text>
            <Text className="text-gray-400 mt-1 text-center">
              You'll be notified about important activities here
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}