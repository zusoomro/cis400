import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { setEvents } from "./eventsSlice";
import sharedStyles from "../sharedStyles";
import Event from "../types/Event";
import EventInSchedule from "./EventInSchedule";
import Pod from "../types/Pod";
import { useDispatch, useSelector } from "react-redux";
import analytics from "../analytics/analytics";
import {
  fetchAvatarsAndEmails,
  fetchPodEvents,
  fetchUserEvents,
  fetchUserPod,
} from "./scheduleService";

const ScheduleHomePage: React.FC<{}> = ({ navigation }) => {
  const [pod, setPod] = useState<Pod>();
  React.useEffect(() => {
    fetchUserPod().then((res) => {
      setPod(res);
    });
  }, []);
  return (
    <SafeAreaView style={styles.scheduleHomePageContainer}>
      <Schedule navigation={navigation} />
      <TouchableOpacity
        style={[styles.createEventButton, sharedStyles.shadow]}
        onPress={() => {
          navigation.navigate("CreateEvent", { pod: pod });
          return;
        }}
      >
        <Ionicons name="md-create" size={24} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const Schedule: React.FC<{}> = ({ navigation }) => {
  const events = useSelector((state: RootState) => state.events.events);
  const [map, setMap] = useState([]);
  const [pod, setPod] = useState<Pod>();
  const [loading, setLoading] = useState<boolean>(true);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const today = new Date();

  const [isToggledToUser, setIsToggledToUser] = useState(true);

  const toggleSwitch = () => {
    setIsToggledToUser((previousState) => !previousState);
    if (isToggledToUser) {
      analytics.track("Viewing user's events");
    } else {
      analytics.track("Viewing pod's events");
    }
  };

  // Get Pod Information
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

  // Get Events depending on toggle state
  React.useEffect(() => {
    if (isToggledToUser) {
      setLoading(true);
      fetchUserEvents().then((res) => {
        dispatch(setEvents(res));
        setLoading(false);
      });
    } else {
      setLoading(true);
      fetchPodEvents(pod.id).then((res) => {
        // Line below should be dispatch(setEvents(res)
        // NOT setEvents(res[0]) for the schedule toggle to work
        dispatch(setEvents(res));
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
        <View style={styles.scheduleContainer}>
          <Text style={{ fontSize: 16, marginRight: "auto" }}>
            View personal schedule
          </Text>
          <Switch
            trackColor={{ false: "#5A67D8", true: "#7F9CF5" }}
            thumbColor={"#FFF"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isToggledToUser}
            style={styles.scheduleToggle}
          />
        </View>
        <Text style={styles.todaysDateTitle}>Today, {todayString}</Text>
        {loading ? (
          <View style={styles.activityIndicator}>
            <ActivityIndicator />
          </View>
        ) : (isToggledToUser ? events : events).length > 0 ? (
          <View>
            {(isToggledToUser ? events : events).map((event: Event) => (
              <EventInSchedule
                event={event}
                showName={!isToggledToUser}
                navigation={navigation}
                key={event.id}
                avatar={isToggledToUser ? user.avatar : map[event.ownerId]}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyScheduleContainer}>
            <Text style={styles.emptyScheduleMessage}>
              You've got nothing scheduled today! Press the button below to add
              more events.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scheduleHomePageContainer: {
    display: "flex",
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "column",
  },
  scheduleContainer: {
    display: "flex",
    flexDirection: "row",
    marginLeft: 15,
    marginBottom: 20,
    alignItems: "center",
  },
  emptyScheduleContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginTop: "auto",
    marginBottom: "auto",
  },
  emptyScheduleMessage: {
    color: "#3C366B",
    fontSize: 16,
    marginHorizontal: 30,
  },
  activityIndicator: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  todaysDateTitle: {
    marginLeft: 15,
    fontSize: 18,
    marginBottom: 15,
  },
  scheduleToggle: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
    marginRight: 15,
  },
  createEventButton: {
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
});

export default ScheduleHomePage;
