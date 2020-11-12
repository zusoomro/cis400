import React, { useState, useEffect } from "react";
import {
  Button,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { Card } from "react-native-elements";
import * as SecureStore from "expo-secure-store";
import Event from "../types/Event";

const ScheduleHomePage: React.FC<{}> = ({ navigation }) => {
  console.log("navigation", navigation);

  return (
    <SafeAreaView style={styles.container}>
      <Schedule navigation={navigation} />
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

const Schedule: React.FC<{}> = ({ navigation }) => {
  const [eventsForUser, setEventsForUser] = useState([]);
  let today = new Date();

  React.useEffect(() => {
    async function fetcher() {
      try {
        const authToken = await SecureStore.getItemAsync("wigo-auth-token");
        const res = await fetch("http://localhost:8000/events", {
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            "x-auth-token": authToken!,
          },
        });
        const json = await res.json();
        const returnedEvents = json.events;
        if (returnedEvents) {
          setEventsForUser(returnedEvents);
        }
      } catch (err) {
        console.log("ERROR: ", err);
        console.log("error loading events for current user");
      }
    }

    fetcher();
  }, [eventsForUser]);
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let yyyy = today.getFullYear();
  let todayString = mm + "/" + dd + "/" + yyyy;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>{todayString}</Text>
      <ScrollView>
        {eventsForUser.map((event) => (
          <EventForSchedulePage event={event} key={event.id} navigation={navigation} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

interface EventProps {
  event: Event;
  navigation: {
    navigate: () => void;
  };
}

const EventForSchedulePage: React.FC<EventProps> = ({ event, navigation }) => {
  const { name, start_time, end_time, notes, formattedAddress, id, ownerId } = event;

  return (
    <SafeAreaView>
      <Pressable onPress={() => navigation.navigate("ModifyEvent", { event })}>
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
          <Text style={styles.sub}>Where: {formattedAddress}</Text>
          <Text style={styles.sub}>Notes: {notes}</Text>
        </Card>
      </Pressable>
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
