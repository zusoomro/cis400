import React, { useState, useEffect } from "react";
import { Text, SafeAreaView, StyleSheet } from "react-native";
import { Card } from "react-native-elements";
import Event from "../types/Event";

interface EventProps {
  event: Event;
  navigation: {
    navigate: () => void;
  };
  showName: boolean;
}

const EventInSchedule: React.FC<EventProps> = ({
  event,
  navigation,
  showName,
}) => {
  const {
    name,
    start_time,
    end_time,
    notes,
    formattedAddress,
    id,
    ownerId,
  } = event;

  return (
    <SafeAreaView>
      <Card>
        <Card.Title>{name}</Card.Title>
        {/* inseert name stuff, if not toggledtouser add who section */}
        {showName && <Text style={styles.sub}>Who: {ownerId}</Text>}
        <Text style={styles.sub}>
          When:{" "}
          {new Date(start_time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          -{" "}
          {new Date(end_time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
        <Text style={styles.sub}>Where: {formattedAddress}</Text>
        <Text style={styles.sub}>Notes: {notes}</Text>
      </Card>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 80,
  },
  heading: {
    fontSize: 30,
    textAlign: "center",
    marginBottom: 20,
  },
  normal: {
    fontSize: 20,
    textAlign: "left",
    marginBottom: 20,
  },
  sub: {
    fontSize: 10,
    textAlign: "left",
    marginBottom: 10,
  },
  scheduleItem: {
    flex: 1,
    marginTop: 16,
    paddingVertical: 8,
    borderWidth: 4,
    borderColor: "#20232a",
    borderRadius: 6,
    backgroundColor: "#61dafb",
  },
});

export default EventInSchedule;
