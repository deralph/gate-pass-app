import { ScrollView, View, Text } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import HeaderSuccess from "../components/HeaderSuccess";
import BarcodeCard from "../components/BarCodeCard";
import InfoRow from "../components/InfoRow";
import PrimaryButton from "../components/Button";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useEffect, useState } from "react";
import { getUserData } from "../services/userService"; // You'll need to create this



// Update AccountCreatedScreen to use qrCodeUrl param
export default function AccountCreatedScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const fullName = params.fullName as string || "Wilson Babafemi";
  const plateNumber = params.plateNumber as string || "ABC 123";
  const model = params.model as string || "Lexus RX 350";
  const color = params.color as string || "Blue";
  const qrCodeUrl = params.qrCodeUrl as string || null;

  return (
    <ScrollView className="flex-1 bg-white">
      <HeaderSuccess />

      {/* Use QR code URL from backend */}
      <BarcodeCard imageUri={qrCodeUrl} />

      <InfoRow 
        icon={<FontAwesome5 name="user-plus" size={20} color="blue" />} 
        label={`Profile: ${fullName}`} 
      />
      <InfoRow 
        icon={<FontAwesome5 name="car-alt" size={24} color="blue" />} 
        label={`Vehicle: ${model} (${plateNumber}) - ${color}`} 
      />
      
      <View className="p-6">
        <PrimaryButton
          title="Continue to Dashboard"
          onPress={() => router.push("/(tabs)/(home)")}
        />
      </View>
    </ScrollView>
  );
}