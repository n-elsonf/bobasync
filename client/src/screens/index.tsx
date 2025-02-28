import { Text, TouchableOpacity, View, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as Google from "expo-auth-session/providers/google";
import images from '../constants/images';
import React from "react";
import { GOOGLE_IOS_ID, GOOGLE_WEB_ID } from "@env"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";

export default function Index() {
  const router = useRouter();
  const handleLogin = () => router.push("./login");
  const handleRegister = () => router.push("./register");


  const { setAccessToken } = useAuth();

  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_ID,
    iosClientId: GOOGLE_IOS_ID,
    offlineAccess: true,
  });

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      // If we get here, it means the user successfully completed the sign-in
      // Only then proceed to get tokens and send to backend
      const tokens = await GoogleSignin.getTokens();
      setAccessToken(tokens.accessToken);
      sendTokenToBackend(tokens.idToken);
    } catch (error: any) {
      // Check for specific error types
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("User cancelled the sign-in flow");
        // Don't proceed further - explicit early return
        return;
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("Another sign-in operation is in progress");
        return;
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert("Error", "Play services not available or outdated");
        return;
      } else {
        console.error("Google sign-in error:", error);
        Alert.alert("Sign-In Error", "Failed to sign in with Google");
      }
    }
  };

  const sendTokenToBackend = async (token: string) => {
    try {
      console.log("Sending token to backend:", token);

      const res = await api.post("/auth/google", { token });

      console.log("Backend response:", res.data);

      const { user, token: idToken } = res.data;
      if (!user) {
        throw new Error("User missing in backend response.");
      }

      await AsyncStorage.setItem("authToken", idToken);
      Alert.alert("Success", `Welcome ${user.name}!`);
      router.push('./home');
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      Alert.alert(
        "Google Login Failed",
        error.response?.data?.message || "Something went wrong."
      );
    }
  };

  return (
    <SafeAreaView className="bg-white h-full border-solid">
      <Image source={images.logo} className="w-full h-4/6 bg-white" resizeMode="contain" />
      <View className="top-[-90] items-center flex-1 px-10">
        <Text className="text-5xl text-center uppercase font-extrabold">TSync</Text>
        <Text className="text-1xl font-bold text-center">A scheduling app for all your coffee chats.</Text>

        {/* Sign in with Email */}
        <TouchableOpacity onPress={handleLogin} className='top-20 bg-white shadow-md shadow-zinc-300 rounded-full w-3/4 py-4'>
          <View className='flex flex-row items-center justify-center'>
            <Text>Sign In 🧋</Text>
          </View>
        </TouchableOpacity>

        {/* Register Button */}
        <TouchableOpacity onPress={handleRegister} className='mt-4 top-20 bg-white shadow-md shadow-zinc-300 rounded-full w-3/4 py-4'>
          <View className='flex flex-row items-center justify-center'>
            <Text>Create Account 🧋</Text>
          </View>
        </TouchableOpacity>

        {/* Google Sign-In Button */}
        <TouchableOpacity
          onPress={signInWithGoogle}
          className="mt-6 top-20 bg-white shadow-md shadow-zinc-300 rounded-full w-3/4 py-4 flex flex-row items-center justify-center"
        >
          <Image
            source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" }}
            style={{ width: 24, height: 24, marginRight: 10 }}
          />
          <Text>Sign in with Google</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
