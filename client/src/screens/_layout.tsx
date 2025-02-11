import { Stack } from "expo-router";
import Login from "./login";
import Home from "./home";

export default function RootLayout() {
  // return <Stack screenOptions={{ headerShown: false }}>
  //   <Stack.Screen name="index" options={{ title: 'Home' }} />
  //   <Stack.Screen name="login" options={{ title: 'Sign in' }} />
  // </Stack>;
  return <Home />;
}
