import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./src/screens/login";
import { AppRegistry, Text, View } from "react-native";
import './global.css'

const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <Login />
  )
}

AppRegistry.registerComponent("main", () => App);
