import { Stack } from "expo-router";
import Login from "./login";
import Home from "./home";
import { Text, View } from "react-native";

export default function RootLayout() {
  // return <Stack screenOptions={{ headerShown: false }}>
  //   <Stack.Screen name="index" options={{ title: 'Home' }} />
  //   <Stack.Screen name="login" options={{ title: 'Sign in' }} />
  // </Stack>;
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "blue" }}>
      <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>Hello</Text>
    </View>
  );
}
