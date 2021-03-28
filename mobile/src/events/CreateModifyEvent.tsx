import { Formik } from "formik";
import React, { useState } from "react";
import {
  ScrollView,
  TextInput,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
} from "react-native";
import Button from "../shared/Button";
import DropDownPicker from "react-native-dropdown-picker";
import sharedStyles from "../sharedStyles";
import { useDispatch } from "react-redux";
import moment from "moment";

/** Import Custom Components */
import LocationPicker from "./LocationPicker";
import DatePicker from "./DatePicker";
import GeneralEventInput from "./GeneralEventInput";

/** Import Types  */
import Event from "../types/Event";
import { ProposedEventConflicts, SuggestedTime } from "./eventConflictService";
import EventConflictModal from "./EventConflictModal";
import DeleteEventModal from "./DeleteEventModal";
import Pod from "../types/Pod";

/** Import Helpers */
import {
  validateEventSchema,
  eventFormikValues,
  CreateModifyEventProps,
  priorityValues,
  emptyFormEventValues,
  populatedFormEventValues,
  submitCreateModifyEventForm,
} from "./createModifyEventHelpers";

/***
 * CreateModifyEvent contains the component for the CreateModifyEvent page.
 *
 * It also shows the the EventConflictsModal and DeleteEventModal in case of needed use.
 */
const CreateModifyEvent: React.FC<CreateModifyEventProps> = ({
  navigation,
  route,
}) => {
  const event: Event | null = route?.params?.event;
  const pod: Pod = route?.params?.pod;

  // Start time = current time
  const [start_time, setStartTime] = useState(
    event ? event.start_time : new Date()
  );
  // End time = current time + 1 hour initially
  const [end_time, setEndTime] = useState(
    event ? event.end_time : new Date(Date.now() + 60 * 60 * 1000)
  );

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [conflictModalVisible, setConflictModalVisible] = useState(false);
  const [valuesOnSubmit, setValuesOnSubmit] = useState<Event>();
  const [conflictValues, setConflictValues] = useState<
    ProposedEventConflicts
  >();
  const [suggestedTimes, setSuggestedTimes] = useState<SuggestedTime[]>();

  const dispatch = useDispatch();
  // Allows you to pass dispatch into helper functions
  const helperDispatch = (thingToDispatch: any) => {
    dispatch(thingToDispatch);
  };

  // When the start time changes, change the endTime to the start Time + current event length
  const startTimeChange = (newStartTime: Date) => {
    // Calculate current event length
    const duration = moment.duration(moment(end_time).diff(start_time));
    setStartTime(newStartTime);
    setEndTime(
      moment(newStartTime).add(duration.asMinutes(), "minutes").toDate()
    );
  };
  const [clickDescription, setClickDescription] = useState<boolean>(false);

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <Formik
        initialValues={
          event
            ? populatedFormEventValues(event)
            : emptyFormEventValues(
                start_time,
                end_time,
                pod.homeAddress,
                pod.lat,
                pod.lng
              )
        }
        validationSchema={validateEventSchema}
        onSubmit={async (values: eventFormikValues) => {
          submitCreateModifyEventForm(
            values,
            event,
            navigation,
            setValuesOnSubmit,
            setConflictValues,
            setSuggestedTimes,
            setConflictModalVisible,
            helperDispatch
          );
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
          <KeyboardAvoidingView
            style={{ margin: 15 }}
            behavior="padding"
            enabled={clickDescription}
          >
            {/* Event Name */}
            <GeneralEventInput
              inputTitle="Event Name"
              GeneralInputComponent={
                <TextInput
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  value={values.name}
                  placeholder="event name"
                  style={[sharedStyles.input, { marginBottom: 0 }]}
                />
              }
              error={touched.name && errors.name ? (errors.name as String) : ""}
            />

            {/* Start Time input */}
            <GeneralEventInput
              inputTitle="Start Time"
              GeneralInputComponent={
                <DatePicker
                  name="start_time"
                  date={start_time}
                  startTimeChange={startTimeChange}
                  endTimeChange={setEndTime}
                />
              }
              error={
                touched.start_time && errors.start_time
                  ? (errors.start_time as String)
                  : ""
              }
            />
            {/* End Time input */}
            <GeneralEventInput
              inputTitle="End Time"
              GeneralInputComponent={
                <DatePicker
                  name="start_time"
                  date={start_time}
                  startTimeChange={startTimeChange}
                  endTimeChange={setEndTime}
                />
              }
              error={!!errors.end_time ? (errors.end_time as String) : ""}
            />

            {/* Start Location */}
            <GeneralEventInput
              inputTitle="Start Location"
              GeneralInputComponent={
                <LocationPicker
                  latFieldName="startLat"
                  lngFieldName="startLng"
                  formattedAddressFieldName="startFormattedAddress"
                  formattedAddress={values.startFormattedAddress}
                  destinationPicker={false}
                />
              }
              error={
                touched.startFormattedAddress && errors.startFormattedAddress
                  ? (errors.startFormattedAddress as String)
                  : ""
              }
            />

            {/* Destination */}
            <GeneralEventInput
              inputTitle="Destination"
              GeneralInputComponent={
                <LocationPicker
                  latFieldName="lat"
                  lngFieldName="lng"
                  formattedAddressFieldName="formattedAddress"
                  formattedAddress={values.formattedAddress}
                  destinationPicker={true}
                />
              }
              error={
                touched.formattedAddress && errors.formattedAddress
                  ? (errors.formattedAddress as String)
                  : ""
              }
            />

            <Text style={sharedStyles.inputLabelText}>Priority</Text>

            <DropDownPicker
              items={priorityValues}
              defaultValue={values.priority}
              onChangeItem={(item) => setFieldValue("priority", item.value)}
              itemStyle={{ justifyContent: "flex-start" }}
              containerStyle={{ borderRadius: 15, marginBottom: 15 }}
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

            {/* Description */}
            <GeneralEventInput
              inputTitle="Description"
              GeneralInputComponent={
                <TextInput
                  onChangeText={handleChange("notes")}
                  onBlur={handleBlur("notes")}
                  value={values.notes}
                  placeholder="Add description"
                  style={[sharedStyles.input]}
                  onFocus={() => setClickDescription(true)}
                />
              }
              error=""
            />
            <Button
              onPress={handleSubmit}
              title="Save"
              style={[{ margin: 0 }, !isValid && sharedStyles.disabledButton]}
            />
            {!!event && (
              <Button
                onPress={() => setDeleteModalVisible(true)}
                title="Delete"
                style={{ margin: 0 }}
              />
            )}
            {!!deleteModalVisible && !!event && (
              <DeleteEventModal
                deleteModalVisible={deleteModalVisible}
                event={event}
                setDeleteModalVisible={setDeleteModalVisible}
                navigation={navigation}
              />
            )}
          </KeyboardAvoidingView>
        )}
      </Formik>
      <SafeAreaView>
        {!!conflictModalVisible && (
          <EventConflictModal
            setConflictModalVisible={setConflictModalVisible}
            conflictModalVisible={conflictModalVisible}
            values={valuesOnSubmit!}
            navigation={navigation}
            existingEvent={event}
            conflicts={conflictValues!}
            suggestedTimes={suggestedTimes!}
          />
        )}
      </SafeAreaView>
    </ScrollView>
  );
};

export default CreateModifyEvent;
