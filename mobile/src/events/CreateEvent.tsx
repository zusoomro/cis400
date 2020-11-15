import { Formik } from "formik";
import React, { useState } from "react";
import {
  ScrollView,
  TextInput,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
} from "react-native";
import Button from "../shared/Button";
import DropDownPicker from "react-native-dropdown-picker";
import * as SecureStore from "expo-secure-store";
import LocationPicker from "./LocationPicker";
import Event from "./types/Event";
import DatePicker from "./DatePicker";
import apiUrl from "../config";
import sharedStyles from "../sharedStyles";

export const repetitionValues = [
  { label: "Does not repeat", value: "no_repeat" },
  { label: "Every day", value: "daily" },
  { label: "Every week", value: "weekly" },
  { label: "Every month", value: "monthly" },
  { label: "Every year", value: "yearly" },
];

const CreateEvent: React.FC<{}> = ({ navigation }) => {
  // Start time = current time
  const [start_time, setStartTime] = useState(new Date());
  // End time = current time + 1 hour
  const [end_time, setEndTime] = useState(
    new Date(Date.now() + 60 * 60 * 1000)
  );

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <Formik
        initialValues={{
          name: "",
          formattedAddress: "",
          lat: "",
          lng: "",
          start_time: start_time,
          end_time: end_time,
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
          <View style={{ margin: 15 }}>
            <Text style={sharedStyles.inputLabelText}>Event Name</Text>
            <TextInput
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              value={values.name}
              placeholder="event name"
              style={sharedStyles.input}
            />
            <Text style={sharedStyles.inputLabelText}>Location</Text>
            <LocationPicker
              latFieldName="lat"
              lngFieldName="lng"
              formattedAddressFieldName="formattedAddress"
              formattedAddress={values.formattedAddress}
            />
            {/* Start Time input */}
            <Text style={sharedStyles.inputLabelText}>Start Time</Text>
            <DatePicker name="start_time" date={start_time} />
            <Text style={sharedStyles.inputLabelText}>End Time</Text>
            {/* End Time input */}
            <DatePicker name="end_time" date={end_time} />
            {/* Pick repetition value*/}
            <Text style={sharedStyles.inputLabelText}>Repeat</Text>
            <DropDownPicker
              items={repetitionValues}
              defaultValue={values.repeat}
              onChangeItem={(item) => setFieldValue("repeat", item.value)}
              itemStyle={{ justifyContent: "flex-start" }}
              containerStyle={{ borderRadius: 15 }}
              style={[
                sharedStyles.input,
                {
                  borderRadius: 15,
                  borderWidth: 0,
                  paddingLeft: 15,
                },
              ]}
              labelStyle={sharedStyles.inputText}
            />
            <Text style={sharedStyles.inputLabelText}>Description</Text>
            <TextInput
              onChangeText={handleChange("notes")}
              onBlur={handleBlur("notes")}
              value={values.notes}
              placeholder="Add description"
              style={[sharedStyles.input, { marginBottom: 24 }]}
            />
            <Button onPress={handleSubmit} title="Save" style={{ margin: 0 }} />
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

const createEventOnSubmit = async (values: Event): Promise<Event | null> => {
  // Create event to be put in database
  const data = {
    name: values.name,
    formattedAddress: values.formattedAddress,
    lat: values.lat,
    lng: values.lng,
    start_time: values.start_time,
    end_time: values.end_time,
    repeat: values.repeat,
    notes: values.notes,
  };

  console.log("Data for POST request", data);

  try {
    const res = await fetch(`${apiUrl}/events`, {
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
  heading: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 30,
  },
});

export default CreateEvent;
