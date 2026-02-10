import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { useFonts } from "expo-font";
import "./global.css";

export default function RootLayout() {
  const [loaded] = useFonts({
    "Jakarta-Bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "Jakarta-ExtraBold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    "Jakarta-ExtraLight": require("../assets/fonts/PlusJakartaSans-ExtraLight.ttf"),
    "Jakarta-Light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
    "Jakarta-Medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "Jakarta-Regular": require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "Jakarta-SemiBold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
  });
  return (
    <>
      <StatusBar hidden={true} />
      <Stack>
        <Stack.Screen name="(root)/(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{headerShown: false}} />
      </Stack>
    </>
  );
}

