import React from "react";
import { styles } from "./Register";
import {
  View,
  Text,
  TextInput,
  Button,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./authSlice";
import { RootState } from "./configureStore";

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
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
                textContentType="username"
                autoCapitalize="none"
              />
              <TextInput
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                placeholder="password"
                style={styles.input}
                secureTextEntry
                textContentType="password"
              />
              {loading ? (
                <ActivityIndicator />
              ) : (
                <Button
                  accessibilityLabel="Submit"
                  onPress={handleSubmit}
                  title="Submit"
                />
              )}
              {error && <Text>{JSON.stringify(error)}</Text>}
            </View>
          )}
        </Formik>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Login;
