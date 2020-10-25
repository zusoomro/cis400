import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Button, TextInput } from "react-native";
import CreatePod from "./CreatePod";
import PodsHomeScreen from "./PodsHomeScreen";
import { Formik } from "formik";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Use react naviagation to nativate between screens
// take a look at top level navigator to condition if you have a pod or not
// you can navigate between screen based on this boolean
const Stack = createStackNavigator();

const PodsNavigator = () => {

  return (
    // <SafeAreaView style={styles.container}>
    //   <View>
    //     {renderCreatePodComponent ? (
    //       <CreatePod></CreatePod>
    //     ) : (
    //       <View>
    //         {podNameForUser ? (
    //           <Text>Pod Name: {podNameForUser}</Text>
    //         ) : (
    //           <Button title="Create New Pod" onPress={() => {
    //             console.log('Create button was pressed');
    //             setCreatePodClicked(true);
    //             return;
    //           }}>
    //           </Button>
    //         )}
    //         </View>
    //     )}
    //   </View>
    // </SafeAreaView>
    <Stack.Navigator>
      <Stack.Screen name="PodsHomeScreen" component={PodsHomeScreen}/>
      <Stack.Screen name="CreatePod" component={CreatePod}/>
    </Stack.Navigator>
  );
};




export default PodsNavigator;
