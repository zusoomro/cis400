import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Provider, useSelector, useDispatch } from "react-redux";
import store from "./src/configureStore";
import TabNavigator from "./src/Navigator";
import { loadToken, loadUser } from "./src/authSlice";

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <ContextApp />
      </NavigationContainer>
    </Provider>
  );
}

const ContextApp = () => {
  const userToken = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadToken());
  }, []);

  useEffect(() => {
    if (userToken) {
      dispatch(loadUser());
    }
  }, [userToken]);

  return <TabNavigator />;
};
