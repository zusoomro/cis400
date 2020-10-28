import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, StyleSheet, ScrollView } from "react-native";
import { Card } from "react-native-elements";

const Schedule: React.FC<{}> = () => {
  const currUserId = 2;

  // eventsForUser will store the array if events of the current user
  const [eventsForUser, setEventsForUser] = useState([]);
  let today = new Date();

  useEffect(() => {
    fetch(
      // add in API
      `http://localhost:8000/events/${currUserId}`,
      {
        method: "GET",
      }
    )
      .then(
        (res) => {
          return res.json();
        },
        (err) => {
          console.log(err);
        }
      )
      .then((res) => {
        if (res) {
          let newRes = [];
          res.forEach((e) => {
            if (new Date(e.start_time).getDate() === today.getDate()) {
              newRes.push(e);
            }
          });
          // sort events by start_time
          setEventsForUser(newRes);
        } else {
          setEventsForUser([]);
        }
      }).catch((error) => {
        console.log("Error getting schedule", error);
        return null;
      }); 
  }, []);

  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let yyyy = today.getFullYear();
  let todayString = mm + "/" + dd + "/" + yyyy;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>{todayString}</Text>
      <ScrollView>
        {eventsForUser.map((event) => (
          <Event event={event} key={event.id}></Event>
        ))}
      </ScrollView>
    </SafeAreaView>
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
      <Card>
        <Card.Title>{name}</Card.Title>
        <Text style={styles.sub}>
          When:{" "}
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
        <Text style={styles.sub}>Where: {address}</Text>
        <Text style={styles.sub}>Notes: {notes}</Text>
      </Card>
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

export default Schedule;

// const sampleEvents = [
//   {
//     start_time: new Date("2020-03-26T09:30:00"),
//     end_time: new Date("2020-03-26T10:00:00"),
//     name: "Event 1",
//     id: 1,
//     ownerId: 1,
//     address: "my butt",
//     notes: "booty",
//   },
//   {
//     start_time: new Date("2020-03-26T11:00:00"),
//     end_time: new Date("2020-03-26T13:00:00"),
//     name: "Event 2",
//     id: 2,
//     ownerId: 1,
//     address: "ur butt",
//     notes: "boooty",
//   },
//   {
//     start_time: new Date("2020-03-26T15:00:00"),
//     end_time: new Date("2020-03-26T16:30:00"),
//     name: "Event 3",
//     id: 3,
//     ownerId: 1,
//     address: "his butt",
//     notes: "booooty",
//   },
//   {
//     start_time: new Date("2020-03-26T18:00:00"),
//     end_time: new Date("2020-03-26T19:00:00"),
//     name: "Event 4",
//     id: 4,
//     ownerId: 1,
//     address: "her butt",
//     notes: "booooty",
//   },
//   {
//     start_time: new Date("2020-03-26T22:00:00"),
//     end_time: new Date("2020-03-26T23:30:00"),
//     name: "Event 5",
//     id: 5,
//     ownerId: 1,
//     address: "ur MOMs butt",
//     notes: "boooooty",
//   },
// ];
