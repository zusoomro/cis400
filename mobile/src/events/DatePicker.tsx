import { useField, useFormikContext } from "formik";
import React, { useState } from "react";
import {
  View,
  Text,
  Platform,
  StyleSheet,
} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';

const DatePicker: React.FC<{}> = ({ ...props }) => {
  // Used for user interaction with datepicker
  const [date, setDate] = useState(props.date);
  const [mode, setMode] = useState('date');
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
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  return (
    <View>
      <View style={styles.dateTimeRow}>
        {/* // Date  */}
        <Text onPress={showDatepicker}>
          {dayNumToString(date.getDay())}, {monthNumToString(date.getMonth())} {date.getDate()}
        </Text>
        {/* // Time  */}
        <Text onPress={showTimepicker}>   {date.toLocaleTimeString('en-US')}</Text>
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

const dayNumToString = (day: number) => {
  switch (day) {
    case 0:
      return "Sunday";
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
    default:
      console.log("Error: inputted invalid day to dayNumToString");
  }
};

const monthNumToString = (month: number) => {
  switch (month) {
    case 0:
      return "Jan";
    case 1:
      return "Feb";
    case 2:
      return "Mar";
    case 3:
      return "Apr";
    case 4:
      return "May";
    case 5:
      return "Jun";
    case 6:
      return "Jul";
    case 7:
      return "Aug";
    case 8:
      return "Sep";
    case 9:
      return "Oct";
    case 10:
      return "Nov";
    case 11:
      return "Dec";
    default:
      console.log("Error: inputted invalid month to monthNumToString");
  }
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