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
    // Storage.deleteItemAsync("wigo-auth-token");
  }, []);

  useEffect(() => {
    if (userToken) {
      dispatch(loadUser());
      dispatch(getApiKey());
    }
  }, [userToken]);

  return fontsLoaded ? <TabNavigator /> : <AppLoading />;
};
