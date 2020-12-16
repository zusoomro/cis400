import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import apiUrl from "../config";
import { setEvents as reduxSetEvents } from "./eventsSlice";
import sharedStyles from "../sharedStyles";
import Event from "../types/Event";
import EventInSchedule from "./EventInSchedule";
import Pod from "../types/Pod";
import { useDispatch, useSelector } from "react-redux";

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
      <Schedule navigation={navigation} />
      <TouchableOpacity
        style={[
          {
            position: "absolute",
            bottom: 15,
            right: 15,
            height: 50,
            width: 50,
            borderRadius: 100,
            backgroundColor: "#5A67D8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
          sharedStyles.shadow,
        ]}
        onPress={() => {
          console.log("Create New Event button clicked");
          navigation.navigate("CreateEvent");
          return;
        }}
      >
        <Ionicons name="md-create" size={24} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const Schedule: React.FC<{}> = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [map, setMap] = useState([]);
  const [podEvents, setPodEvents] = useState([]);
  const [pod, setPod] = useState<Pod>();
  const [loading, setLoading] = useState<boolean>(true);
  const user = useSelector((state) => state.auth.user);
  const today = new Date();

  const [isToggledToUser, setIsToggledToUser] = useState(true);

  const toggleSwitch = () =>
    setIsToggledToUser((previousState) => !previousState);

  React.useEffect(() => {
    setLoading(true);
    fetchUserPod().then((res) => {
      setPod(res);
      if (res) {
        fetchAvatarsAndEmails(res.members.map((m) => m.id)).then((map) => {
          setMap(map);
          setLoading(false);
        });
      }
    });
  }, []);

  React.useEffect(() => {
    if (isToggledToUser) {
      setLoading(true);
      fetchUserEvents().then((res) => {
        setEvents(res);
        setLoading(false);
      });
    } else {
      setLoading(true);
      fetchPodEvents(pod.id).then((res) => {
        setPodEvents(res);
        setLoading(false);
      });
    }
  }, [isToggledToUser, pod]);

  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  const todayString = mm + "/" + dd + "/" + yyyy;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Text style={[sharedStyles.h1, { marginBottom: 5, marginLeft: 15 }]}>
          Schedule
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            marginLeft: 15,
            marginBottom: 20,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 16, marginRight: "auto" }}>
            View personal schedule
          </Text>
          <Switch
            trackColor={{ false: "#5A67D8", true: "#7F9CF5" }}
            thumbColor={"#FFF"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isToggledToUser}
            style={{
              transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
              marginRight: 15,
            }}
          />
        </View>
        <Text
          style={{
            marginLeft: 15,
            fontSize: 18,
            marginBottom: 15,
          }}
        >
          Today, {todayString}
        </Text>
        {loading ? (
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
            }}
          >
            <ActivityIndicator />
          </View>
        ) : (isToggledToUser ? events : podEvents).length > 0 ? (
          <View>
            {(isToggledToUser ? events : podEvents).map((event: Event) => (
              <EventInSchedule
                event={event}
                showName={!isToggledToUser}
                navigation={navigation}
                key={event.id}
                avatar={isToggledToUser ? user.avatar : undefined}
              />
            ))}
          </View>
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
            <Text
              style={{ color: "#3C366B", fontSize: 16, marginHorizontal: 30 }}
            >
              You've got nothing scheduled today! Press the button below to add
              more events.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const fetchUserPod = async (): Promise<Pod | undefined> => {
  try {
    const authToken = await SecureStore.getItemAsync("wigo-auth-token");
    const res = await fetch(`${apiUrl}/pods/currUsersPod`, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "x-auth-token": authToken!,
      },
    });
    console.log("res", res);

    const json = await res.json();

    console.log("json", json);

    const returnedPod = json.pod[0];

    console.log("returnedPod", returnedPod);

    return returnedPod;
  } catch (err) {
    console.log("ERROR: ", err);
    console.log("error loading pod for current user");
    return undefined;
  }
};

const fetchPodEvents = async (podId: number) => {
  try {
    const authToken = await SecureStore.getItemAsync("wigo-auth-token");
    const res = await fetch(`${apiUrl}/events/${podId}`, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "x-auth-token": authToken!,
      },
    });

    const json = await res.json();
    const returnedEvents = json.events;
    return returnedEvents;
  } catch (err) {
    console.log("ERROR: ", err);
    console.log("error loading events for current pod");
  }
};

const fetchUserEvents = async () => {
  try {
    const authToken = await SecureStore.getItemAsync("wigo-auth-token");
    const res = await fetch(`${apiUrl}/events`, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "x-auth-token": authToken!,
      },
    });
    const json = await res.json();
    const returnedEvents = json.events;

    console.log("returnedEvents", returnedEvents);

    return returnedEvents;
  } catch (err) {
    console.log("ERROR: ", err);
    console.log("error loading events for current user");
  }
};

const fetchAvatarsAndEmails = async (ids: number[]) => {
  try {
    const authToken = await SecureStore.getItemAsync("wigo-auth-token");
    const res = await fetch(`${apiUrl}/users/avatars`, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "x-auth-token": authToken!,
      },
      body: JSON.stringify(ids),
    });
    const json = await res.json();
    return json.map;
  } catch (err) {
    console.log("ERROR: ", err);
    console.log("error loading events for current user");
  }
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
