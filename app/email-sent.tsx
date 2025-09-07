// app/onboarding.tsx
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import PrimaryButton from "../components/Button";
import AuthHeader from "../components/AuthHeader";


export default function EmailSent() {
  const router = useRouter();
return (
  <View
    className="flex-1 bg-primary"
  >
    <View className="flex-1 justify-center">
      <AuthHeader
        title="Welcome back"
        subtitle="Login to access your account"
        showLogo
      />

      <View className="mt-8 mx-6 bg-white rounded-2xl p-6">
        


        <View className="mt-6 ">
        <View className="flex items-center">

<Image
          source={require("../assets/images/Success-icon.png")}
          style={{ width: 90, height: 90, marginBottom: 10,marginTop:10}}
        />
</View>
           <Text className="text-[#4B5563] text-center font-black text-2xl my-4">Email sent!</Text>
        <Text className="text-[#4B5563] text-center font-base mb-6"> We have sent a password reset instructions to your email</Text>
       
          <PrimaryButton
            title="Open email app"
            onPress={()=>router.push('/sign-in')}
          />
        </View>

      </View>
    </View>
  </View>
);

}
