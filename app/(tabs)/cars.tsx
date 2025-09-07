import { ScrollView, View } from "react-native";
import Header from "../../components/Header";
import CarCard from "../../components/car/CarCard";
import ActionButton from "../../components/car/ActionButton";

export default function Cars() {
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
            onPress={() => console.log("View full barcode")}
          />
          <ActionButton
            title="Edit vehicle info"
            icon="pencil-sharp"
            color="#111827"
            onPress={() => console.log("Edit car")}
          />
          <ActionButton
            title="Remove vehicle"
            icon="trash-outline"
            color="#EF4444"
            onPress={() => console.log("Remove car")}
          />
          <ActionButton
            title="Regenerate QR-Code"
            icon="refresh-sharp"
            color="#10B981"
            onPress={() => console.log("Regenerate QR")}
          />
        </View>
      </ScrollView>
    </View>
  );
}
