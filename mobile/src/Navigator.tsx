import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import ScheduleNavigator from "./events/ScheduleNavigator";
import PodsNavigator from "./pods/PodsNavigator";
import Settings from "./Settings";
import LoginRegister from "./LoginRegister";
import { useSelector } from "react-redux";
import { RootState } from "./configureStore";

const Tab = createBottomTabNavigator<TabNavigatorParamList>();

export type TabNavigatorParamList = {
  Schedule: undefined;
  Pods: undefined;
  Settings: undefined;
  Login: undefined;
  Register: undefined;
};

const TabNavigator = () => {
  const authenticated = useSelector(
    (state: RootState) => state.auth.authenticated
  );
  console.log("authenticated", authenticated);

  return (
    <Tab.Navigator
      initialRouteName="Schedule"
      tabBarOptions={{ labelStyle: { marginTop: -10 } }}
    >
      {authenticated ? (
        <React.Fragment>
          <Tab.Screen
            name="Schedule"
            component={ScheduleNavigator}
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
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="ios-people" color={color} size={size} />
              ),
              tabBarVisible: false,
            }}
          >
            {(props) => <LoginRegister isLogin={true} {...props} />}
          </Tab.Screen>
          <Tab.Screen
            name="Register"
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="ios-people" color={color} size={size} />
              ),
              tabBarVisible: false,
            }}
          >
            {(props) => <LoginRegister isLogin={false} {...props} />}
          </Tab.Screen>
        </React.Fragment>
      )}
    </Tab.Navigator>
  );
};

export default TabNavigator;
