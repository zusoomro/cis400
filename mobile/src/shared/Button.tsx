import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  StyleProp,
} from "react-native";
import React from "react";

interface Props {
  title: string;
  loading?: boolean;
  onPress: () => void;
  style?: StyleProp<any>;
  textStyle?: StyleProp<any>;
  testID?: string
}

const Button: React.FC<Props> = ({
  title,
  loading,
  onPress,
  style,
  textStyle,
  testID
}) => {
  return (
    <TouchableOpacity testID={testID} onPress={onPress} style={[styles.button, style]}>
      {loading ? (
        <ActivityIndicator />
      ) : (
          <Text style={[styles.buttonText, textStyle]}>{title}</Text>
        )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#4C51BF",
    padding: 10,
    marginTop: 0,
    marginBottom: 15,
    borderRadius: 10,
    width: "100%",

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
