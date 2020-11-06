import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Button,
  TextInput,
} from "react-native";
import { Formik } from "formik";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import SectionButton from "../shared/SectionButton";

interface Pod {
  id: number;
  ownerId: number;
  name: string;
}

const PodsHomeScreen = ({ navigation, route }) => {
  // Holds pod of current user -- undefined if no user exists
  const [pod, setPod] = useState<Pod>();

  React.useEffect(() => {
    if (route.params?.pod) {
      setPod(route.params.pod);
    }
  }, [route.params?.pod]);

  React.useEffect(() => {
    async function fetcher() {
      try {
        const authToken = await SecureStore.getItemAsync("wigo-auth-token");
        const res = await fetch("http://localhost:8000/pods/currUsersPod", {
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            "x-auth-token": authToken!,
          },
        });

        const json = await res.json();
        const returnedPod = json.pod;
        if (returnedPod) {
          setPod(returnedPod);
        }
      } catch (err) {
        console.log("error loading pod for current user");
      }
    }

    fetcher();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        {pod == null ? (
          <Button
            title="Create New Pod"
            onPress={() => {
              navigation.navigate("CreatePod");
              return;
            }}
          />
        ) : (
          <React.Fragment>
            <Text style={[styles.h1, { marginLeft: 10, marginTop: 20 }]}>
              Your Pod
            </Text>
            <SectionButton
              title="Manage Members"
              onPress={() => console.log("Navigate to users page")}
              style={{ marginTop: 10 }}
            />
          </React.Fragment>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {},
  h1: {
    fontSize: 32,
    fontWeight: "300",
  },
});

export default PodsHomeScreen;
