import { TextInput, TextInputProps } from "react-native";

export default function InputField(props: TextInputProps) {
  return (
    <TextInput
      className="border border-inputBorder rounded-xl px-4 py-3 font-poppins400"
      placeholderTextColor="#9CA3AF"
      {...props}
    />
  );
}
