import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppRegistry, SafeAreaView, Text, View } from "react-native";
import '../global.css'
import Login from "./screens/login";
import { ExpoRoot } from "expo-router";
import { AuthProvider } from './context/AuthContext';



const Stack = createNativeStackNavigator();


export default function App() {
  return (
    // <Login />
    // <Events /
    // 
    <AuthProvider>
      <ExpoRoot context={require.context('./screens')} />
    </AuthProvider>

  )
}

// registerRootComponent(App)
AppRegistry.registerComponent("main", () => App);