// components/CustomTabBar.tsx
import { View, Text, TouchableOpacity } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { getUnreadCount } from '../services/notificationService';
import { auth } from '../services/firebase';

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      const user = auth.currentUser;
      if (user) {
        const result = await getUnreadCount(user.uid);
        if (result.success) {
          setUnreadCount(result.count);
        }
      }
    };

    fetchUnreadCount();
    // Set up a real-time listener if needed
  }, []);

  const getIcon = (routeName: string, color: string, size: number) => {
    switch (routeName) {
      case 'home':
        return <Ionicons name="home" size={size} color={color} />;
      case 'cars':
        return <FontAwesome5 name="car" size={size} color={color} />;
      case 'notifications':
        return <Ionicons name="notifications" size={size} color={color} />;
      case 'profile':
        return <Ionicons name="person" size={size} color={color} />;
      default:
        return <Ionicons name="help" size={size} color={color} />;
    }
  };

  return (
    <View className="flex-row bg-white border-t border-gray-200 py-2">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title || route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const color = isFocused ? '#2563EB' : '#6B7280';

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            className="flex-1 items-center justify-center"
          >
            {getIcon(route.name, color, 24)}
            <Text className="text-xs mt-1" style={{ color }}>
              {label}
            </Text>
            {route.name === 'notifications' && unreadCount > 0 && (
              <View className="absolute top-0 right-6 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
                <Text className="text-white text-xs">{unreadCount > 9 ? '9+' : unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}