// This will be the home screen
// We will move the content from the old App.tsx here soon
import React from "react";
import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

export default function HomeScreen() {
  // Vamos a hacer una vista simple con un boton para ir a la lista de ingredientes

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.banner}>
        <Text>Home Screen</Text>
      </View>
      <Button
        title="Go to Ingredients"
        onPress={() => router.push("/ingredients")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  banner: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    display: "flex",
    alignItems: "center",
  },
});
