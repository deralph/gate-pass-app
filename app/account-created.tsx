import { ScrollView,View } from "react-native";
import { useRouter } from "expo-router";
import HeaderSuccess from "../components/HeaderSuccess";
import BarcodeCard from "../components/BarCodeCard";
import InfoRow from "../components/InfoRow";
import PrimaryButton from "../components/Button";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';


export default function AccountCreatedScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-white ">
      <HeaderSuccess />

      {/* Pass QR code from parent (could be API, user data, etc.) */}
      <BarcodeCard imageUri="" />

      <InfoRow icon={<FontAwesome5 name="user-plus" size={20} color="blue" />} label="Profile: Wilson Babafemi" />
      <InfoRow icon={<FontAwesome5 name="car-alt" size={24} color="blue" />} label="Vehicle: Lexus RX 350 (ABC 123)" />
<View className="p-6 ">

      <PrimaryButton
        title="Continue to Dashboard"
        onPress={() => router.push("/(tabs)/(home)")}
        />
        </View>
    </ScrollView>
  );
}
