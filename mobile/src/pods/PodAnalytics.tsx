import React from "react";
import { Text, View, StyleSheet, SafeAreaView } from "react-native";

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
});

export default PodAnalytics;
