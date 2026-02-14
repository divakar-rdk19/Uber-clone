import CustomButton from "@/components/CustomButton";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const user = useUser();
  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <SignedIn>
        <Text>Hello user</Text>
      </SignedIn>
    </SafeAreaView>
  );
}
