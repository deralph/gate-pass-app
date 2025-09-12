import { ScrollView, View, Text, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import HeaderSuccess from "../components/HeaderSuccess";
import BarcodeCard from "../components/BarCodeCard";
import InfoRow from "../components/InfoRow";
import PrimaryButton from "../components/Button";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { auth, db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function AccountCreatedScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [userData, setUserData] = useState<any>(null);
  const [carData, setCarData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndCarData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          // Get user data
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
          
          // Get car data - we need to know the plate number from params or find the first car
          const plateNumber = params.plateNumber as string;
          if (plateNumber) {
            const carDoc = await getDoc(doc(db, 'cars', `${user.uid}_${plateNumber}`));
            if (carDoc.exists()) {
              setCarData(carDoc.data());
            }
          } else {
            // If no specific plate number provided, try to get the first car
            const userCarsDoc = await getDoc(doc(db, 'userCars', user.uid));
            if (userCarsDoc.exists() && userCarsDoc.data().cars.length > 0) {
              setCarData(userCarsDoc.data().cars[0]);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user/car data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndCarData();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="mt-4 text-gray-600">Loading your information...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <HeaderSuccess />

      {params.qrCodeData && (
        <BarcodeCard 
          qrCodeData={params.qrCodeData as string} 
        />
      )}

      {userData && (
        <InfoRow 
          icon={<FontAwesome5 name="user-plus" size={20} color="blue" />} 
          label={`Profile: ${userData.fullName || 'User'}`} 
        />
      )}
      
      {carData && (
        <InfoRow 
          icon={<FontAwesome5 name="car-alt" size={24} color="blue" />} 
          label={`Vehicle: ${carData.model || 'Car'} (${carData.plateNumber || 'Plate Number'})`} 
        />
      )}
      
      <View className="p-6">
        <PrimaryButton
          title="Continue to Dashboard"
          onPress={() => router.replace("/(tabs)/(home)")}
        />
      </View>
    </ScrollView>
  );
}