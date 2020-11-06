import { Formik } from "formik";
import React, { useState } from "react";
import {
  ScrollView,
  TextInput,
  Button,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import DatePicker from "./DatePicker";
import * as SecureStore from "expo-secure-store";
import LocationPicker from "./LocationPicker";

const apiUrl = "http://localhost:8000";

const CreateEvent: React.FC<{}> = ({ navigation }) => {
  // Start time = current time 
  const [startTime, setStartTime] = useState(new Date());
  // End time = current time + 1 hour 
  const [endTime, setEndTime] = useState(new Date(Date.now() + 60 * 60 * 1000));

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <SafeAreaView style={styles.container}>
        <Formik
          initialValues={{
            name: "",
            formattedAddress: "",
            lat: "",
            lng: "",
            startTime: startTime,
            endTime: endTime,
            notes: ""
          }}
          onSubmit={(values) => {
            console.log(values);
            createEventOnSubmit(values);
            navigation.navigate("ScheduleHomePage");
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
              <LocationPicker latFieldName="lat" lngFieldName="lng" formattedAddress="formattedAddress" />
              {/* Start Time input */}
              <DatePicker name="startTime" date={startTime}> </DatePicker>
              {/* End Time input */}
              <DatePicker name="endTime" date={endTime}> </DatePicker>

              <TextInput
                onChangeText={handleChange("notes")}
                onBlur={handleBlur("notes")}
                value={values.notes}
                placeholder="Add description"
                style={styles.input}
              />
              <Button onPress={handleSubmit} title="Save" />
            </View>
          )}
        </Formik>
      </SafeAreaView>
    </ScrollView>
  );
};

const createEventOnSubmit = async (values): Promise<Event | null> => {
  console.log('createEventOnSubmit');

  // Create event to be put in database 
  const data = {
    name: values.name,
    formattedAddress: values.formattedAddress,
    lat: values.lat,
    lng: values.lng,
    startTime: values.startTime,
    endTime: values.endTime,
    notes: values.notes,
  };

  console.log("Data for POST request", data);

  try {
    const res = await fetch("http://localhost:8000/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "x-auth-token": await SecureStore.getItemAsync("wigo-auth-token"),
      },
      body: JSON.stringify(data),
    });

    const event = await res.json();
    console.log("event after post request", event);
    return event;
  } catch (error) {
    console.log(`error creating new event`, error);
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexGrow: 1,
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

export default CreateEvent;
