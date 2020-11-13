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
<<<<<<< variant A
import { useDispatch, useSelector } from "react-redux";
import { loadUserPods } from "./podSlice";
import SectionButton from "../shared/SectionButton";
import { RootState } from "../configureStore";
import { StackNavigationProp } from "@react-navigation/stack";
>>>>>>> variant B
import { Formik } from "formik";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import InviteUsers from "./InviteUsers";
======= end

interface Pod {
  id: number;
  ownerId: number;
  name: string;
}


interface Props {
  navigation: StackNavigationProp<any>;
}

interface Invite {
  id: number;
  inviterUserId: number;
  inviteeUserId: number;
  podId: number;
  podName: string;
}

const PodsHomeScreen: React.FC<Props> = ({ navigation }) => {
  const firstPod = useSelector((state: RootState) => state.pods.pods[0]);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(loadUserPods());

    async function fetchUsersInvites() {
      try {
        const authToken = await SecureStore.getItemAsync("wigo-auth-token");
        const res = await fetch("http://localhost:8000/invites", {
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            "x-auth-token": authToken!,
          },
        });

        const json = await res.json();
        const invitesList = json.invites;
        if (invitesList.length) {
          console.log("fetched invites", invitesList);
          setInvites(invitesList);
          setModalVisible(true);
        }
      } catch (err) {
        console.log("error loading invites for current user");
      }
    }
    fetchUsersInvites();
  }, []);

  async function handleRejectInvite() {
    const data = { id: invites![0].id };
    try {
      const res = await fetch("http://localhost:8000/invites/reject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.message == "success") {
        console.log("success rejecting invite");
      }
      setModalVisible(false);
      invites?.shift();
      setInvites([...invites]);
      //setInvites(invites);
    } catch (err) {
      console.log(err);
    }
  }

  const handleAccptInvite = async () => {
    const data = { podId: invites![0].podId, inviteId: invites![0].id };
    try {
      const res = await fetch("http://localhost:8000/invites/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "x-auth-token": (await SecureStore.getItemAsync("wigo-auth-token"))!,
        },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.pod) {
        setPod(json.pod);
      }
      setModalVisible(false);
      invites?.shift();
      setInvites([...invites]);
    } catch (error) {
      console.log(`error accepting invite`, error);
    }
  };

  React.useEffect(() => {
    setInvites(invites);
    if (invites?.length > 0) {
      setModalVisible(true);
    }
  }, [invites]);

  return (
    <SafeAreaView>
      <View>
        {firstPod == null ? (
          <Button
            title="Create New Pod"
            onPress={() => {
              navigation.navigate("CreatePod");
              return;
            }}
          />
        ) : (
          <React.Fragment>
            <Text style={[styles.h1, { marginLeft: 10, marginTop: 20 }]}>
              {firstPod?.name ? firstPod.name : "Your Pod"}
            </Text>
            <SectionButton
              title="Manage Members"
              onPress={() => navigation.navigate("ManageMembers")}
              style={{ marginTop: 10 }}
            />
          </React.Fragment>
        )}
        <Button
          title="Show Invites"
          onPress={() => {
            setModalVisible(true);
          }}
          disabled={invites == undefined || invites.length <= 0}
        ></Button>
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
                  You've been invites to Pod: {invites![0].podName}!
                </Text>
                <Text>
                  WARNING: If you are already in pod, accepting this invite will
                  replce your current pod!
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

const styles = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontWeight: "300",
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
    backgroundColor: "#27c20c",
    padding: 10,
  },
  rejectButton: {
    backgroundColor: "#d63024",

    padding: 10,
  },
  acceptRejectButtonContainer: {
    flexDirection: "row",
  },
});

export default PodsHomeScreen;
