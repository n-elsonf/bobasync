import React, { useEffect, useState } from 'react';
import { StyleSheet, Alert, Text, ActivityIndicator, FlatList, View, Image, ImageBackground, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from 'expo-location';
import axios from 'axios';
import { GOOGLE_PLACES_API } from '@env';
import { router, useLocalSearchParams } from 'expo-router';

type Place = {
  place_id: string;
  name: string;
  vicinity: string;
  rating?: number;
  photos?: { photo_reference: string }[];
};

export default function Index() {

  const params = useLocalSearchParams();
  const isSelectingTeaShop = params.selectingTeaShop === 'true';

  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleTeaShopPress = (teaShop: Place) => {
    if (isSelectingTeaShop) {
      // If we're in selection mode, navigate back to add-event with the selected shop
      router.push({
        pathname: './add-event',
        params: { teaShopName: teaShop.name }
      });
    } else {
      // Normal tea shop interaction (e.g., view details)
      // router.push({
      //   pathname: `./tea-shop/${teaShop.id}`,
      //   params: { name: teaShop.name }
      // });
      console.log("Implement normal tea shop interaction.")
    }
  };


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

  const getNearbyStores = async (latitude: number, longitude: number) => {
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nearby Tea Shops 🍵</Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" color="#00cc99" />
        </View>
      ) : (
        <FlatList
          data={shops as Place[]}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => {
            const photoRef = item.photos?.[0]?.photo_reference;
            const imageUrl = photoRef
              ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRef}&key=${GOOGLE_PLACES_API_KEY}`
              : "https://via.placeholder.com/400";

            return (
              <TouchableOpacity onPress={() => handleTeaShopPress(item)}>
                <ImageBackground source={{ uri: imageUrl }} style={styles.itemContainer} imageStyle={styles.image}>
                  <View style={styles.overlay}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.address}>{item.vicinity}</Text>
                    <Text style={styles.rating}>Rating: ⭐ {item.rating || 'N/A'}</Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold'
  },
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

