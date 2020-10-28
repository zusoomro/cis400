import React, { useState } from "react";
import { Button, SafeAreaView, StyleSheet, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import CreateEvent from "./CreateEvent";
import Schedule from "./Schedule";

const ScheduleHomePage: React.FC<{}> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Schedule />
      <Button
        title="Create Event"
        onPress={() => {
          console.log("Create New Event button clicked");
          navigation.navigate("CreateEvent");
          return;
        }}></Button>
    </SafeAreaView>
  )
}
const ScheduleNavigator: React.FC<{}> = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName="ScheduleHomePage">
      <Stack.Screen name="ScheduleHomePage" component={ScheduleHomePage}
        options={{ title: 'Schedule' }} />
      <Stack.Screen name="CreateEvent" component={CreateEvent}
        options={{ title: 'Create Event' }} />
    </Stack.Navigator>
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

export default ScheduleNavigator;
