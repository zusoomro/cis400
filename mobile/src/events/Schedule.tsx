import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { setEvents } from "./eventsSlice";
import { setPod } from "../pods/podSlice";
import sharedStyles from "../sharedStyles";
import Event from "../types/Event";
import Pod from "../types/Pod";
import { useDispatch, useSelector } from "react-redux";
import analytics from "../analytics/analytics";
import {
  fetchAvatarsAndEmails,
  fetchPodEvents,
  fetchUserEvents,
  fetchUserPod,
  fetchUserEmail,
} from "./scheduleService";
import { BaseEvent, Calendar } from "react-native-big-calendar";
import { Dimensions } from "react-native";
import { RootState } from "../configureStore";

interface CalendarEvent extends BaseEvent {
  wigoEvent: Event;
  ownerEmail: String;
  start: Date;
  end: Date;
  id: number;
  title: string;
}

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
  const pod = useSelector((state: RootState) => state.pods.pod);
  const [loading, setLoading] = useState<boolean>(true);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const today = new Date();
  const [processedEvents, setProcessedEvents] = useState<CalendarEvent[]>();

  const [isToggledToUser, setIsToggledToUser] = useState(false);

  const calendarEventColors = [
    "#818cf8",
    "#4f46e5",
    "#3730a3",
    "#2dd4bf",
    "#0D9488",
    "#115E59",
  ];
  const podMemberIdToColor: { [key: number]: string } = {};
  if (pod && pod.members) {
    for (let i = 0; i < pod.members.length; i++) {
      podMemberIdToColor[pod.members[i].id] =
        calendarEventColors[i % calendarEventColors.length];
    }
  }

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
      dispatch(setPod(res));
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
      fetchUserPod().then((res) => {
        if (res) {
          fetchPodEvents(res.id).then((podEvents) => {
            // Line below should be dispatch(setEvents(res)
            // NOT setEvents(res[0]) for the schedule toggle to work
            dispatch(setEvents(podEvents));
          });
          setLoading(false);
        }
      });
    }
  }, [isToggledToUser, pod]);

  // If events change, process them into calendar events
  React.useEffect(() => {
    setLoading(true);
    const PromiseArray = events.map(async (event) => {
      const email = await fetchUserEmail(event.ownerId);
      return {
        title: event.name,
        ownerEmail: email,
        start: event.start_time,
        end: event.end_time,
        id: event.id,
        wigoEvent: event,
        children: (
          <View>
            <Text style={{ color: "#FFFFFF", fontSize: 11 }} numberOfLines={1}>
              {email.split("@")[0]}
            </Text>
          </View>
        ),
      };
    });

    Promise.all(PromiseArray).then((values) => {
      setProcessedEvents(values);
    });
    setLoading(false);
  }, [events]);

  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  const todayString = mm + "/" + dd + "/" + yyyy;

  return (
    <View style={{ flex: 1 }}>
      <View contentContainerStyle={{ flexGrow: 1 }}>
        <Text style={[sharedStyles.h1, { marginBottom: 5, marginLeft: 15 }]}>
          Schedule
        </Text>
        <View style={styles.scheduleContainer}>
          {isToggledToUser ? (
            <Text style={{ fontSize: 16, marginRight: "auto" }}>
              Personal schedule
            </Text>
          ) : (
            <Text style={{ fontSize: 16, marginRight: "auto" }}>
              Pod schedule
            </Text>
          )}
          <Switch
            trackColor={{ false: "#5A67D8", true: "#7F9CF5" }}
            thumbColor={"#FFF"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isToggledToUser}
            style={styles.scheduleToggle}
          />
        </View>
        {loading ? (
          <View style={styles.activityIndicator}>
            <ActivityIndicator />
          </View>
        ) : events.length > 0 ? (
          <View>
            {processedEvents && processedEvents.length != 0 && (
              <Calendar
                events={processedEvents!}
                mode="day"
                scrollOffsetMinutes={480}
                height={Dimensions.get("window").height - 130}
                ampm={true}
                onPressEvent={(event: CalendarEvent) => {
                  console.log(`Clicked on event with id: ${event.id}`);
                  navigation.navigate("ModifyEvent", {
                    event: events.find(
                      (eventObject: Event) => eventObject.id == event.id
                    ),
                    pod,
                  });
                }}
                swipeEnabled={true}
                eventCellStyle={(event: BaseEvent) => {
                  const fixedEvent = event as CalendarEvent;
                  return {
                    backgroundColor:
                      podMemberIdToColor[fixedEvent.wigoEvent.ownerId],
                  };
                }}
              />
            )}
          </View>
        ) : (
          <View>
            <Text style={styles.emptyScheduleMessage}>
              You've got nothing scheduled today! Press the button below to add
              more events.
            </Text>
          </View>
        )}
      </View>
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
