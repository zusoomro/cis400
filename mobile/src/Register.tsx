import React from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { Formik } from "formik";
import { register } from "./authSlice";
import { useDispatch } from "react-redux";
import sharedStyles from "./sharedStyles";

const Register: React.FC<{}> = () => {
  const dispatch = useDispatch();

  return (
    <SafeAreaView style={sharedStyles.container}>
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={(values) => {
          dispatch(register(values));
          console.log(values);
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View>
            <Text style={styles.heading}>Register</Text>
            <TextInput
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              placeholder="email"
              style={sharedStyles.input}
            />
            <TextInput
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              placeholder="password"
              style={sharedStyles.input}
              secureTextEntry
            />
            <Button
              accessibilityLabel="Submit"
              onPress={handleSubmit}
              title="Submit"
            />
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    backgroundColor: "white",
    marginBottom: 20,
    paddingHorizontal: 20,
    width: 300,
    height: 50,
    fontSize: 16,
    color: "black",
    borderRadius: 20,
  },
  heading: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 30,
  },
});

export default Register;
