import { useState } from "react";
import { View, Text, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { useRouter } from "expo-router";
import AuthHeader from "../components/AuthHeader";
import InputField from "../components/Input";
import PrimaryButton from "../components/Button";
import { resetPassword } from "../services/authService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReset = async () => {
    if (!email) return Alert.alert("Error", "Enter your email");
    setLoading(true);
    
    const result = await resetPassword(email.trim());
    
    if (result.success) {
      Alert.alert("Check your email", "Password reset link sent.");
      router.back();
    } else {
      Alert.alert("Error", result.error);
    }
    
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-primary"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={64}
    >
      <View className="flex-1 justify-center">
        <AuthHeader
          title="Forgot password"
          subtitle="Enter the email linked to your account"
          showLogo
        />

        <View className="mt-8 mx-6 bg-white rounded-2xl p-6">
          <Text className="text-[#4B5563] font-bold text-base my-4">
            Reset Password
          </Text>
          <Text className="text-[#4B5563] text-sm mb-6">
            Enter the email linked with your account and you will receive an email with instructions to reset your password.
          </Text>
          
          <InputField
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <View className="mt-6">
            <PrimaryButton
              title="Send email"
              onPress={handleReset}
              loading={loading}
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}