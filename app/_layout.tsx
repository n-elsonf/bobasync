import { SplashScreen, Stack } from "expo-router";

import "./global.css";
import { useFonts } from "expo-font";
import { useEffect } from "react";

export default function RootLayout() {


  return (
    <Stack screenOptions={{ headerShown: false }} />
  )
}