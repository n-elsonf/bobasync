import { Stack } from "expo-router";
import Login from "./login";
import Home from "./home";
import RegisterScreen from "./register";

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
    <Stack.Screen name="index" options={{ title: 'Index' }} />
    <Stack.Screen name="register" options={{ title: 'Register' }} />
    <Stack.Screen name="login" options={{ title: 'Sign in' }} />
    <Stack.Screen name="home" options={{ title: 'Home' }} />
  </Stack>;
  // return <RegisterScreen />;
}
