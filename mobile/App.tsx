import { BebasNeue_400Regular, useFonts } from "@expo-google-fonts/bebas-neue";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { AppLoading } from "expo";
import React, { useEffect } from "react";
import "react-native-gesture-handler";
import { Provider, useDispatch, useSelector } from "react-redux";
import { getApiKey, loadToken, loadUser } from "./src/authSlice";
import store, { RootState } from "./src/configureStore";
import TabNavigator from "./src/Navigator";

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
