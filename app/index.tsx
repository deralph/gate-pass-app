// app/onboarding.tsx
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import PrimaryButton from "../components/Button";
import AuthHeader from "../components/AuthHeader";


export default function OnboardingScreen() {
  const router = useRouter();
return (
  <View
    className="flex-1 bg-primary"
  >
    <View className="flex-1 justify-center">
      <AuthHeader
        title="AAUA"
        subtitle="Vehicle access conrol system"
        showLogo
        onboard
      />

      <View className="mt-8 mx-6 bg-white rounded-2xl p-6">
        


        <View className="mt-6">
           <Text className="text-[#4B5563] text-center font-black text-2xl my-4">Get started!</Text>
        <Text className="text-[#4B5563] text-center font-base mb-6"> Register and manage your vehicles with ease. Sign in to access AAUA securely anytime </Text>
       
          <PrimaryButton
            title="Login →"
            onPress={()=>router.push('/sign-in')}
            // loading={loading}
          />
          <PrimaryButton
            title="Create account →"
            onPress={()=>router.push('/sign-up')}
            variant="secondary"
            className="mt-4"/>
        </View>

      </View>
    </View>
  </View>
);

}
