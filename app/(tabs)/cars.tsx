import { ScrollView, View, Text, ActivityIndicator, RefreshControl } from "react-native";
import Header from "../../components/Header";
import CarCard from "../../components/car/CarCard";
import ActionButton from "../../components/car/ActionButton";
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { getUserCars } from "../../services/userService";
import { useAuth } from "../../contexts/AuthContext";

export default function Cars() {
  const router = useRouter();
  const { user } = useAuth();
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCars = async () => {
    try {
      const result = await getUserCars();
      if (result.success) {
        console.log("result = ", result)
        setCars(result.cars);
      } else {
        console.error('Failed to fetch cars:', result.message);
      }
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCars();
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="text-gray-600 mt-4">Loading your cars...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <Header title="My Cars" subtitle="Manage your registered vehicles" />

      <ScrollView 
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Car List */}
        {cars.length > 0 ? (
          cars.map((car) => (
            <CarCard 
              key={car._id} 
              car={car} 
              onCarRemoved={fetchCars}
            />
          ))
        ) : (
          <View className="py-10 items-center">
            <Text className="text-gray-500 text-lg font-poppins500 mb-4">
              You haven't added any cars yet
            </Text>
            <ActionButton
              title="Add your first vehicle"
              icon="add-circle-outline"
              color="blue"
              onPress={() => router.push('/(home)/add-car')}
            />
          </View>
        )}

        {/* Action Buttons */}
        {cars.length > 0 && (
          <View className="mt-6">
            <ActionButton
              title="View full barcode"
              icon="qr-code-outline"
              color="#7C3AED"
              onPress={() => router.push('/scan')}
            />
            {/* <ActionButton
              title="Edit vehicle info"
              icon="pencil-sharp"
              color="#111827"
              onPress={() => router.push('/(home)/add-car')}
            /> */}
            <ActionButton
              title="Add another vehicle"
              icon="add-circle-outline"
              color="blue"
              onPress={() => router.push('/(home)/add-car')}
            />
            <ActionButton
              title="Regenerate QR-Code"
              icon="refresh-sharp"
              color="#10B981"
              onPress={() => router.push('/scan')}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}