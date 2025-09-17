import { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AuthHeader from "../components/AuthHeader";
import InputField from "../components/Input";
import PrimaryButton from "../components/Button";
import { forgotPassword } from "../services/authService"; // Import our new service

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReset = async () => {
    if (!email) return Alert.alert("Error", "Enter your email");

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Alert.alert("Error", "Please enter a valid email address");
    }

    setLoading(true);
    try {
      const result = await forgotPassword(email.trim());

      if (result.success) {
        Alert.alert("Check your email", "Password reset link sent.");
        router.push("/email-sent");
      } else {
        Alert.alert("Error", result.message || "Failed to send reset email");
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
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
            Enter the email linked with your account and you will receive an
            email with instructions to reset your password.
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
