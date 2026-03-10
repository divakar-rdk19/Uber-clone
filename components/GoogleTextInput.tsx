import { GoogleInputProps } from "@/types/type";
import { View, Text } from "react-native";

export default function GoogleTextInput({
  icon,
  initialLocation,
  containerStyle,
  textInputBackgroundColor,
  handlePress,
}: GoogleInputProps) {
  return (
    <View className={`flex flex-row items-center justify-center relative z-50 rounded-xl ${containerStyle} mb-5 p-3`}>
      <Text>Search</Text>
    </View>
  );
}