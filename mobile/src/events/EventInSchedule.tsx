import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import sharedStyles from "../sharedStyles";
import Event, { Priority } from "../types/Event";
import apiUrl from "../config";

interface EventProps {
  event: Event;
  navigation: {
    navigate: () => void;
  };
  showName: boolean;
  avatar: string;
}

const EventInSchedule: React.FC<EventProps> = ({
  event,
  navigation,
  showName,
  avatar,
}) => {
  const { name, notes, formattedAddress, id, ownerId, priority } = event;

  // This is a hack and should be rewritten!
  const [email, setEmail] = useState<string>();

  useEffect(() => {
    getUserEmail(id).then((res) => setEmail(res));
  });

  return (
    <Pressable onPress={() => navigation.navigate("ModifyEvent", { event })}>
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
        {avatar && (
          <Image
            source={{ uri: avatar }}
            style={{
              width: 50,
              height: 50,
              marginRight: 15,
              borderRadius: 100,
            }}
          />
        )}
        <View>
          {/* Event Name */}
          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 5 }}>
            {name}
          </Text>
          <Text>{Priority[priority]}</Text>
          {/* user name */}
          {showName && (
            <Text style={styles.sub}>
              {!!email ? (
                email
              ) : (
                <ActivityIndicator style={{ paddingTop: 5 }} />
              )}
            </Text>
          )}
          <Text style={{ color: "#718096", marginBottom: 5 }}>
            {generateDateString(event)}
          </Text>
          <Text style={{ color: "#319795", marginBottom: 5 }}>
            {formattedAddress}
          </Text>
          <Text style={{ color: "#4A5568" }}>{notes}</Text>
        </View>
      </View>
    </Pressable>
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

const getUserEmail = async (id) => {
  try {
    const authToken = await SecureStore.getItemAsync("wigo-auth-token");
    const res = await fetch(`${apiUrl}/users/email/${id}`, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "x-auth-token": authToken!,
      },
    });
    const json = await res.json();
    return json.email;
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
