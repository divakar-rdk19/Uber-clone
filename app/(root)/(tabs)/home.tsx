import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <Text>New Index</Text>
      <CustomButton title="Logout" onPress={() => router.replace("/(auth)/welcome")}/>
    </SafeAreaView>
  );
}
