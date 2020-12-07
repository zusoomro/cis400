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

interface User {
  id: number;
  email: string;
}

const InviteUsers: React.FC<{}> = ({ navigation, route }) => {
  const u: User[] = [];
  const [users, setUsers] = useState(u);
  const [invitees, setInvitees] = useState([]);

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
        const result = json.filter((user) => user.id != currUserId);
        setUsers(result);
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
        //disabled={isDisabled}
        disabled={invitees.includes(user.id)}
      />
    </View>
  );

  const renderItem = ({ item }) => (
    <UserRowItem title={item.email} user={item} />
  );

  const handleInviteUsers = () => {
    navigation.navigate("CreatePod", { invitees: invitees });
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
