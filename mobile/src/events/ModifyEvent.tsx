import { Formik } from "formik";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  ScrollView,
  TextInput,
  Button,
  SafeAreaView,
  StyleSheet,
  NativeSyntheticEvent,
  NativeTouchEvent,
} from "react-native";
import DatePicker from "./DatePicker";
import * as SecureStore from "expo-secure-store";
import { StackNavigationProp } from "@react-navigation/stack";
import { ScheduleNavigatorParamList } from "./ScheduleNavigator";
import Event from "../types/Event";
import { RouteProp } from "@react-navigation/native";

const apiUrl = "http://localhost:8000";

type Props = {
  navigation: StackNavigationProp<ScheduleNavigatorParamList, "ModifyEvent">;
  route: RouteProp<ScheduleNavigatorParamList, "ModifyEvent">;
};

const ModifyEvent: React.FC<Props> = ({ navigation, route }) => {
  const { event } = route.params;

  // Start time = current time
  const [startTime, setStartTime] = useState(new Date());
  // End time = current time + 1 hour
  const [endTime, setEndTime] = useState(new Date(Date.now() + 60 * 60 * 1000));

  return (
    <SafeAreaView style={styles.container}>
      <Formik
        initialValues={{
          name: event.name,
          address: event.address,
          start_time: event.start_time,
          end_time: event.end_time,
          notes: event.notes,
        }}
        onSubmit={(values) => {
          console.log(values);
          createEventOnSubmit({ ...values, id: event.id } as Event);
          navigation.navigate("ScheduleHomePage");
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
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

            <TextInput
              onChangeText={handleChange("notes")}
              onBlur={handleBlur("notes")}
              value={values.notes}
              placeholder="Add description"
              style={styles.input}
            />
            <Button
              onPress={
                (handleSubmit as unknown) as (
                  ev: NativeSyntheticEvent<NativeTouchEvent>
                ) => void
              }
              title="Save"
            />
          </ScrollView>
        )}
      </Formik>
    </SafeAreaView>
  );
};

const createEventOnSubmit = async (values: Event): Promise<Event | null> => {
  console.log("createEventOnSubmit");

  // Create event to be put in database
  const data = {
    name: values.name,
    address: values.address,
    startTime: values.start_time,
    endTime: values.end_time,
    notes: values.notes,
    id: values.id,
  };

  console.log("Data for PUT request", data);

  try {
    const res = await fetch("http://localhost:8000/events", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "x-auth-token": (await SecureStore.getItemAsync(
          "wigo-auth-token"
        )) as string,
      },
      body: JSON.stringify(data),
    });

    const event = await res.json();
    console.log("event after put request", event);
    return event;
  } catch (error) {
    console.log(`error updatind event`, error);
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

export default ModifyEvent;
