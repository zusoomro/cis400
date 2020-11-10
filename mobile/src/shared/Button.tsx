import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import React from "react";

interface Props {
  title: string;
  loading?: boolean;
  onPress: () => void;
}

const Button: React.FC<Props> = ({ title, loading, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#4C51BF",
    padding: 10,
    margin: 10,
    borderRadius: 10,

    // Shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    textAlign: "center",
  },
});

export default Button;
