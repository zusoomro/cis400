import { Formik } from "formik";
import React, { useState } from "react";
import { ScrollView, TextInput, View, Text, SafeAreaView } from "react-native";
import Button from "../shared/Button";
import DropDownPicker from "react-native-dropdown-picker";
import sharedStyles from "../sharedStyles";

/** Import Custom Components */
import LocationPicker from "./LocationPicker";
import DatePicker from "./DatePicker";

/** Import Types  */
import Event from "../types/Event";
import { ProposedEventConflicts, SuggestedTime } from "./eventConflictService";

import { EventConflictModal } from "./EventConflictModal";
import DeleteEventModal from "./DeleteEventModal";

/** Import Helpers */
import {
  validateEventSchema,
  eventFormikValues,
  CreateModifyEventProps,
  repetitionValues,
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
  const [suggestedTimes, setSuggestedTimes] = useState<SuggestedTime[]>();

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <Formik
        initialValues={
          event
            ? populatedFormEventValues(event)
            : emptyFormEventValues(start_time, end_time)
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
            setConflictModalVisible
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
            <Text style={sharedStyles.inputLabelText}>Start Location</Text>
            <LocationPicker
              latFieldName="startLat"
              lngFieldName="startLng"
              formattedAddressFieldName="startFormattedAddress"
              formattedAddress={values.startFormattedAddress}
              destinationPicker={false}
            />
            <Text style={sharedStyles.inputError}>
              {touched.startFormattedAddress && errors.startFormattedAddress
                ? (errors.startFormattedAddress as String)
                : ""}
            </Text>
            <Text style={sharedStyles.inputLabelText}>Destination</Text>
            <LocationPicker
              latFieldName="lat"
              lngFieldName="lng"
              formattedAddressFieldName="formattedAddress"
              formattedAddress={values.formattedAddress}
              destinationPicker={true}
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
            {!!errors.end_time && (
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
            {/* Priority */}
            <Text style={sharedStyles.inputLabelText}>Priority</Text>
            <DropDownPicker
              items={priorityValues}
              defaultValue={values.priority}
              onChangeItem={(item) => setFieldValue("priority", item.value)}
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
          </View>
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
