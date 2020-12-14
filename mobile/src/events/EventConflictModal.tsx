import React from "react";
import {
  TouchableOpacity,
  Modal,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Event from "../types/Event";
import { createEventOnSubmit, modifyEventOnSubmit } from "./eventsService";

type Props = {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  values: Event;
  existingEvent: Event;
  navigation: {
    navigate: (screen: string) => void;
  };
};

export const EventConflictModal: React.FC<Props> = ({
  modalVisible,
  setModalVisible,
  values,
  existingEvent,
  navigation,
}) => {
  return (
    <Modal animationType="none" visible={modalVisible} transparent={true}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={{ padding: 15 }}>
            <Text style={styles.title}> Event Conflicts</Text>
            <Text>This event will conflict with Event it conflicts with</Text>
            {/* SHOW CONFLICITNG EVENTS */}
            <Text style={{ marginVertical: 10 }}>Suggested times</Text>
          </View>

          {/* Choose a suggested time */}
          <TouchableOpacity style={styles.modalButton} onPress={() => {}}>
            <Text style={styles.modalButtonText}>Choose a Suggested Time</Text>
          </TouchableOpacity>

          {/* Return to editing the event*/}
          <TouchableOpacity
            onPress={() => {
              setModalVisible(false);
            }}
            style={styles.modalButton}
          >
            <Text style={styles.modalButtonText}>Back To Editing</Text>
          </TouchableOpacity>

          {/* schedule the event anyway */}
          <TouchableOpacity
            onPress={() => {
              if (existingEvent) {
                modifyEventOnSubmit({
                  ...values,
                  id: existingEvent.id,
                } as Event);
              } else {
                createEventOnSubmit(values as Event);
              }
              navigation.navigate("ScheduleHomePage");
            }}
            style={styles.modalButton}
          >
            <Text style={styles.cancelModalButtonText}>Schedule Event</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 25,
    paddingBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  modalButton: {
    borderTopColor: "#DCDCDC",
    borderBottomColor: "#DCDCDC",
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  modalButtonText: {
    textAlign: "center",
    margin: 8,
    fontSize: 18,
    color: "#007AFF",
  },
  cancelModalButtonText: {
    textAlign: "center",
    margin: 8,
    fontSize: 18,
    color: "#FF0000",
  },
});
