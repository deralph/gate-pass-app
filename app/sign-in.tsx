import { useState } from "react";
import { View, TouchableOpacity, Text, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { Link, useRouter } from "expo-router";
import AuthHeader from "../components/AuthHeader";
import InputField from "../components/Input";
import PrimaryButton from "../components/Button";
import { auth } from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert("Error", "Fill all fields");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/home");
    } catch (err: any) {
      Alert.alert("Login failed", err.message);
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
        title="Welcome back"
        subtitle="Login to access your account"
        showLogo
      />

      <View className="mt-8 mx-6 bg-white rounded-2xl p-6">
        <InputField
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <View className="mt-4" />
        <InputField
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
<View className="flex-row justify-between mt-6">
        <TouchableOpacity
          className="mt-3 "
          onPress={() => router.push("/forgot-password")}
        >
          <Text className="text-errorRed font-poppins400">
            Forgot password?
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="mt-3 "
          onPress={() => router.push("/admin-login")}
        >
          <Text className="text-blue font-poppins400">
            Admin login
          </Text>
        </TouchableOpacity>
        </View>

        <View className="mt-6">
          <PrimaryButton
            title="Login →"
            // onPress={handleLogin}
            onPress={()=> router.push('/(tabs)')}
            loading={loading}
          />
        </View>

        <View className="mt-3 items-center">
          <Link href="/sign-up">
            <Text className="text-primary font-poppins400">
              Create an account
            </Text>
          </Link>
        </View>
      </View>
    </View>
  </KeyboardAvoidingView>
);

}
