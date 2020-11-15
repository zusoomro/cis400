import React, { useState, useEffect } from "react";
import { Text, SafeAreaView, StyleSheet, View, Image } from "react-native";
import { Card } from "react-native-elements";
import Event from "../types/Event";
import sharedStyles from "../sharedStyles";
import { useSelector } from "react-redux";
import { RootState } from "../configureStore";

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
  const { avatar } = useSelector((state: RootState) => state.auth.user);

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
    <View
      style={[
        {
          padding: 15,
          backgroundColor: "#FFF",
          margin: 15,
          marginTop: 0,
          borderRadius: 10,
          display: "flex",
          flexDirection: "row",
        },
        sharedStyles.shadow,
      ]}
    >
      <Image
        source={{ uri: avatar }}
        style={{
          width: 50,
          height: 50,
          marginRight: 15,
          borderRadius: 100,
        }}
      />
      <View>
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 5 }}>
          {name}
        </Text>
        {showName && <Text style={styles.sub}>Who: {ownerId}</Text>}
        <Text style={{ color: "#718096", marginBottom: 5 }}>
          {generateDateString(event)}
        </Text>
        <Text style={{ color: "#319795", marginBottom: 5 }}>
          {formattedAddress}
        </Text>
        <Text style={{ color: "#4A5568" }}>{notes}</Text>
      </View>
    </View>
  );
};

const generateDateString = (event: Event): string => {
  return `${new Date(event.start_time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })} - ${new Date(event.end_time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
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
    fontSize: 14,
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
