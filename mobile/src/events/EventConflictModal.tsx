import React, { useEffect, useState } from "react";
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

import Event, { Priority } from "../types/Event";
import { createEventOnSubmit, modifyEventOnSubmit } from "./eventsService";
import {
  ProposedEventConflicts,
  ConflictBuffer,
  SuggestedTime,
} from "./eventConflictService";
import { sendPushNotification } from "../pushNotifications/pushNotifications";

import { useDispatch } from "react-redux";
import { changeEvent as reduxChangeEvent } from "./eventsSlice";

type Props = {
  conflictModalVisible: boolean;
  setConflictModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  values: Event;
  existingEvent: Event;
  navigation: {
    navigate: (screen: string) => void;
  };
  conflicts: ProposedEventConflicts;
  suggestedTimes: SuggestedTime[];
};

type ConflictingEvent = {
  event: Event;
  // conflictBuffer will not be null if the event conflicts with the proposal due to buffers
  conflictBuffer: ConflictBuffer | null;
};

export const EventConflictModal: React.FC<Props> = ({
  conflictModalVisible,
  setConflictModalVisible,
  values,
  existingEvent,
  navigation,
  conflicts,
  suggestedTimes,
}) => {
  const sortedSuggestedTimes = suggestedTimes.sort((time1, time2) => {
    return moment(time1.start).valueOf() - moment(time2.start).valueOf();
  });

  // Creates/modifies event after a time is picked the event is scheduled anyway
  const scheduleEvent = () => {
    if (existingEvent) {
      modifyEventOnSubmit({
        ...values,
        id: existingEvent.id,
      } as Event).then((res) => {
        dispatch(reduxChangeEvent(res.eventForReturn[0]));
      });
    } else {
      createEventOnSubmit(values as Event).then((res) => {
        dispatch(reduxChangeEvent(res));
      });
    }
    navigation.navigate("ScheduleHomePage");
  };

  const dispatch = useDispatch();
  // Create conflicting events array from conflicts.conflictingEvents
  const conflictingEvents: ConflictingEvent[] = conflicts.conflictingEvents.map(
    (event: Event) => {
      const conflictBuffer = conflicts.conflictingBuffers.find(
        (buffer) => buffer.otherEventId == event.id
      );
      return {
        event: event,
        conflictBuffer: conflictBuffer ? conflictBuffer : null,
      };
    }
  );

  return (
    <Modal
      animationType="none"
      visible={conflictModalVisible}
      transparent={true}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={{ padding: 15 }}>
            <Text style={styles.title}> Event Conflicts</Text>
            {/* SHOW CONFLICITNG EVENTS */}
            <SafeAreaView style={[styles.container]}>
              <FlatList
                style={{ flexGrow: 0 }}
                data={conflictingEvents}
                renderItem={renderRow}
                keyExtractor={(item) => item.event.id.toString()}
              />
            </SafeAreaView>
          </View>

          {/* Choose a suggested time */}
          <SafeAreaView>
            {suggestedTimes.length != 0 && (
              <Text style={styles.subtitle}>Schedule at a Suggested Time</Text>
            )}
            <FlatList
              style={{ flexGrow: 0 }}
              data={sortedSuggestedTimes}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    values.start_time = moment(item.start).toDate();
                    values.end_time = moment(item.end).toDate();
                    scheduleEvent();
                  }}
                  style={styles.modalButton}
                >
                  <Text style={{ textAlign: "center", padding: 5 }}>
                    {moment(item.start).format(" h:mm")}-
                    {moment(item.end).format("h:mmA")}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(_, index) => index.toString()}
            />
          </SafeAreaView>

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
              // Send push notiifcations
              conflictingEvents.forEach((conflict) => {
                sendPushNotification({
                  recipientId: conflict.event.ownerId,
                  eventId: conflict.event.id,
                });
              });

              scheduleEvent();
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

// Row representing a conflict event row in the flat list
const ConflictEventRow = ({
  title,
  conflictEvent,
  conflictBuffer,
}: {
  title: string;
  conflictEvent: Event;
  conflictBuffer: ConflictBuffer | null;
}) => (
  <View style={{ flexDirection: "row" }}>
    <Text style={{ fontWeight: "bold" }}>{title}:</Text>
    <Text>({Priority[conflictEvent.priority]})</Text>
    <Text style={{ textAlign: "center" }}>
      {moment(conflictEvent.start_time).format(" h:mm")}-
      {moment(conflictEvent.end_time).format("h:mmA")}
    </Text>
    {conflictBuffer && (
      <Text style={styles.travelTimeText}> (Travel Time) </Text>
    )}
  </View>
);

const renderRow = ({ item }: { item: ConflictingEvent }) => (
  <ConflictEventRow
    title={item.event.name}
    conflictEvent={item.event}
    conflictBuffer={item.conflictBuffer}
  />
);

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
  travelTimeText: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#4285F4",
  },
  title: {
    fontSize: 25,
    paddingBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginVertical: 10,
    paddingHorizontal: 10,
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
