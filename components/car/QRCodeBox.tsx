import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { useState } from "react";

export default function QRCodeBox({ qrCodeUrl, plateNumber }: { qrCodeUrl: string, plateNumber: string }) {
  const [downloading, setDownloading] = useState(false);

  const downloadQRCode = async () => {
    if (!qrCodeUrl) {
      Alert.alert("Error", "No QR code available to download");
      return;
    }

    try {
      setDownloading(true);
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert("Permission needed", "Please allow access to your media library to save the QR code");
        return;
      }

      const fileUri = FileSystem.cacheDirectory + `${plateNumber}_qrcode.png`;
      const { uri } = await FileSystem.downloadAsync(qrCodeUrl, fileUri);
      
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('Download', asset, false);
      
      Alert.alert("Success", "QR code saved to your photos");
    } catch (error) {
      console.error('Error downloading QR code:', error);
      Alert.alert("Error", "Failed to download QR code");
    } finally {
      setDownloading(false);
    }
  };

  if (!qrCodeUrl) {
    return (
      <View className="bg-gray-50 rounded-2xl border border-gray-200 p-6 items-center mt-4">
        <View className="w-48 h-48 bg-gray-200 items-center justify-center rounded-md">
          <Text className="text-gray-500">No QR Code Available</Text>
        </View>
        <Text className="text-xs text-gray-500 font-poppins400 text-center mt-4">
          Present QR Code at AAUA senate building gate for scanning.
        </Text>
      </View>
    );
  }

  return (
    <View className="bg-gray-50 rounded-2xl border border-gray-200 p-6 items-center mt-4">
      <Image 
        source={{ uri: qrCodeUrl }} 
        className="w-48 h-48" 
        resizeMode="contain" 
      />
      <Text className="text-xs text-gray-500 font-poppins400 text-center mt-4">
        Present QR Code at AAUA senate building gate for scanning.
      </Text>
      
      <TouchableOpacity 
        className="mt-4 flex-row items-center"
        onPress={downloadQRCode}
        disabled={downloading}
      >
        <Text className="text-blue-600 text-sm font-poppins500 mr-2">
          {downloading ? "Downloading..." : "Download QR Code"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}