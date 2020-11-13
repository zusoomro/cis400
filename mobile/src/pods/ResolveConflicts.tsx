import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import apiUrl from "../config";
import { useSelector } from "react-redux";
import { RootState } from "../configureStore";
import Event from "../types/Event";

const ResolveConflicts: React.FC = ({ navigation }) => {
  const podId = useSelector((state: RootState) => state.pods.pods[0].id);
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState<boolean>(false);
  const [conEvents, setConEvents] = useState<Event[]>();

  const updateEvents = async () => {
    await setLoading(true);

    const res = await fetch(`${apiUrl}/pods/${podId}/conflictingEvents`, {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
    });

    const json = await res.json();

    setConEvents(json.events);
    await setLoading(false);
  };

  useEffect(() => {
    updateEvents();
  }, []);

  return (
    <View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={updateEvents} />
        }
      >
        {!loading ? (
          conEvents &&
          conEvents.map((event) => (
            <View
              style={{
                padding: 10,
                marginVertical: 5,
                marginHorizontal: 10,
                backgroundColor: "#FFF",
                borderRadius: 10,
              }}
            >
              <Text style={{ color: "red", fontSize: 18, marginBottom: 5 }}>
                {event.name}
              </Text>
              <Text>{event.start_time}</Text>
              <Text>{event.end_time}</Text>
              <Button
                title={"Modify This Event"}
                disabled={event.ownerId != user.id}
                onPress={() => navigation.navigate("ModifyEvent", { event })}
              />
            </View>
          ))
        ) : (
          <ActivityIndicator />
        )}
      </ScrollView>
    </View>
  );
};

export default ResolveConflicts;
