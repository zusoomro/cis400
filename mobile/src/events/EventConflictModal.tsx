import React from "react";
import {
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import moment from "moment";

import Event from "../types/Event";
import { createEventOnSubmit, modifyEventOnSubmit } from "./eventsService";
import { ProposedEventConflicts } from "./eventsService";

type Props = {
  conflictModalVisible: boolean;
  setConflictModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  values: Event;
  existingEvent: Event;
  navigation: {
    navigate: (screen: string) => void;
  };
  conflicts: ProposedEventConflicts;
};

export const EventConflictModal: React.FC<Props> = ({
  conflictModalVisible,
  setConflictModalVisible,
  values,
  existingEvent,
  navigation,
  conflicts,
}) => {

  const ConflictEventRow = ({
    title,
    conflictEvent,
  }: {
    title: string;
    conflictEvent: Event;
  }) => (
    <View>
      <Text style={{textAlign:'center'}}>{title}: {moment(conflictEvent.start_time).format(" h:mm")}-{moment(conflictEvent.end_time).format(" h:mmA")}</Text>
    </View>
  );

  const renderRow = ({ item }: { item: Event }) => (
    <ConflictEventRow title={item.name} conflictEvent={item} />
  );

  console.log(conflicts);

  return (
    <Modal animationType="none" visible={conflictModalVisible} transparent={true}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={{ padding: 15 }}>
            <Text style={styles.title}> Event Conflicts</Text>
            {/* SHOW CONFLICITNG EVENTS */}
            <SafeAreaView style={[styles.container]}>
              <FlatList
                style={{flexGrow : 0}}
                data={conflicts.conflictingEvents}
                renderItem={renderRow}
                keyExtractor={item => item.id.toString()}
              />
            </SafeAreaView>
            {/* <Text style={{ marginVertical: 10 }}>Suggested times</Text> */}
          </View>

          {/* Choose a suggested time */}
          {/* <TouchableOpacity style={styles.modalButton} onPress={() => {}}>
            <Text style={styles.modalButtonText}>Choose a Suggested Time</Text>
          </TouchableOpacity> */}

          {/* Return to editing the event*/}
          <TouchableOpacity
            onPress={() => {
              setConflictModalVisible(false);
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
  container: {
    flex: 0,
    marginTop: StatusBar.currentHeight || 0,
  },
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
