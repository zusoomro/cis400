import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import EventsNavigator from "./events/EventsNavigator";
import PodsNavigator from "./pods/PodsNavigator";
import Settings from "./settings";
import Login from "./Login";
import Register from "./Register";
import { useSelector } from "react-redux";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  // const authenticated = useSelector((state) => state.auth.token);
  const authenticated = true;

  console.log("authenticated", authenticated);

  return (
    <Tab.Navigator
      initialRouteName="Events"
      tabBarOptions={{ labelStyle: { marginTop: -10 } }}
    >
      {authenticated ? (
        <React.Fragment>
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
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Tab.Screen
            name="Login"
            component={Login}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="ios-people" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Register"
            component={Register}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="ios-people" color={color} size={size} />
              ),
            }}
          />
        </React.Fragment>
      )}
    </Tab.Navigator>
  );
};

export default TabNavigator;
