import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  StyleSheet,
  ScrollView,
} from "react-native";
import Button from "../shared/Button";
import { Formik } from "formik";
import * as SecureStore from "expo-secure-store";
import apiUrl from "../config";
import { setPod as reduxSetPod } from "./podSlice";
import sharedStyles from "../sharedStyles";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import LocationPicker from "../events/LocationPicker";

interface Pod {
  id: number;
  ownerId: number;
  name: string;
  homeAddress: string;
  lat: number;
  lng: number;
}

interface Props {
  navigation: {
    navigate: (screen: string, data: { pod: Pod }) => void;
  };
}

const CreatePod: React.FC<Props> = ({ navigation, route }) => {
  const [pod, setPod] = useState<Pod>();
  const [invitees, setInvitees] = useState([]);
  const loading = useSelector((state) => state.pods.loading);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (route.params?.invitees) {
      const invites: Array<number> = route.params.invitees;
      setInvitees(invites);
    }
  }, [route.params?.invitees]);

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      {loading ? (
        <View />
      ) : (
        <Formik
          initialValues={{ podname: "", homeAddress: "", lat: "", lng: "" }}
          validationSchema={validatePodSchema}
          onSubmit={async (values) => {
            const res: Pod = await createPodOnSubmit(values, invitees);
            const json = await res.json();
            if (res.status == 400) {
              console.log(
                "pod creation unsuccessful. received error message:",
                json.message
              );
            } else {
              console.log("pods creation successful");
              const pod = json;
              if (pod) {
                dispatch(reduxSetPod(pod));
                setPod(pod);
              }
              navigation.navigate("PodsHomeScreen", { pod: pod });
            }
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            isValid,
            touched,
          }) => (
            <View>
              <Text style={sharedStyles.inputLabelText}>Pod Name</Text>
              <TextInput
                onChangeText={handleChange("podname")}
                onBlur={handleBlur("podName")}
                value={values.podname}
                placeholder="The Homies"
                style={sharedStyles.input}
              />
              {errors.podname && touched.podname && (
                <Text style={sharedStyles.inputError}>{errors.podname}</Text>
              )}
              <Text style={sharedStyles.inputLabelText}>Home Address</Text>
              <LocationPicker
                latFieldName="lat"
                lngFieldName="lng"
                formattedAddressFieldName="homeAddress"
                formattedAddress={values.homeAddress}
                destinationPicker={true}
              />
              {/* the line below is wonky take a look */}
              <Text style={sharedStyles.inputError}>
                {touched.homeAddress && errors.homeAddress
                  ? (errors.homeAddress as String)
                  : ""}
              </Text>
              <Button
                title="Invite Users to Pod"
                onPress={() => {
                  navigation.navigate("InviteUsers", {
                    caller: "CreatePod",
                  });
                  return;
                }}
              />
              <Button
                onPress={handleSubmit}
                title="Submit"
                disabled={!isValid}
              />
            </View>
          )}
        </Formik>
      )}
    </ScrollView>
  );
};

const createPodOnSubmit = async (values, invitees) => {
  const data = {
    name: values.podname,
    homeAddress: values.homeAddress,
    lat: values.lat,
    lng: values.lng,
    inviteeIds: invitees,
  };
  try {
    const res = await fetch(`${apiUrl}/pods`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "x-auth-token": (await SecureStore.getItemAsync("wigo-auth-token"))!,
      },
      body: JSON.stringify(data),
    });
    return res;
  } catch (error) {
    console.log(`error creating pod`, error);
    return null;
  }
};

const validatePodSchema = () => {
  return Yup.object().shape({
    podname: Yup.string()
      .min(3, ({ min }) => "Pod name must be at least 3 characters")
      .required("Pod name required"),
    homeAddress: Yup.string().required("Pod home address required"),
  });
};

const styles = StyleSheet.create({
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

export default CreatePod;
