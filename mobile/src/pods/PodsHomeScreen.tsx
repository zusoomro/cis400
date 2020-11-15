import Button from "../shared/Button";
import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Modal,
  Alert,
  TouchableHighlight,
  Image,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setPod, loadUserPods } from "./podSlice";
import SectionButton from "../shared/SectionButton";
import { RootState } from "../configureStore";
import { StackNavigationProp } from "@react-navigation/stack";
import * as SecureStore from "expo-secure-store";
import Pod from "../types/Pod";
import { RouteProp } from "@react-navigation/native";
import { TabNavigatorParamList } from "../Navigator";
import Invite from "../types/Invite";
import apiUrl from "../config";
import sharedStyles from "../sharedStyles";

type Props = {
  navigation: StackNavigationProp<TabNavigatorParamList, "Pods">;
  route: RouteProp<TabNavigatorParamList, "Pods">;
};

const PodsHomeScreen: React.FC<Props> = ({ navigation }) => {
  const firstPod = useSelector((state: RootState) => state.pods.pods[0]);
  const [invites, setInvites] = useState<Invite[]>();
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(loadUserPods());

    async function fetchUsersInvites() {
      try {
        const authToken = await SecureStore.getItemAsync("wigo-auth-token");
        const res = await fetch(`${apiUrl}/invites`, {
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
      const res = await fetch(`${apiUrl}/invites/reject`, {
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
      if (invites) {
        invites.shift();
        setInvites([...invites]);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handleAccptInvite = async () => {
    const data = { podId: invites![0].podId, inviteId: invites![0].id };
    try {
      const res = await fetch(`${apiUrl}/invites/accept`, {
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
    <SafeAreaView style={{ display: "flex", flex: 1 }}>
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
          <Text style={[sharedStyles.h1, { marginHorizontal: 15 }]}>Pods</Text>
          <View
            style={[
              {
                margin: 15,
                marginTop: 0,
                padding: 15,
                backgroundColor: "#FFF",
                borderRadius: 15,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
              sharedStyles.shadow,
            ]}
          >
            <PodVisual pod={firstPod} />
            <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 5 }}>
              {firstPod?.name ? firstPod.name : "Your Pod"}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("ManageMembers")}
            >
              <Text style={{ fontSize: 16, color: "#667EEA", marginBottom: 5 }}>
                Manage Members
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("ResolveConflicts")}
            >
              <Text style={{ fontSize: 16, color: "#667EEA", marginBottom: 5 }}>
                Resolve Conflicts
              </Text>
            </TouchableOpacity>
          </View>
        </React.Fragment>
      )}
      <Button
        title="Show Invites"
        onPress={() => {
          setModalVisible(true);
        }}
        style={{
          position: "absolute",
          bottom: 0,
          left: 15,
          right: 15,
          width: "auto",
        }}
        disabled={invites == undefined || invites.length <= 0}
      />
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
    </SafeAreaView>
  );
};

const PodVisual: React.FC<{ pod: Pod }> = ({ pod }) => {
  const { user } = useSelector((state: RootState) => state.auth);

  console.log("user", user);

  return user ? (
    <Image
      style={{ height: 125, width: 125, borderRadius: 1000, marginBottom: 15 }}
      source={{ uri: user.avatar }}
    />
  ) : (
    <View />
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
