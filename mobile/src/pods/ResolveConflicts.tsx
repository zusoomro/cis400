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
import moment from "moment";

const ResolveConflicts: React.FC = ({ navigation }) => {
  const podId = useSelector((state: RootState) => state.pods.pods[0].id);
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchData, setFetchData] = useState<{
    events: Event[];
    members: { [key: string]: string };
  }>();

  const updateEvents = async () => {
    await setLoading(true);

    const res = await fetch(`${apiUrl}/pods/${podId}/conflictingEvents`, {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
    });

    const json = await res.json();

    console.log("json", json);
    setFetchData(json);

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
          fetchData &&
          fetchData.events &&
          fetchData.members &&
          fetchData.events.map((event) => (
            <View
              style={{
                padding: 10,
                marginVertical: 5,
                marginHorizontal: 10,
                backgroundColor: "#FFF",
                borderRadius: 10,
              }}
              key={event.id}
            >
              <Text style={{ color: "red", fontSize: 18, marginBottom: 5 }}>
                {event.name}
              </Text>
              <Text style={{ marginBottom: 5 }}>
                {fetchData.members[event.ownerId]}
              </Text>
              <Text>{moment(event.start_time).format("LLLL")}</Text>
              <Text>{moment(event.end_time).format("LLLL")}</Text>
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
