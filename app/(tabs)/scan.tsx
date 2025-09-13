import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Header from "../../components/Header";
import CarDropdown from "../../components/car/Dropdown";
import QRCodeBox from "../../components/car/QRCodeBox";
import { getUserCars } from "../../services/userService";
import { regenerateQRCode } from "../../services/carService";
import { useAuth } from "../../contexts/AuthContext";

export default function Scan() {
  const [cars, setCars] = useState<any[]>([]);
  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const result = await getUserCars();
        if (result.success) {
          setCars(result.cars);
          if (result.cars.length > 0) {
            setSelectedCar(result.cars[0]);
          }
        } else {
          console.error('Failed to fetch cars:', result.message);
        }
      } catch (error) {
        console.error('Error fetching cars:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleRegenerateQR = async () => {
    if (!selectedCar) return;
    
    try {
      const result = await regenerateQRCode(selectedCar._id);
      if (result.success) {
        Alert.alert("Success", "QR Code regenerated successfully");
        // Refresh the cars list to get the updated QR code
        const carsResult = await getUserCars();
        if (carsResult.success) {
          setCars(carsResult.cars);
          const updatedCar = carsResult.cars.find((car: any) => car._id === selectedCar._id);
          if (updatedCar) {
            setSelectedCar(updatedCar);
          }
        }
      } else {
        Alert.alert("Error", result.message || "Failed to regenerate QR code");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to regenerate QR code");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="text-gray-600 mt-4">Loading your cars...</Text>
      </View>
    );
  }

  if (cars.length === 0) {
    return (
      <View className="flex-1 bg-gray-50">
        <Header title="Show QR-Code" subtitle="Quick access to QR-Code" />
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-gray-500 text-lg text-center mb-4">
            You haven't added any cars yet. Add a car to generate a QR code.
          </Text>
          <TouchableOpacity 
            className="bg-blue-600 py-4 px-6 rounded-2xl"
            onPress={() => router.push('/(home)/add-car')}
          >
            <Text className="text-white font-poppins600">Add Car</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <Header title="Show QR-Code" subtitle="Quick access to QR-Code" />

      <View className="px-4 mt-4">
        {/* Dropdown */}
        <CarDropdown 
          data={cars.map(car => ({ 
            label: `${car.model} - ${car.plateNumber}`, 
            value: car._id,
            name: car.model,
            color: car.color,
            plateNumber: car.plateNumber
          }))} 
          onSelect={(carId) => {
            const car = cars.find(c => c._id === carId);
            if (car) setSelectedCar(car);
          }} 
        />

        {/* Car Info */}
        {selectedCar && (
          <View className="bg-white border border-gray-200 rounded-2xl p-4 mb-4">
            <Text className="text-gray-800 text-xl font-bold font-poppins600">
              Car name: {selectedCar.model}
            </Text>
            <Text className="text-gray-600 text-base font-poppins400 mt-1">
              Plate No: {selectedCar.plateNumber}
            </Text>
            <Text className="text-gray-600 font-poppins400">
              Colour: {selectedCar.color}
            </Text>
          </View>
        )}

        {/* QR Code */}
        {selectedCar && (
          <QRCodeBox 
            qrCodeUrl={selectedCar.qrCodeImage.url} 
            plateNumber={selectedCar.plateNumber} 
          />
        )}

        {/* Action Buttons */}
        <View className="flex-row items-center mt-6">
          <TouchableOpacity 
            className="flex-1 bg-blue-600 py-4 rounded-2xl items-center justify-center flex-row"
            onPress={handleRegenerateQR}
          >
            <Ionicons name="refresh" size={20} color="white" />
            <Text className="text-white font-poppins600 ml-2">
              Regenerate QR Code
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="w-12 h-12 ml-3 rounded-2xl bg-gray-100 items-center justify-center">
            <MaterialIcons name="download" size={24} color="#111827" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}