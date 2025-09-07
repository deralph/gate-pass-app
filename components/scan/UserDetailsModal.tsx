import { View, Text, Modal, Image, TouchableOpacity } from "react-native";

export default function UserDetailsModal({
  visible,
  onClose,
  onApprove,
  onReject,
}: {
  visible: boolean;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/70 justify-center items-center px-6">
        <View className="bg-white rounded-2xl p-5 w-full">
          <Text className="font-poppins600 text-lg text-gray-800 mb-3">
            Driver Details
          </Text>

          {/* Example driver details */}
          <View className="flex-row space-x-4 items-center">
            <Image
              source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
              className="w-16 h-16 rounded-full"
            />
            <View>
              <Text className="font-poppins600 text-gray-800">Ralph Johnson</Text>
              <Text className="font-poppins400 text-gray-500 text-sm">
                Lexus RX 350 - DEF-123
              </Text>
              <Text className="font-poppins400 text-gray-500 text-sm">
                Colour: Black
              </Text>
            </View>
          </View>

          {/* Car picture */}
          <Image
            source={{ uri: "https://via.placeholder.com/150x80.png?text=Car" }}
            className="w-full h-28 rounded-xl mt-4"
          />

          {/* Buttons */}
          <View className="flex-row justify-between mt-5">
            <TouchableOpacity
              onPress={onReject}
              className="bg-red-500 px-5 py-3 rounded-xl flex-1 mr-2"
            >
              <Text className="text-white font-poppins600 text-center">
                Reject
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onApprove}
              className="bg-green-600 px-5 py-3 rounded-xl flex-1 ml-2"
            >
              <Text className="text-white font-poppins600 text-center">
                Approve
              </Text>
            </TouchableOpacity>
          </View>

          {/* Close button */}
          <TouchableOpacity
            onPress={onClose}
            className="mt-4 items-center"
          >
            <Text className="text-gray-500 font-poppins400">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
