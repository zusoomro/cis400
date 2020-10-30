import React, { useState, useEffect } from "react";
import {
  Button,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useSelector } from "react-redux";
import { Card } from "react-native-elements";
import * as SecureStore from "expo-secure-store";

const ScheduleHomePage: React.FC<{}> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Schedule />
      <Button
        title="Create Event"
        onPress={() => {
          console.log("Create New Event button clicked");
          navigation.navigate("CreateEvent");
          return;
        }}
      ></Button>
    </SafeAreaView>
  );
};

const Schedule: React.FC<{}> = () => {
  const [eventsForUser, setEventsForUser] = useState([]);
  let today = new Date();

  React.useEffect(() => {
    async function fetcher() {
      try {
        const authToken = await SecureStore.getItemAsync("wigo-auth-token");
        const res = await fetch(
          'http://localhost:8000/events',
          {
            headers: {
              "Content-Type": "application/json;charset=utf-8",
              "x-auth-token": authToken!,
            },
          }
        );
        const json = await res.json();
        const returnedEvents = json.events;
        if (returnedEvents) {
          setEventsForUser(returnedEvents);
        }
      } catch (err) {
        console.log("ERROR: ", err)
        console.log('error loading events for current user');
      }
    };

    fetcher();
  }, []);
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let yyyy = today.getFullYear();
  let todayString = mm + "/" + dd + "/" + yyyy;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>{todayString}</Text>
      <ScrollView>
        {eventsForUser.map((event) => (
          <Event event={event} key={event.id}></Event>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const Event: React.FC<{
  event: {
    name: string;
    start_time: Date;
    end_time: Date;
    notes: string;
    address: string;
    id: number;
    ownerId: number;
  };
}> = ({
  event: {
    name = "Placeholder",
    start_time,
    end_time,
    notes,
    address,
    id,
    ownerId,
  },
}) => {
  return (
    <SafeAreaView>
      <Card>
        <Card.Title>{name}</Card.Title>
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
        <Text style={styles.sub}>Where: {address}</Text>
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

export default ScheduleHomePage;