import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppRegistry, SafeAreaView, Text, View } from "react-native";
import '../global.css'
import Login from "./screens/login";
import { ExpoRoot } from "expo-router";
import Index from "./app/index";
import { registerRootComponent } from 'expo';
import Schedule from "./screens/calendar";


const Stack = createNativeStackNavigator();


export default function App() {
  return (
    // <Login />
    <Schedule />
    // <ExpoRoot context={require.context('./screens')} />
  )
}

// registerRootComponent(App)
AppRegistry.registerComponent("main", () => App);