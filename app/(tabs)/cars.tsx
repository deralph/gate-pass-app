import { ScrollView, View, Text } from "react-native";
import { useRouter } from 'expo-router';
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import CarCard from "../../components/car/CarCard";
import ActionButton from "../../components/car/ActionButton";
import { getUserCars } from "../../services/carService";
import { auth } from "../../config/firebase";

export default function Cars() {
  const router = useRouter();
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      const user = auth.currentUser;
      if (user) {
        const result = await getUserCars(user.uid);
        if (result.success) {
          setCars(result.cars);
        } else {
          console.error("Error fetching cars:", result.error);
        }
      }
      setLoading(false);
    };

    fetchCars();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <Text>Loading your cars...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <Header title="My Cars" subtitle="Manage your registered vehicles" />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Car List */}
        {cars.length > 0 ? (
          cars.map((car, index) => (
            <CarCard
              key={index}
              model={car.model}
              plate={car.plateNumber}
              color={car.color}
              carColorIcon={car.carImageURL || require("../../assets/images/lexus.webp")}
              onPress={() => router.push({
                pathname: '/(home)/add-car',
                params: { 
                  carData: JSON.stringify(car),
                  isEdit: true 
                }
              })}
            />
          ))
        ) : (
          <View className="items-center py-10">
            <Text className="text-gray-500">No cars registered yet</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View className="mt-6">
          {cars.length > 0 && (
            <>
              <ActionButton
                title="View full barcode"
                icon="qr-code-outline"
                color="#7C3AED"
                onPress={() => router.push('/scan')}
              />
              <ActionButton
                title="Regenerate QR-Code"
                icon="refresh-sharp"
                color="#10B981"
                onPress={() => {
                  // Implement QR regeneration logic
                  Alert.alert("Feature coming soon");
                }}
              />
            </>
          )}
          
          <ActionButton
            title="Add vehicle"
            icon="add-circle-outline"
            color="blue"
            onPress={() => router.push('/(home)/add-car')}
          />
        </View>
      </ScrollView>
    </View>
  );
}