import React, { useState, useEffect } from "react";
import Button from "../shared/Button";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Image,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import Nature from "../../assets/undraw_nature_m5ll.png";

const ScheduleHomePage: React.FC<{}> = ({ navigation }) => {
  return (
    <SafeAreaView
      style={{
        display: "flex",
        flex: 1,
        justifyContent: "space-between",
        flexDirection: "column",
      }}
    >
      <Schedule />
      <Button
        title="Create Event"
        onPress={() => {
          console.log("Create New Event button clicked");
          navigation.navigate("CreateEvent");
          return;
        }}
      />
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
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.sectionOne}>
          <Text
            style={{
              marginLeft: 10,
              marginVertical: 18,
              textAlign: "center",
              fontSize: 18,
              color: "#FFF",
            }}
          >
            Today, {todayString}
          </Text>
        </View>
        {eventsForUser.length > 0 ? (
          eventsForUser.map((event) => (
            <Event event={event} key={event.id}></Event>
          ))
        ) : (
          <View
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              marginTop: "auto",
              marginBottom: "auto",
            }}
          >
            <Image source={Nature} style={{ height: 200, width: 200 }}></Image>
            <Text style={{ color: "#3C366B" }}>
              You've got nothing else scheduled today!
            </Text>
          </View>
        )}
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
  sectionOne: {
    backgroundColor: "#434190",
  },
});

export default ScheduleHomePage;
