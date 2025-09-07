import { TouchableOpacity, Image, Text } from "react-native";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

type Props = {
  uri?: string | null;
  onPick: () => void;
  label?: string;
  circle?: boolean;
};

export default function UploadImage({ uri, onPick, label, circle }: Props) {
  return (
    <TouchableOpacity
      onPress={onPick}
      className={`${
        circle ? "w-24 h-24 rounded-full bg-gray-200  items-center" : "w-full h-12 rounded-xl border border-dashed"
      } justify-center `}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={{
            width: circle ? 96 : "100%",
            height: circle ? 96 : "100%",
            borderRadius: circle ? 48 : 12,
          }}
        />
      ) : (
        <Text className={` ${circle? "": "mx-4"} text-gray-400`}><FontAwesome6 name="camera" size={24} color="black" /> {label}</Text>
      )}
    </TouchableOpacity>
  );
}
