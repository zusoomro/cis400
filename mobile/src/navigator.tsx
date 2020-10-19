import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import EventsNavigator from "./events/EventsNavigator";
import PodsNavigator from "./pods/PodsNavigator";
import Settings from "./settings";

const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    initialRouteName="Events"
    tabBarOptions={{ labelStyle: { marginTop: -10 } }}
  >
    <Tab.Screen
      name="Events"
      component={EventsNavigator}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="ios-calendar" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Pods"
      component={PodsNavigator}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="ios-people" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Settings"
      component={Settings}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="ios-settings" color={color} size={size} />
        ),
      }}
    />
  </Tab.Navigator>
);

export default TabNavigator;
