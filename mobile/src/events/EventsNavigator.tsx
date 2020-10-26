import React from "react";
import Schedule from "./Schedule";
import { SafeAreaView, View, Text, StyleSheet } from "react-native";

const EventsNavigator = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Schedule></Schedule>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default EventsNavigator;
