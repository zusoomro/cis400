import React from "react";
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  StyleSheet,
  Button
} from "react-native";
import { Formik } from "formik";

interface Props {
  navigation: {
    navigate: (screen : string) => void;
  }
}

const CreatePod: React.FC<Props> = ({navigation}) => { 
  return (
  <SafeAreaView style={styles.container}>
    <Formik
        initialValues={{ podname: ""}}
        onSubmit={(values) => {
          console.log(values);
          createPodOnSubmit(values);
          navigation.navigate('PodsHomeScreen')
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
  // When zulfi pushes his code, we will extra owner from the user token
  const ownerId = 1; 
  const data = {ownerId: ownerId, name: values.podname};
  try {
    const res = await fetch("http://localhost:8000/pods", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
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