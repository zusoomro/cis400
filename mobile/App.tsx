import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { Provider, useSelector, useDispatch } from "react-redux";
import store, { RootState } from "./src/configureStore";
import TabNavigator from "./src/Navigator";
import { loadToken, loadUser, getApiKey } from "./src/authSlice";
import { useFonts, BebasNeue_400Regular } from "@expo-google-fonts/bebas-neue";
import * as SplashScreen from "expo-splash-screen";
import { AppLoading } from "expo";

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer
        theme={{
          ...DefaultTheme,
          colors: { ...DefaultTheme.colors, primary: "#667EEA" },
        }}
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

  useEffect(() => {
    dispatch(loadToken());
  }, []);

  useEffect(() => {
    if (userToken) {
      dispatch(loadUser());
      dispatch(getApiKey());
    }
  }, [userToken]);

  return fontsLoaded ? <TabNavigator /> : <AppLoading />;
};
