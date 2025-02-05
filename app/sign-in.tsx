import { View, Text, ScrollView, Image, TouchableOpacity, Alert, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ThemedView } from '@/components/ThemedView'

const SignIn = () => {

  const handelLogin = async () => {
    console.log("Login success.")
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text>Welcome to BobaSync!</Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'black',
    fontSize: 20
  }
})

export default SignIn