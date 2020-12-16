import { Formik } from "formik";
import React, { useState } from "react";
import { ScrollView, TextInput, View, Text, SafeAreaView } from "react-native";
import Button from "../shared/Button";
import DropDownPicker from "react-native-dropdown-picker";
import LocationPicker from "./LocationPicker";
import DatePicker from "./DatePicker";
import sharedStyles from "../sharedStyles";
import Event from "../types/Event";
import {
  createEventOnSubmit,
  modifyEventOnSubmit,
  proposeEvent,
  ProposedEventConflicts,
  validateEventSchema,
} from "./eventsService";
import { EventConflictModal } from "./EventConflictModal";
import { fetchUserPod } from "./Schedule";
import DeleteEventModal from "./DeleteEventModal";

export const repetitionValues = [
  { label: "Does not repeat", value: "no_repeat" },
  { label: "Every day", value: "daily" },
  { label: "Every week", value: "weekly" },
  { label: "Every month", value: "monthly" },
  { label: "Every year", value: "yearly" },
];

type Props = {
  event?: Event;
  navigation: {
    navigate: (screen: string) => void;
  };
  route: Object;
};

const CreateModifyEvent: React.FC<Props> = ({ navigation, route }) => {
  const event: Event = route?.params?.event;

  // Start time = current time
  const [start_time, setStartTime] = useState(
    event ? event.start_time : new Date()
  );
  // End time = current time + 1 hour
  const [end_time, setEndTime] = useState(
    event ? event.end_time : new Date(Date.now() + 60 * 60 * 1000)
  );

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [conflictModalVisible, setConflictModalVisible] = useState(false);
  const [valuesOnSubmit, setValuesOnSubmit] = useState<Event>();
  const [conflictValues, setConflictValues] = useState<
    ProposedEventConflicts
  >();

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <Formik
        initialValues={
          event
            ? {
                name: event.name,
                formattedAddress: event.formattedAddress,
                lat: event.lat,
                lng: event.lng,
                start_time: event.start_time,
                end_time: event.end_time,
                repeat: repetitionValues[0].value,
                notes: event.notes,
              }
            : {
                name: "",
                formattedAddress: "",
                lat: "",
                lng: "",
                start_time: start_time,
                end_time: end_time,
                repeat: repetitionValues[0].value,
                notes: "",
              }
        }
        validationSchema={validateEventSchema}
        onSubmit={async (values) => {
          const pod = await fetchUserPod();

          const conflicts: ProposedEventConflicts | false =
            pod != undefined &&
            (await proposeEvent(values as Event, pod.id, event))!;

          // If event is in a pod && If event has conflicts, show the conflict modal
          if (conflicts && conflicts.isConflicting) {
            setValuesOnSubmit(values as Event);
            setConflictValues(conflicts);
            setConflictModalVisible(true);
            return;
          }

          if (event) {
            modifyEventOnSubmit({ ...values, id: event.id } as Event);
          } else {
            createEventOnSubmit(values as Event);
          }
          navigation.navigate("ScheduleHomePage");
        }}
      >
        {({
          errors,
          handleChange,
          handleBlur,
          handleSubmit,
          isValid,
          setFieldValue,
          touched,
          values,
        }) => (
          <View style={{ margin: 15 }}>
            <Text style={sharedStyles.inputLabelText}>Event Name</Text>
            <TextInput
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              value={values.name}
              placeholder="event name"
              style={[sharedStyles.input, { marginBottom: 0 }]}
            />
            <Text style={sharedStyles.inputError}>
              {touched.name && errors.name ? (errors.name as String) : ""}
            </Text>
            <Text style={sharedStyles.inputLabelText}>Location</Text>
            <LocationPicker
              latFieldName="lat"
              lngFieldName="lng"
              formattedAddressFieldName="formattedAddress"
              formattedAddress={values.formattedAddress}
            />
            <Text style={sharedStyles.inputError}>
              {touched.formattedAddress && errors.formattedAddress
                ? (errors.formattedAddress as String)
                : ""}
            </Text>
            {/* Start Time input */}
            <Text style={sharedStyles.inputLabelText}>Start Time</Text>
            <DatePicker name="start_time" date={start_time} />
            {touched.start_time && errors.start_time && (
              <Text>{errors.start_time}</Text>
            )}
            <Text style={sharedStyles.inputLabelText}>End Time</Text>
            {/* End Time input */}
            <DatePicker name="end_time" date={end_time} />
            {errors.end_time && (
              <Text style={sharedStyles.inputError}>{errors.end_time}</Text>
            )}
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
            <Button
              onPress={handleSubmit}
              title="Save"
              style={[{ margin: 0 }, !isValid && sharedStyles.disabledButton]}
            />
            {event && (
              <Button
                onPress={() => setDeleteModalVisible(true)}
                title="Delete"
                style={{ margin: 0 }}
              />
            )}
            {deleteModalVisible && event && (
              <DeleteEventModal
                deleteModalVisible={deleteModalVisible}
                event={event}
                setDeleteModalVisible={setDeleteModalVisible}
              />
            )}
          </View>
        )}
      </Formik>
      <SafeAreaView>
        {conflictModalVisible && (
          <EventConflictModal
            setConflictModalVisible={setConflictModalVisible}
            conflictModalVisible={conflictModalVisible}
            values={valuesOnSubmit!}
            navigation={navigation}
            existingEvent={event}
            conflicts={conflictValues!}
          />
        )}
      </SafeAreaView>
    </ScrollView>
  );
};

export default CreateModifyEvent;
