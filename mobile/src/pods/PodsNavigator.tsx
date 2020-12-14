import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Button,
  TextInput,
} from "react-native";
import CreatePod from "./CreatePod";
import PodsHomeScreen from "./PodsHomeScreen";
import InviteUsers from "./InviteUsers";
import { Formik } from "formik";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import PodMembers from "./PodMembers";
import ResolveConflicts from "./ResolveConflicts";

const Stack = createStackNavigator();

const PodsNavigator = () => {
  interface Pod {
    id: number;
    ownerId: number;
    name: string;
  }
  const [pod, setPod] = useState(null);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PodsHomeScreen"
        component={PodsHomeScreen}
        options={{ title: "Your Pods", headerShown: false }}
      />
      <Stack.Screen
        name="CreatePod"
        component={CreatePod}
        options={{ title: "Create a Pod" }}
      />
      <Stack.Screen
        name="ResolveConflicts"
        component={ResolveConflicts}
        options={{ title: "Resolve conflicts" }}
      />
      <Stack.Screen
        name="InviteUsers"
        component={InviteUsers}
        options={{ title: "Invite users" }}
      />
      <Stack.Screen
        name="PodMembers"
        component={PodMembers}
        options={{ title: "Manage members" }}
      />
    </Stack.Navigator>
  );
};

export default PodsNavigator;
