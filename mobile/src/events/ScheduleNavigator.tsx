import React from "react";
import { StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Event from "../types/Event";

import CreateEvent from "./CreateEvent";
import ScheduleHomePage from "./Schedule";
import ModifyEvent from "./ModifyEvent";

export type ScheduleNavigatorParamList = {
  ScheduleHomePage: undefined;
  CreateEvent: undefined;
  ModifyEvent: { event: Event };
};

const ScheduleNavigator: React.FC = () => {
  const Stack = createStackNavigator<ScheduleNavigatorParamList>();

  return (
    <Stack.Navigator initialRouteName="ScheduleHomePage">
      <Stack.Screen
        name="ScheduleHomePage"
        component={ScheduleHomePage}
        options={{ title: "Schedule" }}
      />
      <Stack.Screen
        name="CreateEvent"
        component={CreateEvent}
        options={{ title: "Create Event" }}
      />
      <Stack.Screen
        name="ModifyEvent"
        component={ModifyEvent}
        options={{ title: "Modify Event" }}
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
