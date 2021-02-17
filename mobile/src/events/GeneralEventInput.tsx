import React from "react";
import { View, Text } from "react-native";
import sharedStyles from "../sharedStyles";

/**
 * General Event Input is a component that
 * wraps a header, a customized input, and
 * and error message.
 */

type GeneralEventInputProps = {
  inputTitle: string;
  GeneralInputComponent: JSX.Element | React.FC;
  error: String;
};

export const GeneralEventInput: React.FC<GeneralEventInputProps> = ({
  inputTitle,
  GeneralInputComponent,
  error,
}) => {
  return (
    <View>
      <Text style={sharedStyles.inputLabelText}>{inputTitle}</Text>
      {GeneralInputComponent}
      <Text style={sharedStyles.inputError}>{error}</Text>
    </View>
  );
};

export default GeneralEventInput;
