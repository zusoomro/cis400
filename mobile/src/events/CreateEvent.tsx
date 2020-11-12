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
import DropDownPicker from "react-native-dropdown-picker";
import * as SecureStore from "expo-secure-store";
import LocationPicker from "./LocationPicker";

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
            repeat: repetitionValues[0].value,
            notes: "",
          }}
          onSubmit={(values) => {
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
            <View>
              <TextInput
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                value={values.name}
                placeholder="event name"
                style={styles.input}
              />
              <LocationPicker
                latFieldName="lat"
                lngFieldName="lng"
                formattedAddress="formattedAddress"
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
                containerStyle={{ flex: 1, paddingBottom: 10 }}
                itemStyle={{ justifyContent: "flex-start" }}
              />

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
  // Create event to be put in database
  const data = {
    name: values.name,
    formattedAddress: values.formattedAddress,
    lat: values.lat,
    lng: values.lng,
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
