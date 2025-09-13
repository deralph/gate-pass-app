import { useState } from "react";
import { View, TouchableOpacity, Text, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { Link, useRouter } from "expo-router";
import AuthHeader from "../components/AuthHeader";
import InputField from "../components/Input";
import PrimaryButton from "../components/Button";
import { signInAdmin } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";

export default function SignIn() {
  const router = useRouter();
  const { login } = useAuth();
  const [adminID, setAdminID] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!adminID || !password) return Alert.alert("Error", "Fill all fields");
    
    setLoading(true);
    try {
      const result = await signInAdmin(adminID.trim(), password);
      
      if (result.success) {
        // Store admin token and info
        await login(result.token, result.admin);
        router.replace("/(admin)");
      } else {
        Alert.alert("Login failed", result.message);
      }
    } catch (err: any) {
      Alert.alert("Login failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-admin"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={64}
    >
      <View className="flex-1 justify-center">
        <AuthHeader
          title="Admin Control"
          subtitle="Vehicle access control system"
          showLogo
          onboard
        />

        <View className="mt-8 mx-6 border border-gray-100 rounded-2xl p-6">
          <Text className="text-white text-center font-black text-2xl my-4">Welcome back!</Text>
          <Text className="text-white text-center font-base mb-6"> Login to access your account</Text>
        
          <InputField
            placeholder="Enter your Admin ID"
            value={adminID}
            onChangeText={setAdminID}
            autoCapitalize="none"
          />
          <View className="mt-4" />
          <InputField
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {/* <TouchableOpacity
            className="mt-3 items-end"
            onPress={() => router.push("/forgot-password")}
          >
            <Text className="text-errorRed font-poppins400">
              Forgot password?
            </Text>
          </TouchableOpacity> */}

          <View className="mt-6">
            <PrimaryButton
              title="Login "
              // onPress={handleLogin}
              onPress={()=>router.push('/(admin)')}
              loading={loading}
              className="bg-[#34A75E]" 
              admin
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}