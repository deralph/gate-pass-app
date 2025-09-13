import { useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { Link, useRouter } from "expo-router";
import UploadImage from "../components/UploadImage";
import InputField from "../components/Input";
import PrimaryButton from "../components/Button";
import * as ImagePicker from "expo-image-picker";
import Checkbox from "expo-checkbox"; 
import { signUpUser } from "../services/authService";

export default function SignUp() {
  const router = useRouter();
  const [profileUri, setProfileUri] = useState<string | null>(null);
  const [carUri, setCarUri] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [matric, setMatric] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [plate, setPlate] = useState("");
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleCreate = async () => {
    if (!fullName || !matric || !email || !password || !plate || !model || !color) {
      return Alert.alert("Error", "Please fill all required fields");
    }
    
    if (!agree) {
      return Alert.alert("Error", "You must agree to the terms first");
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Alert.alert("Error", "Please enter a valid email address");
    }

    // Basic plate number validation (customize as needed)
    const plateRegex = /^[A-Z0-9]{3,10}$/i;
    if (!plateRegex.test(plate.replace(/\s/g, ''))) {
      return Alert.alert("Error", "Please enter a valid plate number");
    }

    setLoading(true);
    try {
      const userData = {
        fullName,
        matric,
        phoneNumber: "", // Add phone number field if needed
        role: "student"
      };
      
      const carData = {
        plateNumber: plate.toUpperCase().replace(/\s/g, ''),
        model,
        color
      };
      
      const result = await signUpUser(
        email.trim(), 
        password, 
        userData, 
        carData, 
        profileUri, 
        carUri
      );
      
      if (result.success) {
        // Store token (you might want to use SecureStore or AsyncStorage)
        if (result.token) {
          console.log("Signup successful, token:", result.token);
        }
        console.log("result = ",result)
        Alert.alert("Success", "Account created successfully");
        
        // Navigate to account created screen with QR code data
  router.push({
    pathname: "/account-created",
    params: { 
      qrCodeUrl: result.qrCodeUrl,
      fullName: result.user.fullName,
      plateNumber: result.car.plateNumber,
      model: result.car.model,
      color: result.car.color
    }
  });
      } else {
        Alert.alert("Signup failed", result.message || "An error occurred during signup");
      }
    } catch (err: any) {
      console.log("Signup failed", err.message, "error = ",err);
      Alert.alert("Signup failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="bg-primary px-6 pt-12 pb-8">
        <Text className="text-white text-2xl font-poppins700">Create Account</Text>
        <Text className="text-white mt-1 font-poppins400">
          Join AAUA vehicle access control system
        </Text>
      </View>

      <View className="items-center mt-6">
        <UploadImage uri={profileUri} onPick={() => pickImage(setProfileUri)} circle />
        <Text className="text-gray-500 text-center mt-2 font-poppins600">Upload profile picture</Text>
      </View>

      <View className="px-6 mt-6">
        <InputField placeholder="Full name" value={fullName} onChangeText={setFullName} />
        <View className="mt-4" />
        <InputField 
          placeholder="Matric number/Staff ID" 
          value={matric} 
          onChangeText={setMatric} 
        />
        <View className="mt-4" />
        <InputField 
          placeholder="Email" 
          value={email} 
          onChangeText={setEmail} 
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <View className="mt-4" />
        <InputField 
          placeholder="Password" 
          value={password} 
          onChangeText={setPassword} 
          secureTextEntry 
        />

        <Text className="text-gray-700 mt-6 font-poppins600">Car details</Text>
        <View className="mt-3" />
        <InputField 
          placeholder="Plate number" 
          value={plate} 
          onChangeText={setPlate} 
        />
        <View className="mt-3" />
        <InputField 
          placeholder="Car model" 
          value={model} 
          onChangeText={setModel} 
        />
        <View className="mt-3" />
        <InputField 
          placeholder="Color" 
          value={color} 
          onChangeText={setColor} 
        />

        <View className="mt-4">
          <UploadImage uri={carUri} onPick={() => pickImage(setCarUri)} label="Upload car picture" />
        </View>
        
        <View className="flex-row items-center mt-4">
          <Checkbox
            value={agree}
            onValueChange={setAgree}
            color={agree ? "#2563EB" : undefined}
            style={{ marginRight: 8, borderRadius: 4, width: 20, height: 20 }}
          />
          <Text className="text-gray-700 font-poppins400 flex-shrink">
            I agree to the{" "}
            <Text className="text-primary font-poppins600">Terms & Services</Text> and{" "}
            <Text className="text-primary font-poppins600">Privacy Policy</Text>
          </Text>
        </View>

        <View className="mt-6">
          <PrimaryButton 
            title="Create Account"
            onPress={handleCreate}
            loading={loading} 
          />
        </View>

        <View className="mt-4 items-center pb-8">
          <Link href="/sign-in">
            <Text className="text-primary font-poppins400">
              Already have an account? <Text className="text-gray-500">Sign In</Text>
            </Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}