import React from "react";
import { View, Text, Button, StyleSheet, SafeAreaView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { logOut } from "./authSlice";

const Settings: React.FC<{}> = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  return (
    <SafeAreaView style={styles.container}>
      <Text>Settings Page</Text>
      <Text>Current user: {JSON.stringify(user)}</Text>
      <Button title="Log out" onPress={() => dispatch(logOut())}></Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
});

export default Settings;
