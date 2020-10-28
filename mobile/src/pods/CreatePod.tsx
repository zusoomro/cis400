import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  StyleSheet,
  Button
} from "react-native";
import { Formik } from "formik";
import * as SecureStore from "expo-secure-store";

interface Pod {
  id: number;
  ownerId: number;
  name: string;
}

interface Props {
  navigation: {
    navigate: (screen : string, data: {pod: Pod}) => void;
  }
}

const CreatePod: React.FC<Props> = ({navigation, route}) => { 

  const [pod, setPod] = useState<Pod>();
  return (
  <SafeAreaView style={styles.container}>
    <Formik
        initialValues={{ podname: ""}}
        onSubmit={async (values) => {
          console.log(values);
          const res : Pod = await createPodOnSubmit(values);
          if (res) {
            setPod(res);
          }
          navigation.navigate('PodsHomeScreen', {pod : res})
        }}
      >
        {({handleChange, handleBlur, handleSubmit, values }) => (
          <View>
            <Text style={styles.heading}>Create Pod</Text>
            <TextInput
              onChangeText={handleChange("podname")}
              onBlur={handleBlur("podName")}
              value={values.podname}
              placeholder="Pod Name"
              style={styles.input}
            />
            <Button onPress={handleSubmit} title="Submit" />
          </View>
        )}
      </Formik>
  </SafeAreaView>);
};

const createPodOnSubmit = async (values) => {
  console.log('createPodOnSubmit');
  const data = {name: values.podname};
  try {
    const res = await fetch("http://localhost:8000/pods", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "x-auth-token": (await SecureStore.getItemAsync("wigo-auth-token"))!,
      },
      body: JSON.stringify(data),
    });
    const pod = await res.json();
    console.log("pod", pod);
    return pod;
  } catch (error) {
    console.log(`error creating pod`, error);
    return null;
  }
  
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    backgroundColor: "white",
    marginBottom: 20,
    paddingHorizontal: 20,
    width: 300,
    height: 50,
    fontSize: 16,
    color: "black",
    borderRadius: 20,
  },
  heading: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 30,
  },
});

export default CreatePod;