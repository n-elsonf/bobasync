import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppRegistry, SafeAreaView, Text, View } from "react-native";
import '../global.css'
import Login from "./screens/login";
import { ExpoRoot } from "expo-router";

const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <ExpoRoot context={require.context('./screens')} />
  )
}

AppRegistry.registerComponent("main", () => App);
