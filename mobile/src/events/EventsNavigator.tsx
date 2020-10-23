import { Formik, useField, useFormikContext } from "formik";
import React from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { useDispatch } from "react-redux";
import CalendarPicker from "react-native-calendar-picker";

const apiUrl = "http://localhost:8000";

const createEvent = async (values) => {
  try {
    const result = await fetch(apiUrl + "/events/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(values),
    });
    
    const token = await result.json();
    console.log("token", token);
    return token;
  } catch (ex) {
    console.log(`error creating new event`, ex);
  }
}

const EventsNavigator: React.FC<{}> = () => {
  // const dispatch = useDispatch();
  return (
    <SafeAreaView style={styles.container}>
      <Formik
        initialValues= {{
          name: "",
          address: "", 
          startTime: "", 
          endTime: "", 
          notes: "" }}
        onSubmit={(values) => {
          createEvent(values);
          console.log(values);
        }}
      >
      {({ handleChange, handleBlur, handleSubmit, values }) => (
        <View>
          <TextInput
            onChangeText={handleChange("name")}
            onBlur={handleBlur("name")}
            value={values.name}
            placeholder="event name"
            style={styles.input}
          />
          <TextInput
            onChangeText={handleChange("address")}
            onBlur={handleBlur("address")}
            value={values.address}
            placeholder="address"
            style={styles.input}
          />
          <TextInput
            onChangeText={handleChange("startTime")}
            onBlur={handleBlur("startTime")}
            value={values.startTime}
            placeholder="start time"
            style={styles.input}
          /> 
          <TextInput
            onChangeText={handleChange("endTime")}
            onBlur={handleBlur("endTime")}
            value={values.endTime}
            placeholder="end time"
            style={styles.input}
          /> 
          <TextInput
            onChangeText={handleChange("notes")}
            onBlur={handleBlur("notes")}
            value={values.notes}
            placeholder="Add description"
            style={styles.input}
          /> 
          <Button onPress={handleSubmit} title="Save"/>
        </View>
      )}
      </Formik>
      
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


export default EventsNavigator;
