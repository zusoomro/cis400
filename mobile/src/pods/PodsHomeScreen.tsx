import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../configureStore";
import { TabNavigatorParamList } from "../Navigator";
import Button from "../shared/Button";
import sharedStyles from "../sharedStyles";
import Invite from "../types/Invite";
import Pod from "../types/Pod";
import {
  fetchUsersInvites,
  handleAcceptInvite,
  handleRejectInvite,
} from "./podService";
import { loadUserPods, setPod } from "./podSlice";
import PodInviteModal from "./PodInviteModal";

type Props = {
  navigation: StackNavigationProp<TabNavigatorParamList, "Pods">;
  route: RouteProp<TabNavigatorParamList, "Pods">;
};

const PodsHomeScreen: React.FC<Props> = ({ navigation }) => {
  const pod = useSelector((state: RootState) => state.pods.pod);
  const { loading } = useSelector((state: RootState) => state.pods);
  const [invites, setInvites] = useState<Invite[]>();
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(loadUserPods());

    fetchUsersInvites().then((invites) => {
      setInvites(invites);
      setModalVisible(true);
    });
  }, []);

  React.useEffect(() => {
    setInvites(invites);
    if (invites && invites.length > 0) {
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
      {pod == null ? (
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
            <PodVisual pod={pod} />
            <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 5 }}>
              {pod?.name ? pod.name : "Your Pod"}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("PodMembers")}>
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
            <TouchableOpacity
              onPress={() => navigation.navigate("PodAnalytics")}
            >
              <Text style={{ fontSize: 16, color: "#667EEA", marginBottom: 5 }}>
                Pod Analytics
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
        <PodInviteModal
          modalVisible={modalVisible}
          invites={invites}
          setModalVisible={setModalVisible}
          setInvites={setInvites}
        />
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
});

export default PodsHomeScreen;
