import React, { useState, useRef, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import ScheduleNavigator from "./events/ScheduleNavigator";
import PodsNavigator from "./pods/PodsNavigator";
import Settings from "./Settings";
import LoginRegister from "./LoginRegister";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./configureStore";
import { registerForPushNotificationsAsync } from "./pushNotifications/pushNotifications";
import { setPushToken } from "./pushNotifications/pushNotificationsSlice";
import * as Notifications from "expo-notifications";
import * as RootNavigation from './rootNavigation'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

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
  const [notification, setNotification] = useState<Notification>();
  const notificationListener = useRef<
    ReturnType<typeof Notifications.addNotificationReceivedListener>
  >();
  const responseListener = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      dispatch(setPushToken(token))
    );

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("We received a notification with this data", notification);

        setNotification(notification);
      }
    );

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        RootNavigation.navigate("ModifyEvent", {});
        console.log(response);
      }
    );

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Schedule"
      tabBarOptions={{
        labelStyle: { marginTop: -10 },
        labelPosition: "below-icon",
      }}
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
