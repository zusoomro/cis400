import React from "react";
import { styles } from "./Register";
import { View, Text, TextInput, Button, SafeAreaView } from "react-native";
import { Formik } from "formik";
import { useDispatch } from "react-redux";
import { login } from "./authReducer";

const Login: React.FC<{}> = () => {
  const dispatch = useDispatch();

  return (
    <SafeAreaView style={styles.container}>
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={(values) => {
          dispatch(login(values));
          console.log(values);
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View>
            <Text style={styles.heading}>Login</Text>
            <TextInput
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              placeholder="email"
              style={styles.input}
            />
            <TextInput
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              placeholder="password"
              style={styles.input}
              secureTextEntry
            />
            <Button onPress={handleSubmit} title="Submit" />
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default Login;
