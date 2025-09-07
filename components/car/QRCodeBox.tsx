import { View, Text } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function QRCodeBox({ value }: { value: string }) {
  return (
    <View className="bg-gra-50 rounded-2xl border border-gray-200 p-6 items-center mt-4">
      <QRCode value={value} size={200} />
      <Text className="text-xs text-gray-500 font-poppins400 text-center mt-4">
        Present QR Code at AAUA senate building gate for scanning.
      </Text>
    </View>
  );
}
