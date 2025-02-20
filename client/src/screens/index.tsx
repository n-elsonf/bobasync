import { Text, TouchableOpacity, View, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import images from '../constants/images';
import React, { useEffect } from "react";
import * as AuthSession from "expo-auth-session";
import { GOOGLE_IOS_ID } from "@env"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../utils/api";


WebBrowser.maybeCompleteAuthSession();

export default function Index() {
  const router = useRouter();
  const handleLogin = () => router.push('/login');
  const handleRegister = () => router.push('/register');

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: GOOGLE_IOS_ID,
    scopes: ["profile", "email"],
  });

  const handleToken = () => {
    if (response?.type === "success") {
      const { authentication } = response;
      const token: string | undefined = authentication?.idToken;

      if (!token) {
        console.error("Error: idToken is missing.");
        return;
      }

      console.log("Token extracted:", token);
      sendTokenToBackend(token); // Now guaranteed to be a string
    }
  }

  const sendTokenToBackend = async (token: string) => {
    try {
      console.log("Sending token to backend:", token);

      const res = await api.post("/auth/google", { token });

      console.log("Backend response:", res.data);

      const { authToken, user } = res.data;
      if (!authToken) {
        throw new Error("Token missing in backend response.");
      }

      await AsyncStorage.setItem("authToken", authToken);
      Alert.alert("Success", `Welcome ${user.name}!`);
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      Alert.alert(
        "Google Login Failed",
        error.response?.data?.message || "Something went wrong."
      );
    }
  };


  useEffect(() => {
    handleToken();
  }, [response]);
  return (
    <SafeAreaView className="bg-white h-full border-solid">
      <Image source={images.logo} className="w-full h-4/6 bg-white" resizeMode="contain" />
      <View className="top-[-90] items-center flex-1 px-10">
        <Text className="text-5xl text-center uppercase font-extrabold">BobaSync</Text>
        <Text className="text2xl font-bold text-center">A scheduling app for all your boba meets.</Text>

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
          onPress={() => promptAsync()}
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
