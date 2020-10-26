import React, { useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Button, TextInput } from "react-native";
import { Formik } from "formik";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';

const PodsHomeScreen = ({ navigation }) => {
  const currUserId = 5; // will change when Zulfi sets local state

  // podNameForUser will store the pod of the current user 
  const [podNameForUser, setPodNameForUser] = useState("");
  const [pod, setPod] = useState(null);

  interface Pod {
    id: number;
    ownerId: number;
    name: string;
  }

  useFocusEffect(
    React.useCallback(() => {
      console.log('calling http://localhost:8000/pods/currUsersPod');
      fetch(
        //`http://localhost:8000/pods/${currUserId}`,
        'http://localhost:8000/pods/currUsersPod',
        {
          method: "GET", 
        }
      )
        .then(
          (res) => {
            return res.json();
          },
          (err) => {
            console.log(err);
          }
        ).then(
          (res) => {
            if (res[0]) {
              setPod(res[0]);
              setPodNameForUser(res[0].name);
            } else {
              setPodNameForUser("");
            }
          }
        );
    }, [currUserId])
  );

  return (
      <SafeAreaView style={styles.container}>
          <View>
          {pod == null ? (
              <Button title="Create New Pod" onPress={() => {
                  console.log('Create button was pressed');
                  navigation.navigate('CreatePod');
                  return;
                }}>
              </Button>
          ) : (
              <Text>Pod Name: {podNameForUser} </Text>
          )}
            </View>
      </SafeAreaView>
  )
};

const styles = StyleSheet.create({
    container: {
      display: "flex",
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });

export default PodsHomeScreen;