import { StyleSheet, Alert, Text, Platform, ActivityIndicator, FlatList, View, Image, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import images from '../constants/images';
import { useEffect, useState } from "react";
import * as Location from 'expo-location';
import { request, PERMISSIONS } from 'react-native-permissions';
import axios from 'axios';

const Home = () => {

  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);

  const GOOGLE_PLACES_API_KEY = 'AIzaSyDofVaIFtuj6P4yEubwRKikC3j9DPMWHF4'

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
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" color="#00cc99" />
        </View>
      ) : (
        <FlatList
          data={shops}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => {
            // Extract first photo reference (if available)
            const photoRef = item.photos?.[0]?.photo_reference;
            const imageUrl = photoRef
              ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRef}&key=${GOOGLE_PLACES_API_KEY}`
              : "https://via.placeholder.com/400"; // Fallback image if no photo is available

            return (
              <ImageBackground source={{ uri: imageUrl }} style={styles.itemContainer} imageStyle={styles.image}>
                <View style={styles.overlay}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.address}>{item.vicinity}</Text>
                  <Text style={styles.rating}>Rating: ⭐ {item.rating || 'N/A'}</Text>
                </View>
              </ImageBackground>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    height: 150, // Adjust height for better appearance
    borderRadius: 10,
    overflow: "hidden", // Ensures rounded corners apply to the image
    marginBottom: 10,
    justifyContent: "flex-end",
  },
  image: {
    borderRadius: 10, // Ensures the image itself has rounded corners
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black overlay for text readability
    padding: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  address: {
    color: "#ddd",
  },
  rating: {
    marginTop: 4,
    fontSize: 14,
    color: "white",
  },
})


export default Home;