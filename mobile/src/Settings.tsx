import React, { useState } from "react";
import { Text, StyleSheet, SafeAreaView, Image, View } from "react-native";
import Button from "./shared/Button";
import { useSelector, useDispatch } from "react-redux";
import { logOut } from "./authSlice";
import { RootState } from "./configureStore";
import sharedStyles from "./sharedStyles";
import { Ionicons } from "@expo/vector-icons";

const Settings: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [debug, setDebug] = useState(false);
  const dispatch = useDispatch();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={sharedStyles.h1}>Settings</Text>
      <View
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 15,
            backgroundColor: "#FFF",
            borderRadius: 15,
            padding: 15,
            marginBottom: 30,
          },
          sharedStyles.shadow,
        ]}
      >
        <Image
          source={{ uri: user.avatar }}
          style={{
            width: 60,
            height: 60,
            marginHorizontal: "auto",
            borderRadius: 1000,
            marginRight: 15,
          }}
        />
        <View>
          <Text
            style={{
              fontSize: 24,
              color: "#434190",
              fontWeight: "bold",
              marginBottom: 2,
            }}
          >
            Your Profile
          </Text>
          <Text style={{ fontSize: 16, color: "#667EEA" }}>{user.email}</Text>
        </View>
      </View>
      <Button
        title={debug ? "Hide debug information" : "Show debug information"}
        style={{ backgroundColor: "#667EEA" }}
        onPress={() => setDebug((state) => !state)}
      />
      {debug && (
        <View
          style={[
            {
              marginHorizontal: 15,
              backgroundColor: "#FFF",
              padding: 15,
              borderRadius: 15,
              marginBottom: 15,
            },
            sharedStyles.shadow,
          ]}
        >
          <Text style={{ fontSize: 16 }}>
            Current user: {JSON.stringify(user, null, 4)}
          </Text>
        </View>
      )}
      <Button
        title="Log out"
        style={{ marginTop: 0, backgroundColor: "#7F9CF5" }}
        onPress={() => dispatch(logOut())}
      />
      <Text
        style={{
          position: "absolute",
          bottom: 15,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 14,
          color: "#667EEA",
        }}
      >
        Made with <Ionicons name={"md-heart"} size={14} /> by the homies
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    marginHorizontal: 15,
  },
});

export default Settings;
