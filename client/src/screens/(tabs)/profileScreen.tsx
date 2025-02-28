import React from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';
import images from '../../constants/images';

export default function ProfileScreen() {
  // Mock data for the profile
  const user = {
    name: 'John Doe',
    avatar: images.defaultpfp, // Using your defaultpfp from constants
    bio: "Let's meet!", // Default bio text
    stats: {
      friends: 42,
      eventsAttended: 10,
      eventsHosted: 10
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <Text style={styles.nameText}>{user.name}</Text>

      <View style={styles.avatarContainer}>
        <Image
          source={user.avatar}
          style={styles.avatar}
        // Using the image directly with no defaultSource since we're already using the default avatar
        />
      </View>

      <View style={styles.bioContainer}>
        <Text style={styles.bioText}>{user.bio}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{user.stats.friends}</Text>
          <Text style={styles.statLabel}>Friends</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{user.stats.eventsAttended}</Text>
          <Text style={styles.statLabel}>Attended</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{user.stats.eventsHosted}</Text>
          <Text style={styles.statLabel}>Hosted</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#e1e1e1',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingVertical: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  bioContainer: {
    alignItems: 'center',
    marginBottom: -10,
  },
  bioText: {
    fontSize: 16,
    color: '#555',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingHorizontal: 25,
  },
});