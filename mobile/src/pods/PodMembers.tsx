import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../configureStore";
import sharedStyles from "../sharedStyles";
import Button from "../shared/Button";

interface Props {
  navigation: {
    navigate: (screen: string) => void;
  };
}

const PodMembers: React.FC<Props> = ({ navigation }) => {
  const pod = useSelector((state: RootState) => state.pods.pod);
  console.log("members", pod.members);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.section1}>
        <Text style={styles.section1TextHeader}>Members</Text>
        <Text style={styles.section1Text}>Manage the users in your pod.</Text>
      </View>
      <View>
        <View>
          <Button
            title="Add New Members"
            style={{ backgroundColor: "#3730A3", marginTop: 10 }}
            onPress={() => {
              navigation.navigate("InviteUsers", {
                caller: "PodMembers",
                pod: pod,
              });
              return;
            }}
          />
        </View>
        <View style={styles.section2}>
          {pod.members.map((member) => (
            <View key={member.id} style={styles.userCard}>
              <Text style={styles.email}>{member.email}</Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#7F9CF5",
    flex: 1,
  },
  section1: {
    backgroundColor: "#4C51BF",
    padding: 12,
    paddingTop: 24,
    paddingBottom: 24,
  },
  section1Text: {
    color: "#FFF",
  },
  section1TextHeader: {
    color: "#FFF",
    fontSize: 24,
    marginBottom: 5,
    fontWeight: "300",
  },
  section2: {
    marginTop: 18,
  },
  userCard: {
    backgroundColor: "#FFF",
    padding: 18,
    margin: 10,
    borderColor: "#667EEA",
    borderRadius: 15,

    // Shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  email: {
    fontSize: 16,
  },
});

export default PodMembers;
