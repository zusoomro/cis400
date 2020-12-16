import { render } from "@testing-library/react-native";
import React from "react";
import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Button,
} from "react-native";
import { List, ListItem, SearchBar } from "react-native-elements";
import { useSelector } from "react-redux";
import apiUrl from "../config";
import sharedStyles from "../sharedStyles";
import * as SecureStore from "expo-secure-store";

interface User {
  id: number;
  email: string;
}

const InviteUsers: React.FC<{}> = ({ navigation, route }) => {
  const u: User[] = [];
  const [users, setUsers] = useState(u);
  const [invitees, setInvitees] = useState([]);

  // variables used for search filtering
  const [query, setQuery] = useState("");
  const [tempData, setTempData] = useState([]);

  const caller = route?.params?.caller;
  const currUserId = useSelector((state) => state.auth.user.id);

  React.useEffect(() => {
    async function fetcher() {
      try {
        const res = await fetch(`${apiUrl}/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
        });

        const json = await res.json();
        let result = json.filter((user) => user.id != currUserId);
        const pod = route?.params?.pod;
        if (pod) {
          const currMembers: Array<number> = [];
          pod.members.forEach((member) => {
            currMembers.push(member.id);
          });
          if (currMembers.length) {
            result = result.filter((user) => !currMembers.includes(user.id));
          }
        }
        setUsers(result);
        setTempData(result);
      } catch (err) {
        console.log("error loading users");
      }
    }

    fetcher();
  }, []);

  const UserRowItem = ({ title, user }) => (
    <View style={[styles.item, sharedStyles.shadow]}>
      <Text style={styles.title}>{title}</Text>
      <Button
        color="#5A67D8"
        onPress={() => {
          const newInvite: Array<number> = [user.id];
          if (invitees) {
            setInvitees(invitees.concat(newInvite));
          } else {
            setInvitees(newInvite);
          }
        }}
        title="Select"
        disabled={invitees.includes(user.id)}
      />
    </View>
  );

  const renderItem = ({ item }) => (
    <UserRowItem title={item.email} user={item} />
  );

  const handleInviteUsers = async () => {
    if (caller) {
      if (caller === "PodMembers") {
        const pod = route?.params?.pod;
        const data = {
          inviteeIds: invitees,
          pod: pod,
        };

        // make post request to /invites and send the invites
        try {
          const res = await fetch(`${apiUrl}/invites`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json;charset=utf-8",
              "x-auth-token": (await SecureStore.getItemAsync(
                "wigo-auth-token"
              ))!,
            },
            body: JSON.stringify(data),
          });
          const message = await res.json();
          console.log("message", message);
          navigation.navigate("PodMembers");
        } catch (error) {
          console.log(`error sending invites`, error);
        }
      } else if (caller === "CreatePod") {
        navigation.navigate("CreatePod", { invitees: invitees });
      } else {
        console.log("error: i'm confused");
      }
    }
  };

  const handleSearch = (text: string) => {
    const formattedQuery = text.toLowerCase();
    const filteredData = tempData.filter((user: User) => {
      return user.email.includes(formattedQuery);
    });
    setUsers(filteredData);
    setQuery(text);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ margin: 10 }}>
        <Button
          color="#5A67D8"
          onPress={handleInviteUsers}
          title="Send Invites"
        ></Button>
      </View>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => "" + item.id}
        ListHeaderComponent={
          <SearchBar
            placeholder="Seach Here.."
            round
            onChangeText={(text) => handleSearch(text)}
            autoCorrect={false}
            value={query}
          ></SearchBar>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 15,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 16,
  },
});

export default InviteUsers;
