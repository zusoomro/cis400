import React, { useState, useEffect } from "react";
import Button from "../shared/Button";
import { Text, SafeAreaView, StyleSheet, ScrollView, View } from "react-native";
import { useSelector } from "react-redux";
import { Card } from "react-native-elements";
import * as SecureStore from "expo-secure-store";

const ScheduleHomePage: React.FC<{}> = ({ navigation }) => {
  return (
    <SafeAreaView style={{ display: "flex", flexDirection: "column" }}>
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
  }, []);
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let yyyy = today.getFullYear();
  let todayString = mm + "/" + dd + "/" + yyyy;

  return (
    <View style={{}}>
      <ScrollView>
        <Text style={{ marginLeft: 10, marginTop: 20, fontSize: 24 }}>
          {todayString}
        </Text>
        {eventsForUser.map((event) => (
          <Event event={event} key={event.id}></Event>
        ))}
      </ScrollView>
    </View>
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
      <View style={styles.card}>
        <Text style={styles.title}>{name}</Text>
        <Text style={{ fontSize: 16 }}>
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
        <Text style={{ marginBottom: 10, fontSize: 16 }}>{address}</Text>
        <Text style={{ color: "#999" }}>{notes}</Text>
      </View>
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
    paddingTop: 80,
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
  card: {
    borderRadius: 10,
    backgroundColor: "#FFF",
    margin: 10,
    padding: 20,
    borderWidth: 1,
    borderColor: "#CCC",
  },
  title: {
    fontSize: 20,
    marginBottom: 5,
  },
});

export default ScheduleHomePage;
