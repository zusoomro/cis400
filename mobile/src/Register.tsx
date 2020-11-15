import React from "react";
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Button from "./shared/Button";
import { Formik } from "formik";
import { register } from "./authSlice";
import { useDispatch, useSelector } from "react-redux";
import sharedStyles from "./sharedStyles";

const Register: React.FC<{}> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
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
              <Text
                style={{
                  fontFamily: "BebasNeue_400Regular",
                  fontSize: 64,
                  textAlign: "center",
                  color: "#5A67D8",
                }}
              >
                WIGO
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  textAlign: "center",
                  color: "#5A67D8",
                  marginBottom: 24,
                }}
              >
                #Letsride
              </Text>
              <TextInput
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                placeholder="email"
                style={sharedStyles.input}
                autoCapitalize="none"
              />
              <TextInput
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                placeholder="password"
                style={sharedStyles.input}
                secureTextEntry
              />
              {loading ? (
                <ActivityIndicator />
              ) : (
                <View>
                  <Button
                    accessibilityLabel="Submit"
                    style={{ backgroundColor: "#667EEA" }}
                    onPress={handleSubmit}
                    title="Register"
                  />
                </View>
              )}

              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 16,
                    color: "#7F9CF5",
                  }}
                >
                  Have an account? Login here.
                </Text>
              </TouchableOpacity>
              {error && <Text>{JSON.stringify(error)}</Text>}
            </View>
          )}
        </Formik>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    margin: 15,
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
