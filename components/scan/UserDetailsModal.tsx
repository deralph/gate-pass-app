import { View, Text, Modal, Image, TouchableOpacity } from "react-native";

export default function UserDetailsModal({
  visible,
  data,
  onClose,
  onApprove,
  onReject,
}: {
  visible: boolean;
  data?: { time?: string; raw?: string; parsed?: { name?: string; vehicle?: string; plate?: string } | null } | null;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  const name = data?.parsed?.name ?? "Unknown driver";
  const vehicle = data?.parsed?.vehicle ?? "Unknown vehicle";
  const plate = data?.parsed?.plate ?? data?.raw ?? "Unknown barcode";
  const time = data?.time ?? "-";

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/70 justify-center items-center px-6">
        <View className="bg-white rounded-2xl p-5 w-full">
          <Text className="font-poppins600 text-lg text-gray-800 mb-3">Driver Details</Text>

          <View className="flex-row space-x-4 items-center">
            <Image source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }} className="w-16 h-16 rounded-full" />
            <View>
              <Text className="font-poppins600 text-gray-800">{name}</Text>
              <Text className="font-poppins400 text-gray-500 text-sm">{vehicle}</Text>
              <Text className="font-poppins400 text-gray-500 text-sm">Plate: {plate}</Text>
            </View>
          </View>

          <Image source={{ uri: "https://via.placeholder.com/350x120.png?text=Car" }} className="w-full h-28 rounded-xl mt-4" />

          <View className="mt-3 p-3 rounded-md bg-gray-50 border border-gray-200">
            <Text className="text-gray-600 text-sm">Scan time: {time}</Text>
            <Text className="text-gray-600 text-sm">Barcode: {plate}</Text>
          </View>

          <View className="flex-row justify-between mt-5">
            <TouchableOpacity onPress={onReject} className="bg-red-600 px-5 py-3 rounded-xl flex-1 mr-2">
              <Text className="text-white font-poppins600 text-center">Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onApprove} className="bg-green-600 px-5 py-3 rounded-xl flex-1 ml-2">
              <Text className="text-white font-poppins600 text-center">Approve</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={onClose} className="mt-4 items-center">
            <Text className="text-gray-500 font-poppins400">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
