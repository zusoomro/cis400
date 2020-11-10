import { Formik } from "formik";
import React, { useState } from "react";
import {
  ScrollView,
  TextInput,
  Button,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import * as SecureStore from "expo-secure-store";

import DatePicker from "./DatePicker";

const repetitionValues = [
  { label: "Does not repeat", value: "no_repeat" },
  { label: "Every day", value: "daily" },
  { label: "Every week", value: "weekly" },
  { label: "Every month", value: "monthly" },
  { label: "Every year", value: "yearly" },
];

const CreateEvent: React.FC<{}> = ({ navigation }) => {
  // Start time = current time
  const [startTime, setStartTime] = useState(new Date());
  // End time = current time + 1 hour
  const [endTime, setEndTime] = useState(new Date(Date.now() + 60 * 60 * 1000));

  return (
    <SafeAreaView style={styles.container}>
      <Formik
        initialValues={{
          name: "",
          address: "",
          startTime: startTime,
          endTime: endTime,
          repeat: repetitionValues[0].value,
          notes: "",
        }}
        onSubmit={(values) => {
          console.log(values);
          createEventOnSubmit(values);
          navigation.navigate("ScheduleHomePage");
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          setFieldValue,
        }) => (
          <ScrollView>
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
            {/* Start Time input */}
            <DatePicker name="startTime" date={startTime}>
              {" "}
            </DatePicker>
            {/* End Time input */}
            <DatePicker name="endTime" date={endTime}>
              {" "}
            </DatePicker>

            <DropDownPicker
              items={repetitionValues}
              defaultValue={values.repeat}
              onChangeItem={(item) => setFieldValue("repeat", item.value)}
              containerStyle={{ padding: 15 }}
            />

            <TextInput
              onChangeText={handleChange("notes")}
              onBlur={handleBlur("notes")}
              value={values.notes}
              placeholder="Add description"
              style={styles.input}
            />
            <Button onPress={handleSubmit} title="Save" />
          </ScrollView>
        )}
      </Formik>
    </SafeAreaView>
  );
};

const createEventOnSubmit = async (values): Promise<Event | null> => {
  console.log("createEventOnSubmit");

  // Create event to be put in database
  const data = {
    name: values.name,
    address: values.address,
    startTime: values.startTime,
    endTime: values.endTime,
    repeat: values.repeat,
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
};

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
