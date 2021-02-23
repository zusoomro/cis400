import analytics from "./src/analytics/analytics";
import { BebasNeue_400Regular, useFonts } from "@expo-google-fonts/bebas-neue";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { AppLoading } from "expo";
import * as Notifications from "expo-notifications";
import React, { useEffect, useRef, useState } from "react";
import "react-native-gesture-handler";
import { Provider, useDispatch, useSelector } from "react-redux";
import { getApiKey, loadToken, loadUser } from "./src/authSlice";
import store, { RootState } from "./src/configureStore";
import TabNavigator from "./src/Navigator";
import { navigationRef } from "./src/rootNavigation";
import { setupNotificationListeners } from "./src/pushNotifications/pushNotifications";

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer
        theme={{
          ...DefaultTheme,
          colors: { ...DefaultTheme.colors, primary: "#667EEA" },
        }}
        ref={navigationRef}
      >
        <ContextApp />
      </NavigationContainer>
    </Provider>
  );
}

const ContextApp = () => {
  const userToken = useSelector((state: RootState) => state.auth.token);
  const [fontsLoaded] = useFonts({ BebasNeue_400Regular });
  const dispatch = useDispatch();
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    setupNotificationListeners(notificationListener, responseListener);
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  });

  useEffect(() => {
    dispatch(loadToken());
    // In case you need to delete the user token, uncomment this line
    // SecureStore.deleteItemAsync("wigo-auth-token");
    for (let i = 0; i < 150; i++) {
      analytics.identify(i.toString());
      analytics.track("User entered conflicting event");
    }

    for (let i = 0; i < 60; i++) {
      analytics.identify(i.toString());
      analytics.track("Conflict: user scheduled at suggested time");
    }

    for (let i = 0; i < 60; i++) {
      analytics.identify(i.toString());
      analytics.track("Conflict: user edits their event");
    }

    for (let i = 0; i < 30; i++) {
      analytics.identify(i.toString());
      analytics.track("Conflict: user schedules event anyway");
    }

    for (let i = 0; i < 50; i++) {
      analytics.identify(i.toString());
      analytics.track("Event created", {
        $duration: Math.floor(Math.random() * 60) + 30,
      });
    }

    for (let i = 0; i < 50; i++) {
      analytics.identify(i.toString());
      analytics.track("Pod created", {
        $duration: Math.floor(Math.random() * 60) + 45,
      });
    }

    for (let i = 0; i < 50; i++) {
      analytics.identify(i.toString());
      analytics.track("Viewed schedule page", {
        $duration: Math.floor(Math.random() * 60) + 60,
      });
    }

    for (let i = 0; i < 50; i++) {
      analytics.identify(i.toString());
      analytics.track("Viewed pod page", {
        $duration: Math.floor(Math.random() * 60) + 45,
      });
    }

    for (let i = 0; i < 50; i++) {
      analytics.identify(i.toString());
      analytics.track("Viewed settings page", {
        $duration: Math.floor(Math.random() * 60) + 15,
      });
    }

    for (let i = 0; i < 47; i++) {
      analytics.identify(i.toString());
      analytics.track("User entered conflicting event");
      analytics.track("Event created");
      analytics.track("Event modified");
      analytics.track("Event deleted");
      analytics.track("Conflict: user scheduled at suggested time");
      analytics.track("Conflict: user edits thier event");
      analytics.track("Conflict: user schedules event anyway");
      analytics.track("Viewing user's events");
      analytics.track("Viewing pod's events");
      analytics.track("Log out");
      analytics.track("Log in");
      analytics.track("Register");
      analytics.track("Users invited to pod");
      analytics.track("Pod created");
      analytics.track("User rejected invite");
      analytics.track("User accepted invite");
      analytics.track("User entered conflicting event");
      analytics.track("Conflict: user scheduled at suggested time");
      analytics.track("Conflict: user edits their event");
      analytics.track("Conflict: user schedules event anyway");
      analytics.track("Event created");
      analytics.track("Pod created");
      analytics.track("Viewed schedule page");
      analytics.track("Viewed pod page");
      analytics.track("Viewed settings page");
    }

    console.log("tracked events!");
  }, []);

  useEffect(() => {
    if (userToken) {
      dispatch(loadUser());
      dispatch(getApiKey());
    }
  }, [userToken]);

  return fontsLoaded ? <TabNavigator /> : <AppLoading />;
};
