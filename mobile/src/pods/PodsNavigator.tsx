import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Button, TextInput } from "react-native";
import CreatePod from "./CreatePod";
import PodsHomeScreen from "./PodsHomeScreen";
import { Formik } from "formik";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

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
      <Stack.Screen name="PodsHomeScreen" component={PodsHomeScreen}/>
      <Stack.Screen name="CreatePod" component={CreatePod}/>
    </Stack.Navigator>
  );
};

export default PodsNavigator;
