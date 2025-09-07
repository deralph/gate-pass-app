import { View, Text, Image } from "react-native";

type BarcodeCardProps = {
  imageUri?: string;
};

export default function BarcodeCard({ imageUri }: BarcodeCardProps) {
  return (
    <View className="bg-gray-200 rounded-2xl p-6 items-center mt-6 mx-6 ">
      <Image
        source={
          imageUri
            ? { uri: imageUri }
            : require("../assets/images/barcode.png") // fallback image
        }
        style={{ width: "100%", height: 300 }}
        resizeMode="contain"
      />
      <Text className="text-gray-500 text-base my-3 text-center">
        This barcode is linked to your account and vehicle
      </Text>
    </View>
  );
}
