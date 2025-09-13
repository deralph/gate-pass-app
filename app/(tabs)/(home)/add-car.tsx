import { useState } from "react";
import { View, ScrollView, Alert, Text } from "react-native";
import { useRouter } from "expo-router";
import Header from "../../../components/Header";
import InputField from "../../../components/Input";
import UploadImage from "../../../components/UploadImage";
import PrimaryButton from "../../../components/Button";
import * as ImagePicker from "expo-image-picker";
import { addCar } from "../../../services/carService";

export default function AddCar() {
  const router = useRouter();
  const [plate, setPlate] = useState("");
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [carUri, setCarUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!plate || !model || !color) {
      return Alert.alert("Error", "Please fill all car details");
    }

    setLoading(true);
    try {
      const carData = {
        plateNumber: plate.toUpperCase().replace(/\s/g, ''),
        model,
        color
      };

      const result = await addCar(carData, carUri);
      
      if (result.success) {
        Alert.alert("Success", "Car registered successfully!", [
          { text: "OK", onPress: () => router.back() }
        ]);
      } else {
        Alert.alert("Error", result.message || "Failed to add car");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to add car");
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async (setter: (uri: string) => void) => {
    const res = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.6,
    });
    if (!res.canceled) {
      setter(res.assets[0].uri);
    }
  };

  return (
    <View className="flex-1 bg-white ">
      {/* Header */}
      <Header title="Add Car" subtitle="Register new vehicle" />

      <Text className="text-[#4B5563] font-bold text-2xl m-4 ">Car details</Text>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <InputField
          placeholder="Plate number"
          value={plate}
          onChangeText={setPlate}
        />
        <View className="mt-6" />
        <InputField
          placeholder="Car model"
          value={model}
          onChangeText={setModel}
        />
        <View className="mt-6" />
        <InputField
          placeholder="Color"
          value={color}
          onChangeText={setColor}
        />

        <View className="mt-6">
          <UploadImage
            uri={carUri}
            onPick={() => pickImage(setCarUri)}
            label="Upload car picture"
          />
        </View>

        <View className="mt-20">
          <PrimaryButton 
            title="Submit" 
            onPress={handleSubmit} 
            loading={loading}
          />
        </View>
      </ScrollView>
    </View>
  );
}