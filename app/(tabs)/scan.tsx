import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
import Header from "../../components/Header";
import CarDropdown from "../../components/car/Dropdown";
import QRCodeBox from "../../components/car/QRCodeBox";
import { getUserCars, regenerateQRCode } from "../../services/carService";
import { auth } from "../../config/firebase";
import { logActivity } from "../../services/activityService";

export default function Scan() {
  const router = useRouter();
  const [cars, setCars] = useState<any[]>([]);
  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const qrCodeRef = React.useRef();

  useEffect(() => {
    const fetchUserCars = async () => {
      const user = auth.currentUser;
      if (user) {
        const result = await getUserCars(user.uid);
        if (result.success) {
          setCars(result.cars);
          if (result.cars.length > 0) {
            setSelectedCar(result.cars[0]);
          }
        } else {
          Alert.alert("Error", "Failed to load your cars");
        }
      }
      setLoading(false);
    };

    fetchUserCars();
  }, []);

  const handleRegenerateQR = async () => {
    if (!selectedCar) return;
    
    setRegenerating(true);
    const result = await regenerateQRCode(selectedCar.plateNumber);
    
    if (result.success) {
      // Update the selected car with new QR code data
      setSelectedCar({
        ...selectedCar,
        qrCodeData: result.qrCodeData
      });
      
      // Update the cars list
      setCars(cars.map(car => 
        car.plateNumber === selectedCar.plateNumber 
          ? { ...car, qrCodeData: result.qrCodeData } 
          : car
      ));
      
      Alert.alert("Success", "QR Code regenerated successfully");
      
      // Log activity
      await logActivity(auth.currentUser?.uid, "qr_regenerated", {
        plateNumber: selectedCar.plateNumber
      });
    } else {
      Alert.alert("Error", result.error);
    }
    
    setRegenerating(false);
  };

  const handleDownloadQR = async () => {
    if (!qrCodeRef.current || !selectedCar) return;
    
    setDownloading(true);
    try {
      // Request permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission needed", "Please allow access to your photos to download QR codes");
        setDownloading(false);
        return;
      }
      
      // Capture the QR code as an image
      const uri = await captureRef(qrCodeRef, {
        format: 'png',
        quality: 1,
      });
      
      // Save to gallery
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('AAUA Parking QR Codes', asset, false);
      
      Alert.alert("Success", "QR Code saved to your photos");
      
      // Log activity
      await logActivity(auth.currentUser?.uid, "qr_downloaded", {
        plateNumber: selectedCar.plateNumber
      });
    } catch (error) {
      console.error("Error saving QR code:", error);
      Alert.alert("Error", "Failed to save QR code");
    }
    
    setDownloading(false);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="mt-4 text-gray-600">Loading your cars...</Text>
      </View>
    );
  }

  if (cars.length === 0) {
    return (
      <View className="flex-1 bg-gray-50">
        <Header title="Show QR-Code" subtitle="Quick access to QR-Code" />
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-gray-600 text-center mb-6">
            You don't have any registered vehicles yet.
          </Text>
          <TouchableOpacity 
            className="bg-blue-600 py-3 px-6 rounded-2xl"
            onPress={() => router.push('/(home)/add-car')}
          >
            <Text className="text-white font-semibold">Add Your First Car</Text>
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
            value: car.plateNumber,
            ...car
          }))} 
          onSelect={setSelectedCar} 
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
          <View ref={qrCodeRef}>
            <QRCodeBox value={selectedCar.qrCodeData || selectedCar.plateNumber} />
          </View>
        )}

        {/* Action Buttons */}
        <View className="flex-row items-center mt-6">
          <TouchableOpacity 
            className="flex-1 bg-blue-600 py-4 rounded-2xl items-center justify-center flex-row"
            onPress={handleRegenerateQR}
            disabled={regenerating}
          >
            {regenerating ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons name="refresh" size={20} color="white" />
                <Text className="text-white font-poppins600 ml-2">
                  Regenerate QR Code
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            className="w-12 h-12 ml-3 rounded-2xl bg-gray-100 items-center justify-center"
            onPress={handleDownloadQR}
            disabled={downloading}
          >
            {downloading ? (
              <ActivityIndicator color="#111827" />
            ) : (
              <MaterialIcons name="download" size={24} color="#111827" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}