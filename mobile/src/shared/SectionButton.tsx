import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";

interface Props {
  title: string;
  onPress: () => void;
  style?: {};
}

const SectionButton: React.FC<Props> = ({ title, onPress, style }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#FFF",
    padding: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#667EEA",
  },
});

export default SectionButton;
