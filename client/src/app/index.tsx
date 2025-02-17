import { Text, TouchableOpacity, View, Image, ActivityIndicator, Alert } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../utils/api";
import axios from "axios";
import { GOOGLE_WEB_ID } from '@env';

WebBrowser.maybeCompleteAuthSession();

export default function Index() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    webClientId: GOOGLE_WEB_ID,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const accessToken = response.params.id_token;
      console.log("Access Token", accessToken);
      sendTokenToBackend(accessToken);
    }
  }, [response]);

  const sendTokenToBackend = async (idToken: any) => {
    try {
      setGoogleLoading(true);
      const res = await api.post("/auth/google", { idToken });
      const { token, user } = res.data;

      await AsyncStorage.setItem("authToken", token);
      Alert.alert("Success", `Welcome ${user.name}!`);
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      Alert.alert(
        "Google Login Failed",
        error.response?.data?.message || "Something went wrong."
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white"
      }}>
        {userInfo ? (
          <View style={{ alignItems: "center" }}>
            <Image
              source={{ uri: userInfo.picture }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                marginBottom: 10
              }}
            />
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              {userInfo.name}
            </Text>
            <Text>{userInfo.email}</Text>
          </View>
        ) : (
          <>
            {loading ? (
              <ActivityIndicator size="large" color="blue" />
            ) : null}
            <TouchableOpacity
              onPress={() => promptAsync()}
              style={{
                backgroundColor: "white",
                padding: 10,
                borderRadius: 10,
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowRadius: 5
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={{
                    uri: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                  }}
                  style={{ width: 24, height: 24, marginRight: 10 }}
                />
                <Text>Sign in with Google</Text>
              </View>
            </TouchableOpacity>
          </>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}