import { View, Text, Image } from "react-native";

type Props = {
  title: string;
  subtitle?: string;
  showLogo?: boolean;
  onboard?:boolean
};

export default function AuthHeader({ title, subtitle, showLogo,onboard }: Props) {
  return (
    <View className="items-center mt-12">
      {showLogo && (
        <Image
          source={require("../assets/images/aaua_logo2.png")}
          style={{ width: 72, height: 90, marginBottom: 10 }}
        />
      )}
      <Text className={`text-white text-3xl font-poppins700 ${onboard?"font-black":''}`}>{title}</Text>
      {subtitle && (
        <Text className="text-white text-base mt-1 font-poppins400">{subtitle}</Text>
      )}
    </View>
  );
}
