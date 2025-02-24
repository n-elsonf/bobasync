import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppRegistry, SafeAreaView, Text, View } from "react-native";
import '../global.css'
import Login from "./screens/login";
import { ExpoRoot } from "expo-router";
import { AuthProvider } from './context/AuthContext';
import InfiniteScrollCalendar from "./screens/events";



const Stack = createNativeStackNavigator();


export default function App() {
  return (
    // <Login />
    // <Events /
    // 
    <AuthProvider>
      <ExpoRoot context={require.context('./screens')} />
      {/* <InfiniteScrollCalendar /> */}
    </AuthProvider>

  )
}

// registerRootComponent(App)
AppRegistry.registerComponent("main", () => App);