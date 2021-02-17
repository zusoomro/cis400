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
import { fetchUserEmail } from "./scheduleService";
 
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
  const { name, notes, formattedAddress, ownerId, priority } = event;

  // This is a hack and should be rewritten!
  const [email, setEmail] = useState<string>();

  useEffect(() => {
    fetchUserEmail(ownerId).then((res) => setEmail(res));
  });

  return (
    <Pressable onPress={() => navigation.navigate("ModifyEvent", { event })}>
      <View style={[styles.eventContainer, sharedStyles.shadow]}>
        {avatar && <Image source={{ uri: avatar }} style={styles.avatar} />}
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

const styles = StyleSheet.create({
  sub: {
    fontSize: 14,
    textAlign: "left",
    marginBottom: 10,
  },
  eventContainer: {
    padding: 15,
    backgroundColor: "#FFF",
    margin: 15,
    marginTop: 0,
    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
  },
  avatar: {
    width: 50,
    height: 50,
    marginRight: 15,
    borderRadius: 100,
  },
});

export default EventInSchedule;
