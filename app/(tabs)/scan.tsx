import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons,MaterialIcons } from "@expo/vector-icons";
import Header from "../../components/Header";
import CarDropdown from "../../components/car/Dropdown";
import QRCodeBox from "../../components/car/QRCodeBox";

const cars = [
  { label: "Lexus RX 350 - DEF-123", value: "DEF-123-LAG", name: "Lexus RX 350", color: "Black" },
  { label: "Toyota Camry - LMN-789", value: "LMN-789-LAG", name: "Toyota Camry", color: "Blue" },
];

export default function Scan() {
  const [selectedCar, setSelectedCar] = useState<any>(cars[0]);

  return (
    <View className="flex-1 bg-gray-50">
      <Header title="Show QR-Code" subtitle="Quick access to QR-Code" />

      <View className="px-4 mt-4">
        {/* Dropdown */}
        <CarDropdown data={cars} onSelect={setSelectedCar} />

        {/* Car Info */}
        {selectedCar && (
          <View className="bg-white border border-gray-200 rounded-2xl p-4 mb-4">
            <Text className="text-gray-800 Text-xl font-bold font-poppins600">
              Car name: {selectedCar.name}
            </Text>
            <Text className="text-gray-600 text-base font-poppins400 mt-1">
              Plate No: {selectedCar.value}
            </Text>
            <Text className="text-gray-600 font-poppins400">
              Colour: {selectedCar.color}
            </Text>
          </View>
        )}

        {/* QR Code */}
        <QRCodeBox value={selectedCar?.value || ""} />

        {/* Action Buttons */}
        <View className="flex-row items-center mt-6">
          <TouchableOpacity className="flex-1 bg-blue-600 py-4 rounded-2xl items-center justify-center flex-row">
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
