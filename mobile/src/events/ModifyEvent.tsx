import { Formik, FormikProvider } from "formik";
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
  View,
} from "react-native";
import DatePicker from "./DatePicker";
import DropDownPicker from "react-native-dropdown-picker";
import LocationPicker from "./LocationPicker";

import { repetitionValues } from "./CreateEvent";
import * as SecureStore from "expo-secure-store";
import { StackNavigationProp } from "@react-navigation/stack";
import { ScheduleNavigatorParamList } from "./ScheduleNavigator";
import Event from "../types/Event";
import { RouteProp } from "@react-navigation/native";
import apiUrl from "../config";

type Props = {
  navigation: StackNavigationProp<ScheduleNavigatorParamList, "ModifyEvent">;
  route: RouteProp<ScheduleNavigatorParamList, "ModifyEvent">;
};

const ModifyEvent: React.FC<Props> = ({ navigation, route }) => {
  const { event } = route.params;

  // Start time
  const [start_time, setStartTime] = useState(event.start_time);
  // End time
  const [end_time, setEndTime] = useState(event.end_time);

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <SafeAreaView style={styles.container}>
        <Formik
          initialValues={{
            name: event.name,
            formattedAddress: event.formattedAddress,
            lat: event.lat,
            lng: event.lng,
            start_time: event.start_time,
            end_time: event.end_time,
            repeat: event.repeat,
            notes: event.notes,
          }}
          onSubmit={(values) => {
            console.log(values);
            modifyEventOnSubmit({ ...values, id: event.id } as Event);
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
                formattedAddressFieldName="formattedAddress"
                formattedAddress={values.formattedAddress}
              />
              {/* Start Time input */}
              <DatePicker name="start_time" date={start_time}>
                {" "}
              </DatePicker>
              {/* End Time input */}
              <DatePicker name="end_time" date={end_time}>
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
              <Button
                onPress={
                  (handleSubmit as unknown) as (
                    ev: NativeSyntheticEvent<NativeTouchEvent>
                  ) => void
                }
                title="Save"
              />
            </View>
          )}
        </Formik>
      </SafeAreaView>
    </ScrollView>
  );
};

const modifyEventOnSubmit = async (values: Event): Promise<Event | null> => {
  console.log("createEventOnSubmit");

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
    id: values.id,
  };

  console.log("Data for PUT request", data);

  try {
    const res = await fetch(`${apiUrl}/events`, {
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
