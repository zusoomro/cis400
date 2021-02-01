import React from "react";
import { Text, View, StyleSheet, SafeAreaView } from "react-native";
import { Icon } from "react-native-elements";
//import Icon from "react-native-vector-icons";

interface Props {
  navigation: {
    navigate: (screen: string) => void;
  };
}

const PodAnalytics: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView>
      <View style={styles.section1}>
        <Text style={styles.section1TextHeader}>Pod Analytics</Text>
        <Text style={styles.section1Text}>
          View analytics of your pod to determine usage per member.
        </Text>
        <View style={styles.statsSection}>
          <Icon name="rowing" style={styles.icon} size="40" />
          <View>
            <Text style={{ fontSize: 24, fontWeight: "600", color: "#434190" }}>
              35 Trips
            </Text>
            <Text>Your Pod took 35 trips this month!</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Icon name="rowing" style={styles.icon} size="40" />
          <View>
            <Text style={{ fontSize: 24, fontWeight: "600", color: "#434190" }}>
              300 Miles
            </Text>
            <Text>Your Pod traveled 300 miles this month!</Text>
          </View>
        </View>
      </View>
      <View>
        <Text>Pod Analytics!!!</Text>
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
    backgroundColor: "#FFF",
    padding: 12,
    paddingTop: 24,
    paddingBottom: 24,
  },
  section1Text: {
    marginBottom: 10,
  },
  section1TextHeader: {
    fontSize: 24,
    marginBottom: 5,
    fontWeight: "300",
  },
  icon: {
    marginRight: 15,
  },
  statsSection: {
    flexDirection: "row",
    marginBottom: 15,
  },
});

export default PodAnalytics;
