import { View, Text, Image,TouchableOpacity } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { Ionicons } from "@expo/vector-icons";

export default function CarCard({
  model,
  plate,
  color,
  status = "Active",
  carColorIcon,
}: {
  model: string;
  plate: string;
  color: string;
  status?: string;
  carColorIcon: any; // image/icon for the car
}) {
  return (
    <View className="flex-row justify-between items-center bg-white rounded-2xl border border-gray-200 p-4 mb-3">
      {/* Left: Car Info */}
      <View className="flex-row items-center space-x-3">
        <Image source={carColorIcon} className="w-20 h-20 mr-6" resizeMode="contain" />
        <View >
          <Text className="text-gray-800 text-xl font-bold font-poppins600">{model}</Text>
          <Text className="text-gray-500 text-base font-poppins500">{plate}</Text>
          <Text className="text-gray-500 text-sm font-bold font-poppins400">{color}</Text>
          <TouchableOpacity onPress={()=>{}} className=" flex-row items-center border-2 border-red-200 p-4 rounded-md mt-6">
             <Ionicons name="trash-outline" size={18} color="#EF4444" />
          <Text className="text-red-900 text-base font-bold font-poppins400 ml-6">Remove</Text>

        </TouchableOpacity>
        </View>
      </View>

      {/* Right: QR Code + Status */}
      <View className="items-center">
        <QRCode value={plate} size={60} />
        <View className="mt-2 px-3 py-1 border border-gray-100 rounded-full">
          <Text className="text-xs text-gray-600 font-poppins500">{status}</Text>
        </View>
      </View>
    </View>
  );
}
