import React from "react";
import {
  Modal,
  StyleSheet,
  View,
  TouchableHighlight,
  Text,
  Alert,
} from "react-native";
import Event from "../types/Event";
import { handleDeleteEvent } from "./eventsService";
import { deleteEvent } from "./eventsSlice";
import { useDispatch } from "react-redux";

type Props = {
  deleteModalVisible: boolean;
  event: Event;
  setDeleteModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  navigation: {
    navigate: (screen: string) => void;
  };
};

const DeleteEventModal: React.FC<Props> = ({
  setDeleteModalVisible,
  deleteModalVisible,
  event,
  navigation,
}) => {
  const dispatch = useDispatch();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={deleteModalVisible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={{ fontSize: 18, marginBottom: 15 }}>
            Are you sure you want to delete this event?
          </Text>
          <View>
            <View style={styles.acceptRejectButtonContainer}>
              <TouchableHighlight
                onPress={() => {
                  handleDeleteEvent(event).then(() => {
                    setDeleteModalVisible(false);
                    dispatch(deleteEvent(event));
                    navigation.navigate("ScheduleHomePage");
                  });
                }}
                style={{ flex: 1 }}
              >
                <View style={styles.rejectButton}>
                  <Text style={{ color: "#9B2C2C", fontSize: 16 }}>Delete</Text>
                </View>
              </TouchableHighlight>
              <TouchableHighlight
                onPress={() => {
                  setDeleteModalVisible(false);
                }}
                style={{ flex: 1, marginLeft: 10 }}
              >
                <View style={styles.acceptButton}>
                  <Text style={{ color: "#2F855A", fontSize: 16 }}>Cancel</Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </View>
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

export default DeleteEventModal;
