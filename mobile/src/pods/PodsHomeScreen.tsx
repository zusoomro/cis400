import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Button,
  TextInput,
  Modal,
  Alert,
  TouchableHighlight,
} from "react-native";
import { Formik } from "formik";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";

interface Pod {
  id: number;
  ownerId: number;
  name: string;
}

interface Invite {
  id: number;
  inviterUserId: number;
  inviteeUserId: number;
  podId: number;
}

const PodsHomeScreen = ({ navigation, route }) => {
  // Holds pod of current user -- undefined if no user exists
  const [pod, setPod] = useState<Pod>();
  const [invites, setInvites] = useState<Array<Invite>>();
  const [modalVisible, setModalVisible] = useState(false);

  React.useEffect(() => {
    if (route.params?.pod) {
      setPod(route.params.pod);
    }
  }, [route.params?.pod]);

  React.useEffect(() => {
    async function fetchUsersPod() {
      try {
        const authToken = await SecureStore.getItemAsync("wigo-auth-token");
        const res = await fetch("http://localhost:8000/pods/currUsersPod", {
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            "x-auth-token": authToken!,
          },
        });

        const json = await res.json();
        const returnedPod = json.pod;
        if (returnedPod) {
          setPod(returnedPod);
        }
      } catch (err) {
        console.log("error loading pod for current user");
      }
    }

    async function fetchUsersInvites() {
      try {
        const authToken = await SecureStore.getItemAsync("wigo-auth-token");
        const res = await fetch(
          "http://localhost:8000/invites/currUsersInvites",
          {
            headers: {
              "Content-Type": "application/json;charset=utf-8",
              "x-auth-token": authToken!,
            },
          }
        );

        const json = await res.json();
        const invitesList = json.invites;
        console.log("invites:", await invitesList);
        if (invitesList.length) {
          setInvites(invitesList);
          setModalVisible(true);
        }
      } catch (err) {
        console.log("error loading invites for current user");
      }
    }

    fetchUsersPod();
    fetchUsersInvites();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        {pod == null ? (
          <Button
            title="Create New Pod"
            onPress={() => {
              navigation.navigate("CreatePod");
              return;
            }}
          ></Button>
        ) : (
          <Text>Pod Name: {pod.name} </Text>
        )}
        {modalVisible && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>
                  You've been invites to Pod: {invites![0].podId}!
                </Text>
                <View style={styles.acceptRejectButtonContainer}>
                  <TouchableHighlight onPress={handleAccptInvite}>
                    <View style={styles.acceptButton}>
                      <Text>Accept</Text>
                    </View>
                  </TouchableHighlight>
                  <TouchableHighlight onPress={handleRejectInvite}>
                    <View style={styles.rejectButton}>
                      <Text>Reject</Text>
                    </View>
                  </TouchableHighlight>
                </View>

                <TouchableHighlight
                  style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}
                >
                  <Text style={styles.textStyle}>Hide Modal</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </SafeAreaView>
  );
};

// function should
// 1. accept invite and add user as a member of the pod
// 2. remove invite from PodInvites table
// 3. pop invite off the invites list
// 4. Hide modal
function handleAccptInvite() {
  console.log("accept invite pressed");
}

// function should
// 1. reject invite and delete invite in the database
// 2. pop invite off the invities list
// 3. hide modal
function handleRejectInvite() {
  console.log("reject invite pressed");
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
  },
  acceptButton: {
    backgroundColor: "#d63024",
    padding: 10,
  },
  rejectButton: {
    backgroundColor: "#27c20c",
    padding: 10,
  },
  acceptRejectButtonContainer: {
    flexDirection: "row",
  },
});

export default PodsHomeScreen;
