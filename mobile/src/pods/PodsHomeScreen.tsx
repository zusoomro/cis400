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
  ActivityIndicator,
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
  const { loading } = useSelector((state: RootState) => state.pods);
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

  return loading ? (
    <View
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ActivityIndicator />
    </View>
  ) : (
    <SafeAreaView style={{ display: "flex", flex: 1 }}>
      <Text style={[sharedStyles.h1, { marginHorizontal: 15 }]}>Pods</Text>
      {firstPod == null ? (
        <View
          style={{
            display: "center",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
        >
          <Text
            style={{
              marginHorizontal: 30,
              marginBottom: 15,
              fontSize: 16,
              color: "#667EEA",
            }}
          >
            You're not part of a pod yet! Press the button below to create one.
          </Text>
          <Button
            title="Create a Pod"
            onPress={() => {
              navigation.navigate("CreatePod");
              return;
            }}
            style={{
              backgroundColor: "#5A67D8",
              marginHorizontal: 35,
              width: "auto",
            }}
          />
        </View>
      ) : (
        <React.Fragment>
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
      {modalVisible && invites && (
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
              <Text style={{ fontSize: 18, marginBottom: 15 }}>
                You've been invited to {invites![0].podName}!
              </Text>
              <View>
                <View style={styles.acceptRejectButtonContainer}>
                  <TouchableHighlight
                    onPress={handleAccptInvite}
                    style={{ flex: 1 }}
                  >
                    <View style={styles.acceptButton}>
                      <Text style={{ color: "#2F855A", fontSize: 16 }}>
                        Accept
                      </Text>
                    </View>
                  </TouchableHighlight>
                  <TouchableHighlight
                    onPress={handleRejectInvite}
                    style={{ flex: 1, marginLeft: 10 }}
                  >
                    <View style={styles.rejectButton}>
                      <Text style={{ color: "#9B2C2C", fontSize: 16 }}>
                        Reject
                      </Text>
                    </View>
                  </TouchableHighlight>
                </View>
              </View>

              <TouchableHighlight
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={{ color: "#5A67D8", textAlign: "center" }}>
                  Hide Modal
                </Text>
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
    backgroundColor: "#C6F6D5",
    borderWidth: 1,
    borderColor: "#2F855A",
    borderRadius: 5,
    padding: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  rejectButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FED7D7",
    borderColor: "#C53030",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  acceptRejectButtonContainer: {
    width: "100%",
    flexDirection: "row",
    marginBottom: 15,
  },
});

export default PodsHomeScreen;
