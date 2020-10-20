import React from "react";
import { View, Text, TextInput, Button, SafeAreaView } from "react-native";
import { Formik } from "formik";
import { register } from "./authReducer";
import { useDispatch } from "react-redux";

const Register: React.FC<{}> = () => {
  const dispatch = useDispatch();

  return (
    <SafeAreaView>
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={(values) => {
          dispatch(register(values));
          console.log(values);
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View>
            <TextInput
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
            />
            <TextInput
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
            />

            <Button onPress={handleSubmit} title="Submit" />
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default Register;
