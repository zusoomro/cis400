import React, { useState, useEffect } from "react";
import {
  Button,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Switch,
  Pressable,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import Event from "../types/Event";
import EventInSchedule from "./EventInSchedule";
import { useSelector } from "react-redux";

interface Pod {
  id: number;
  ownerId: number;
  name: string;
}

const ScheduleHomePage: React.FC<{}> = ({ navigation }) => {
  const [isToggledToUser, setIsToggledToUser] = useState(true);

  const toggleSwitch = () =>
    setIsToggledToUser((previousState) => !previousState);

  return (
    <SafeAreaView style={styles.container}>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isToggledToUser ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isToggledToUser}
      />
      <Schedule isToggledToUser={isToggledToUser} navigation={navigation} />
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

const Schedule: React.FC<{}> = ({ isToggledToUser, navigation }) => {
  const [events, setEvents] = useState([]);
  const [pod, setPod] = useState<Pod>();
  const authToken = useSelector((state) => state.auth.token);
  const today = new Date();

  React.useEffect(() => {
    fetchPod(setPod, authToken);
  }, []);

  React.useEffect(() => {
    if (isToggledToUser) {
      fetchUserSchedule(setEvents, authToken);
    } else {
      fetchPodSchedule(setPod, setEvents, pod, authToken);
    }
  }, [isToggledToUser, pod]);

  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  const todayString = mm + "/" + dd + "/" + yyyy;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>{todayString}</Text>
      <ScrollView>
        {events.map((event: Event) => (
          <EventInSchedule
            event={event}
            showName={!isToggledToUser}
            navigation={navigation}
            key={event.id}
          ></EventInSchedule>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const fetchUserSchedule = async (setEvents, authToken) => {
  try {
    const res = await fetch("http://localhost:8000/events", {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "x-auth-token": authToken!,
      },
    });
    const json = await res.json();
    const returnedEvents = json.events;
    if (returnedEvents) {
      setEvents(returnedEvents);
    }
  } catch (err) {
    console.log("ERROR1: ", err);
    console.log("error loading events for current user");
  }
};

const fetchPodSchedule = async function (setPod, setEvents, pod, authToken) {
  console.log("pod", pod);
  try {
    const res = await fetch(`http://localhost:8000/events/${pod.id}`, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "x-auth-token": authToken!,
      },
    });

    const json = await res.json();
    const returnedEvents = json.events;
    if (returnedEvents) {
      setEvents(returnedEvents);
    }
  } catch (err) {
    console.log("ERROR2: ", err);
    console.log("error loading pod for current user");
  }
};

const fetchPod = async (setPod, authToken) => {
  try {
    const resPod = await fetch("http://localhost:8000/pods/currUsersPod", {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "x-auth-token": authToken!,
      },
    });

    const jsonPod = await resPod.json();
    const returnedPod = jsonPod.pod;
    console.log("setting pod", returnedPod.id);
    setPod(returnedPod);
  } catch (err) {
    console.error("fetchpod error");
  }
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 20,
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
