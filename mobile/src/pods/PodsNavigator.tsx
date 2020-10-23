import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Button, TextInput } from "react-native";
import CreatePod from "./CreatePod";
import { Formik } from "formik";


const PodsNavigator = () => {
  const currUserId = 2; // will change when Zulfi sets local state

  // podNameForUser will store the pod of the current user 
  const [podNameForUser, setPodNameForUser] = useState("");
  useEffect(() => {
    fetch(
      // TO-DO: Figure this out
  
      //`http://localhost:8000/pods/'${currUserId}'`,
      `http://localhost:8000/pods/5`,
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
            setPodNameForUser(res[0].name);
          } else {
            setPodNameForUser("");
          }
        }
      );
  });

  // TO-DO: delete this. Figure out how to render the CreatePod component on button click
  // and then close the component on submit
  const [createPodClicked, setCreatePodClicked] = useState(false);

  var renderCreatePodComponent = createPodClicked && podNameForUser == "";

  return (
    <SafeAreaView style={styles.container}>
      <View>
        {renderCreatePodComponent ? (
          <CreatePod></CreatePod>
        ) : (
          <View>
            {podNameForUser ? (
              <Text>Pod Name: {podNameForUser}</Text>
            ) : (
              <Button title="Create New Pod" onPress={() => {
                console.log('Create button was pressed');
                setCreatePodClicked(true);
                return;
              }}>
              </Button>
            )}
            </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});


export default PodsNavigator;
