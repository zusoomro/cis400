import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <View style={{ maxWidth: 300 }}>
        <Text style={{ fontSize: 20 }}>Welcome to Wigo!</Text>
        <Text>
          An app by Zulfi Soomro, Chloe Prezelski, Ally Smith, and Caroline
          Murphy
        </Text>
        <StatusBar style="auto" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
