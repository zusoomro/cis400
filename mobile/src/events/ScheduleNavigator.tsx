import React from "react";
import { StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import CreateEvent from "./CreateEvent";
import ScheduleHomePage from "./Schedule";

const ScheduleNavigator: React.FC<{}> = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName="ScheduleHomePage">
      <Stack.Screen
        name="ScheduleHomePage"
        component={ScheduleHomePage}
        options={{ title: "Schedule", headerShown: false }}
      />
      <Stack.Screen
        name="CreateEvent"
        component={CreateEvent}
        options={{ title: "Create Event" }}
      />
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
