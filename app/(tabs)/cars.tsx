import { ScrollView, View } from "react-native";
import Header from "../../components/Header";
import CarCard from "../../components/car/CarCard";
import ActionButton from "../../components/car/ActionButton";
import {useRouter} from 'expo-router'

export default function Cars() {
  const router = useRouter()
  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <Header title="My Cars" subtitle="Manage your registered vehicles" />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Car List */}
        <CarCard
          model="Lexus RX 350"
          plate="DEF-123-LAG"
          color="Black"
          carColorIcon={require("../../assets/images/lexus.webp")}
        />
        <CarCard
          model="Toyota Camry"
          plate="LMN-789-LAG"
          color="Blue"
          carColorIcon={require("../../assets/images/lexus.webp")}
        />

        {/* Action Buttons */}
        <View className="mt-6">
          <ActionButton
            title="View full barcode"
            icon="qr-code-outline"
            color="#7C3AED"
            onPress={()=>router.push('/scan')}
          />
          <ActionButton
            title="Edit vehicle info"
            icon="pencil-sharp"
            color="#111827"
            onPress={()=>router.push('/(home)/add-car')}
            />
          <ActionButton
            title="Add vehicle"
            icon="add-circle-outline"
            color="blue"
            onPress={()=>router.push('/(home)/add-car')}
          />
          <ActionButton
            title="Regenerate QR-Code"
            icon="refresh-sharp"
            color="#10B981"
            onPress={()=>router.push('/scan')}
          />
        </View>
      </ScrollView>
    </View>
  );
}
