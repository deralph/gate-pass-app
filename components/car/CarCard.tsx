import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { deleteCar } from "../../services/carService";
import { useAuth } from "../../contexts/AuthContext";

export default function CarCard({
  car,
  onCarRemoved
}: {
  car: any;
  onCarRemoved: () => void;
}) {
  const { user } = useAuth();

  const handleRemoveCar = async () => {
    Alert.alert(
      "Remove Car",
      `Are you sure you want to remove ${car.model}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              const result = await deleteCar(car._id);
              if (result.success) {
                Alert.alert("Success", "Car removed successfully");
                onCarRemoved();
              } else {
                Alert.alert("Error", result.message || "Failed to remove car");
              }
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to remove car");
            }
          }
        }
      ]
    );
  };

  return (
    <View className="flex-row justify-between items-center bg-white rounded-2xl border border-gray-200 p-4 mb-3">
      {/* Left: Car Info */}
      <View className="flex-row items-center space-x-3">
        <Image 
          source={car.carPicture ? { uri: car.carPicture.url } : require("../../assets/images/lexus.webp")} 
          className="w-20 h-20 mr-6" 
          resizeMode="contain" 
        />
        <View>
          <Text className="text-gray-800 text-xl font-bold font-poppins600">{car.model}</Text>
          <Text className="text-gray-500 text-base font-poppins500">{car.plateNumber}</Text>
          <Text className="text-gray-500 text-sm font-bold font-poppins400">{car.color}</Text>
          <TouchableOpacity 
            onPress={handleRemoveCar} 
            className="flex-row items-center border-2 border-red-200 p-4 rounded-md mt-6"
          >
            <Ionicons name="trash-outline" size={18} color="#EF4444" />
            <Text className="text-red-900 text-base font-bold font-poppins400 ml-6">Remove</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Right: QR Code + Status */}
      <View className="items-center">
        {car.qrCodeImage ? (
          <Image 
            source={{ uri: car.qrCodeImage.url }} 
            className="w-16 h-16" 
            resizeMode="contain" 
          />
        ) : (
          <View className="w-16 h-16 bg-gray-200 rounded-md items-center justify-center">
            <Text className="text-gray-500 text-xs text-center">No QR Code</Text>
          </View>
        )}
        <View className="mt-2 px-3 py-1 border border-gray-100 rounded-full">
          <Text className="text-xs text-gray-600 font-poppins500">
            {car.isActive ? "Active" : "Inactive"}
          </Text>
        </View>
      </View>
    </View>
  );
}