import { Text, TouchableOpacity, View, Image, Alert, Button, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import images from '../constants/images';
import React, { useEffect, useState } from "react";
import * as AuthSession from "expo-auth-session";
import { GOOGLE_IOS_ID } from "@env"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../utils/api";
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export default function Events() {

  GoogleSignin.configure({
    iosClientId: GOOGLE_IOS_ID,
    scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    offlineAccess: true, // Enables refresh token
  });

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();

      // Store refresh token (securely)
      await AsyncStorage.setItem("refreshToken", tokens.refreshToken);

      return tokens.accessToken;
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };


  const fetchGoogleCalendarEvents = async (accessToken: any) => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=" +
        new Date().toISOString() +
        "&timeMax=" +
        new Date(new Date().setHours(23, 59, 59, 999)).toISOString() +
        "&singleEvents=true&orderBy=startTime",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const data = await response.json();
      return data.items; // List of events
    } catch (error) {
      console.error("Error fetching calendar events:", error);
    }
  };

  const [events, setEvents] = useState([]);
  const [accessToken, setAccessToken] = useState(null);

  const handleSignIn = async () => {
    const token = await signInWithGoogle();
    setAccessToken(token);
    const fetchedEvents = await fetchGoogleCalendarEvents(token);
    setEvents(fetchedEvents);
  };

  const refreshAccessToken = async () => {
    const refreshToken = await AsyncStorage.getItem("refreshToken");

    if (!refreshToken) return null;

    try {
      const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: "YOUR_CLIENT_ID",
          client_secret: "YOUR_CLIENT_SECRET",
          refresh_token: refreshToken,
          grant_type: "refresh_token",
        }).toString(),
      });

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error("Token refresh error:", error);
    }
  };

  const ensureValidAccessToken = async () => {
    let token = await AsyncStorage.getItem("accessToken");

    if (!token) {
      token = await refreshAccessToken();
      if (token) await AsyncStorage.setItem("accessToken", token);
    }

    return token;
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Sign in with Google" onPress={handleSignIn} />
      {events.length > 0 && (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ marginVertical: 10 }}>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.summary}</Text>
              <Text>{new Date(item.start.dateTime || item.start.date).toLocaleString()}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};
