import { StyleSheet, Alert, Text, Platform, ActivityIndicator, FlatList, View, Image, ImageBackground, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRouter } from "expo-router";
import images from '../constants/images';
import { useEffect, useState } from "react";
import * as Location from 'expo-location';
import { request, PERMISSIONS } from 'react-native-permissions';
import axios from 'axios';
import { GOOGLE_PLACES_API } from "@env";

const Home = () => {
  const [location, setLocation] = useState(null);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const GOOGLE_PLACES_API_KEY = GOOGLE_PLACES_API;

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

  const getNearbyStores = async (latitude, longitude) => {
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
  }, []);

  useEffect(() => {
    if (location) {
      getNearbyStores(location.latitude, location.longitude);
    }
  }, [location]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', padding: 16 }}>
      {/* Header */}
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>Nearby Tea Shops 🍵</Text>

      {/* Button to navigate to Weekly Calendar */}
      <View style={{ marginBottom: 10 }}>
        <Button
          title="View Weekly Calendar"
          onPress={() => navigation.navigate('events')}
        />
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" color="#00cc99" />
        </View>
      ) : (
        <FlatList
          data={shops}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => {
            const photoRef = item.photos?.[0]?.photo_reference;
            const imageUrl = photoRef
              ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRef}&key=${GOOGLE_PLACES_API_KEY}`
              : "https://via.placeholder.com/400";

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
    height: 150,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
    justifyContent: "flex-end",
  },
  image: {
    borderRadius: 10,
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
});

export default Home;
