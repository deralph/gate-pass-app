import { View, Text } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function QRCodeBox({ value }: { value: string }) {
  return (
    <View className="bg-white rounded-2xl border border-gray-200 p-6 items-center mt-4">
      {value ? (
        <>
          <QRCode 
            value={value} 
            size={200} 
            backgroundColor="white"
            color="black"
          />
          <Text className="text-xs text-gray-500 font-poppins400 text-center mt-4">
            Present QR Code at AAUA senate building gate for scanning.
          </Text>
        </>
      ) : (
        <View className="h-48 justify-center items-center">
          <Text className="text-gray-400">No QR code data available</Text>
        </View>
      )}
    </View>
  );
}