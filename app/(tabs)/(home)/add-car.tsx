import { useState, useEffect } from "react";
import { View, ScrollView, Alert, Text } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Header from "../../../components/Header";
import InputField from "../../../components/Input";
import UploadImage from "../../../components/UploadImage";
import PrimaryButton from "../../../components/Button";
import * as ImagePicker from "expo-image-picker";
import { addCar, updateCar } from "../../../services/carService";

export default function AddCar() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const isEdit = params.isEdit === 'true';
  const existingCar = params.carData ? JSON.parse(params.carData as string) : null;
  
  const [plate, setPlate] = useState(existingCar?.plateNumber || "");
  const [model, setModel] = useState(existingCar?.model || "");
  const [color, setColor] = useState(existingCar?.color || "");
  const [carUri, setCarUri] = useState<string | null>(existingCar?.carImageURL || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existingCar) {
      setPlate(existingCar.plateNumber);
      setModel(existingCar.model);
      setColor(existingCar.color);
      setCarUri(existingCar.carImageURL);
    }
  }, [existingCar]);

  const pickImage = async (setter: (uri: string) => void) => {
    const res = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.6,
      aspect: [4, 3],
    });
    if (!res.canceled) {
      setter(res.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!plate || !model || !color) {
      return Alert.alert("Error", "Please fill all car details");
    }

    setLoading(true);
    
    const carData = { 
      plateNumber: plate.toUpperCase().replace(/\s/g, ''), 
      model, 
      color,
      carImageURL: carUri
    };

    let result;
    
    if (isEdit && existingCar) {
      // Update existing car
      result = await updateCar(`${existingCar.userId}_${existingCar.plateNumber}`, carData, carUri);
    } else {
      // Add new car
      result = await addCar(carData, carUri);
    }

    if (result.success) {
      Alert.alert("Success", isEdit ? "Car updated successfully!" : "Car registered successfully!");
      router.back();
    } else {
      Alert.alert("Error", result.error);
    }
    
    setLoading(false);
  };

  return (
    <View className="flex-1 bg-white">
      <Header 
        title={isEdit ? "Edit Car" : "Add Car"} 
        subtitle={isEdit ? "Update vehicle information" : "Register new vehicle"} 
      />

      <Text className="text-[#4B5563] font-bold text-2xl m-4">
        Car details
      </Text>

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
            title={isEdit ? "Update" : "Submit"} 
            onPress={handleSubmit} 
            loading={loading}
          />
        </View>
      </ScrollView>
    </View>
  );
}