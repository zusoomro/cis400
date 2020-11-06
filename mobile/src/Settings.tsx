import React from "react";
import { Text, StyleSheet, SafeAreaView } from "react-native";
import Button from "./shared/Button";
import { useSelector, useDispatch } from "react-redux";
import { logOut } from "./authSlice";
import { RootState } from "./configureStore";

const Settings: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  return (
    <SafeAreaView style={styles.container}>
      <Text>Settings Page</Text>
      <Text>Current user: {JSON.stringify(user)}</Text>
      <Button title="Log out" onPress={() => dispatch(logOut())} />
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
