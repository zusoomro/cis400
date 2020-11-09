import { useField, useFormikContext } from "formik";
import React, { useState } from "react";
import { View, Text, Platform, StyleSheet } from "react-native";
import moment from "moment";
import DateTimePicker from "@react-native-community/datetimepicker";

const DatePicker: React.FC<{ name: string; date: Date }> = (props) => {
  // Used for user interaction with datepicker
  const [date, setDate] = useState(props.date);
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  // Used with setting date value in formik
  const { setFieldValue } = useFormikContext();
  const [field] = useField(props.name);

  const onChange = (event, selectedDate) => {
    // Set date on calendar UI
    setDate(selectedDate);
    // Set date in form
    setFieldValue(props.name, selectedDate);
    console.log("Selected date", selectedDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  return (
    <View>
      <View style={styles.dateTimeRow}>
        {/* // Date  */}
        <Text onPress={showDatepicker}>
          {moment(date).format("ddd, MMM D")}
        </Text>
        {/* // Time  */}
        <Text onPress={showTimepicker}> {moment(date).format(" h:mmA")}</Text>
      </View>

      {show && (
        <DateTimePicker
          {...field}
          {...props}
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dateTimeRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    fontSize: 20,
    marginBottom: 10,
  },
});

export default DatePicker;
