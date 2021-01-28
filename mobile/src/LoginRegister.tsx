import React from "react";
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Button from "./shared/Button";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { login, register } from "./authSlice";
import { RootState } from "./configureStore";
import sharedStyles from "./sharedStyles";
import { generateAndUploadPushNotificationToken } from "./pushNotifications/pushNotifications";

type AuthComponentProps = {
  isLogin?: boolean;
};

const LoginRegister: React.FC<AuthComponentProps> = ({
  navigation,
  isLogin,
}) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          margin: 45,
        }}
      >
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={(values) => {
            if (isLogin) {
              dispatch(login(values));
            } else {
              dispatch(register(values));
            }
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
                textContentType="username"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TextInput
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                placeholder="password"
                style={sharedStyles.input}
                secureTextEntry
                textContentType="password"
                autoCorrect={false}
              />
              {loading ? (
                <ActivityIndicator />
              ) : (
                <Button
                  testID="Submit"
                  style={{ backgroundColor: "#667EEA" }}
                  onPress={handleSubmit}
                  title={isLogin ? "Login" : "Register"}
                />
              )}
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(isLogin ? "Register" : "Login")
                }
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 16,
                    color: "#7F9CF5",
                  }}
                >
                  {isLogin
                    ? "Need an account? Register here."
                    : "Have an account? Login here."}
                </Text>
              </TouchableOpacity>
              {error && !!Object.entries(error).length && (
                <Text
                  style={{
                    marginTop: 15,
                    textAlign: "center",
                    color: "red",
                    fontSize: 16,
                  }}
                >
                  {error}
                </Text>
              )}
            </View>
          )}
        </Formik>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default LoginRegister;
