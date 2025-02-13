import React, { useState } from "react";
import { View, TextInput, Button, Alert, Text } from "react-native";
import { api } from "../utils/api"; // Import Axios instance
import AsyncStorage from "@react-native-async-storage/async-storage";

const RegisterScreen = ({ navigation }: any) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const apiUrl = "http://localhost:5000/api/v1/auth/register";

    const userData = {
      name: fullName,
      email,
      password,
    };

    console.log("📤 Sending Data to:", apiUrl);
    console.log("📤 Request Body:", JSON.stringify(userData, null, 2));

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // ✅ Ensures JSON is sent
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      console.log("✅ Response from Backend:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to register");
      }

      Alert.alert("Success", "Account created successfully!");
      navigation.navigate("Home");
    } catch (error) {
      console.error("❌ Registration error:", error);
      Alert.alert("Registration Failed", error.message || "Something went wrong.");
    }
  };




  return (
    <View style={{ padding: 20, flex: 1, justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>Create an Account</Text>

      <TextInput
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
        autoCapitalize="none"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 }}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 }}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 }}
      />

      <Button title={loading ? "Registering..." : "Register"} onPress={handleRegister} disabled={loading} />
    </View>
  );
};

export default RegisterScreen;
