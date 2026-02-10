import { Stack, Tabs } from "expo-router";

export default function _Layout() {
  return (
    // <Tabs
    //   screenOptions={{
    //     tabBarShowLabel: false,
    //     tabBarItemStyle: {
    //       width: "100%",
    //       height: "100%",
    //       justifyContent: "center",
    //       alignItems: "center",
    //     },
    //   }}
    // >
    //   <Tabs.Screen name="home" />
    //   <Tabs.Screen name="explore" />
    //   <Tabs.Screen name="profile" />
    //   <Tabs.Screen name="rides" />
    // </Tabs>
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="chat" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="rides" options={{ headerShown: false }} />
      <Stack.Screen name="explore" options={{ headerShown: false }} />
    </Stack>
  );
}
