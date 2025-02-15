import { Text, TouchableOpacity, View, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import images from '../constants/images';
import React, { useEffect } from "react";

export default function Index() {
  const router = useRouter();
  const handleLogin = () => router.push('/login');
  const handleRegister = () => router.push('/register');


  // ✅ Initialize Google Sign-In
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "593428119578-4vuqf5o9ubh709taol0482nbgc8v1vj4.apps.googleusercontent.com", // 🔹 Get this from Google Cloud Console
      offlineAccess: true,
    });
  }, []);

  // ✅ Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log("✅ Google Sign-In Success:", userInfo);

      // Extract the ID token and send it to the backend
      const { idToken }: any = userInfo;
      if (idToken) {
        await sendTokenToBackend(idToken);
      }
    } catch (error: any) {
      console.error("❌ Google Sign-In Error:", error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert("Sign-In Cancelled");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert("Sign-In in Progress");
      } else {
        Alert.alert("Google Sign-In Failed");
      }
    }
  };

  // ✅ Send the Google ID Token to Backend
  const sendTokenToBackend = async (idToken: any) => {
    try {
      const response = await fetch("http://localhost:5000/api/v1/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();
      console.log("✅ Backend Response:", data);

      if (response.ok) {
        Alert.alert("Success! Signed in with Google.");
        router.push("/home");
      } else {
        throw new Error(data.message || "Google authentication failed");
      }
    } catch (error) {
      console.error("❌ Error sending ID Token:", error);
      Alert.alert("Server Error", "Could not authenticate with Google.");
    }
  }

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
          onPress={handleGoogleSignIn}
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
