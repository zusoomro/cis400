import React from "react";
import {
  Modal,
  StyleSheet,
  View,
  TouchableHighlight,
  Text,
  Alert,
} from "react-native";
import Invite from "../types/Invite";
import { handleAcceptInvite, handleRejectInvite } from "./podService";
import { useDispatch } from "react-redux";
import { setPod } from "./podSlice";

type Props = {
  modalVisible: boolean;
  invites: Invite[];
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setInvites: React.Dispatch<React.SetStateAction<Invite[] | undefined>>;
};

const PodInviteModal: React.FC<Props> = ({
  setModalVisible,
  modalVisible,
  invites,
  setInvites,
}) => {
  const dispatch = useDispatch();

  if (invites) {
    setModalVisible(true);
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
      }}
    >
      <View style={styles.centeredView}>
        {invites ? (
          <View style={styles.modalView}>
            <Text style={{ fontSize: 18, marginBottom: 15 }}>
              You've been invited to {invites![0].podName}!
            </Text>
            <View>
              <View style={styles.acceptRejectButtonContainer}>
                <TouchableHighlight
                  onPress={() => {
                    handleAcceptInvite(invites[0].podId, invites[0].id).then(
                      (res) => {
                        dispatch(setPod(res));
                        setModalVisible(false);
                        invites?.shift();
                        setInvites([...invites]);
                      }
                    );
                  }}
                  style={{ flex: 1 }}
                >
                  <View style={styles.acceptButton}>
                    <Text style={{ color: "#2F855A", fontSize: 16 }}>
                      Accept
                    </Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight
                  onPress={() => {
                    handleRejectInvite(invites[0].id).then(() => {
                      setInvites([...invites]);
                      setModalVisible(false);
                    });
                  }}
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
        ) : (
          <View style={styles.modalView}>
            <View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: 40,
              }}
            >
              <Text style={{ fontSize: 18 }}>You have no pod invites :(</Text>
            </View>

            <View style={styles.acceptRejectButtonContainer}>
              <TouchableHighlight
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
                style={{ flex: 1 }}
              >
                <Text style={{ color: "#5A67D8", textAlign: "center" }}>
                  Hide Modal
                </Text>
              </TouchableHighlight>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  acceptRejectButtonContainer: {
    width: "100%",
    flexDirection: "row",
    marginBottom: 15,
  },
});

export default PodInviteModal;
