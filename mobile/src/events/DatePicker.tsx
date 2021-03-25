import { useField, useFormikContext } from "formik";
import React, { useState } from "react";
import { View, Text, Platform, StyleSheet } from "react-native";
import moment from "moment";
import DateTimePicker from "@react-native-community/datetimepicker";
import sharedStyles from "../sharedStyles";

type Props = {
  name: string;
  date: Date;
  startTimeChange: (startDate: Date) => void;
  endTimeChange: React.Dispatch<React.SetStateAction<Date>>;
};

enum State {
  Date,
  Time,
  Hidden,
}

const DatePicker: React.FC<Props> = (props) => {
  // Used for user interaction with datepicker
  const [date, setDate] = useState(props.date);
  const [state, setState] = useState<State>(State.Hidden);

  // Used with setting date value in formik
  const { setFieldValue } = useFormikContext();
  const [field] = useField(props.name);

  // If prop date changes because of updates in other date picker
  React.useEffect(() => {
    setDate(props.date);
    setFieldValue(props.name, props.date);
  }, [props.date]);

  // If user changes date on this date time picker
  const onChange = (event, selectedDate) => {
    // Set date on calendar UI
    setDate(selectedDate);
    // Set date in form
    setFieldValue(props.name, selectedDate);

    // Send new time up to parent
    if (props.name == "start_time") {
      props.startTimeChange(selectedDate);
    } else {
      props.endTimeChange(selectedDate);
    }
  };

  const handleDatePress = () => {
    if (state === State.Date) {
      setState(State.Hidden);
    } else {
      setState(State.Date);
    }
  };

  const handleTimePress = () => {
    if (state === State.Time) {
      setState(State.Hidden);
    } else {
      setState(State.Time);
    }
  };

  return (
    <View>
      <View
        style={[
          sharedStyles.input,
          {
            justifyContent: "center",
            display: "flex",
          },
        ]}
      >
        <View style={{ flexDirection: "row" }}>
          <Text
            style={{ fontSize: 16, marginRight: "auto" }}
            onPress={handleDatePress}
          >
            {moment(date).format("dddd, MMM D")}
          </Text>
          <Text style={{ fontSize: 16 }} onPress={handleTimePress}>
            {moment(date).format(" h:mmA")}
          </Text>
        </View>
      </View>
      {state !== State.Hidden && (
        <DateTimePicker
          {...field}
          {...props}
          testID="dateTimePicker"
          value={date}
          mode={state === State.Time ? "time" : "date"}
          is24Hour={true}
          display="default"
          onChange={onChange}
          minuteInterval={5}
          minimumDate={new Date()}
        />
      )}
    </View>
  );
};

export default DatePicker;
