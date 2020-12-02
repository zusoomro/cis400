import React from "react";
import { StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Event from "../types/Event";

import ScheduleHomePage from "./Schedule";
import CreateModifyEvent from "./CreateModifyEvent";

export type ScheduleNavigatorParamList = {
  ScheduleHomePage: undefined;
  CreateEvent: undefined;
  ModifyEvent: { event: Event };
};

const Stack = createStackNavigator<ScheduleNavigatorParamList>();

const ScheduleNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="ScheduleHomePage">
      <Stack.Screen
        name="ScheduleHomePage"
        component={ScheduleHomePage}
        options={{ title: "Schedule", headerShown: false }}
      />
      <Stack.Screen
        name="CreateEvent"
        component={CreateModifyEvent}
        options={{ title: "Create Event" }}
      />
      <Stack.Screen
        name="ModifyEvent"
        component={CreateModifyEvent}
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
