import { useState } from "react";
import { View, Text, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { useRouter } from "expo-router";
import AuthHeader from "../components/AuthHeader";
import InputField from "../components/Input";
import PrimaryButton from "../components/Button";
import { auth } from "../config/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReset = async () => {
    if (!email) return Alert.alert("Error", "Enter your email");
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      Alert.alert("Check your email", "Password reset link sent.");
      router.back();
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
  <KeyboardAvoidingView
    className="flex-1 bg-primary"
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    keyboardVerticalOffset={64} // adjust if content is still too high
  >
    <View className="flex-1 justify-center">
      <AuthHeader
        title="Forgot password"
        subtitle="Enter the email linked to your account"
        showLogo
      />

      <View className="mt-8 mx-6 bg-white rounded-2xl p-6">
        <Text className="text-[#4B5563] font-bold text-base my-4">Reset Password</Text>
        <Text className="text-[#4B5563] font-sm mb-6"> Enter the email linked with your account and you will recieve an email with instructions to reset your paasword.</Text>
        <InputField
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <View className="mt-6">
          <PrimaryButton title="Send email"
          //  onPress={handleReset}
           onPress={()=>router.push('/email-sent')}
            loading={loading} />
        </View>
      </View>
      </View>
    </KeyboardAvoidingView>
  );
}
