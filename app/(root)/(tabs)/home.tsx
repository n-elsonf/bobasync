import { Alert, Text, Platform, ActivityIndicator, FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import images from '@/constants/images';
import { useEffect, useState } from "react";
import * as Location from 'expo-location';
import { request, PERMISSIONS } from 'react-native-permissions';
import axios from 'axios';

const Home = () => {

  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);

  const GOOGLE_PLACES_API_KEY = 'AIzaSyBL5Mu83v8hvBbSSPkcOdI0vBNWqDICdoA'

  const getUserLocation = async () => {

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission denied", 'Allow location access to find nearby stores!');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    console.log(location.coords.latitude, location.coords.longitude);
    setLocation(location.coords);
    return location.coords;
  };

  const getNearbyStores = async (latitude: any, longitude: any) => {
    setLoading(true);
    const radius = 5000;
    const type = 'cafe';

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&keyword=tea&key=${GOOGLE_PLACES_API_KEY}`;

    try {
      const response = await axios.get(url);
      setShops(response.data.results);
      console.log(response.data.results); // List of tea shops
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }

  };

  useEffect(() => {
    getUserLocation();
  }, [])

  useEffect(() => {
    if (location) {
      getNearbyStores(location.latitude, location.longitude);
    }
  }, [location]); // Runs when location updates

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>Nearby Tea Shops 🍵</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#00cc99" />
      ) : (
        <FlatList
          data={shops}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <View style={{ padding: 10, marginBottom: 10, borderWidth: 1, borderRadius: 10 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
              <Text>{item.vicinity}</Text>
              <Text>Rating: ⭐ {item.rating || 'N/A'}</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

export default Home;