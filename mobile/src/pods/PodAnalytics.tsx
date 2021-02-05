import React, { useState } from "react";
import { Text, View, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { Icon, Card } from "react-native-elements";

import {
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryPie,
  VictoryLabel,
} from "victory-native";

import * as Svg from "react-native-svg";

interface Props {
  navigation: {
    navigate: (screen: string) => void;
  };
}

const PodAnalytics: React.FC<Props> = ({ navigation }) => {
  const fakeGasData = [
    { user: "chloe", gallons: 10 },
    { user: "caro", gallons: 15 },
    { user: "ally", gallons: 25 },
    { user: "zulfi", gallons: 5 },
  ];

  const fakeTimeUsageData = [];

  const colors = [
    "#252525",
    "#525252",
    "#737373",
    "#969696",
    "#bdbdbd",
    "#d9d9d9",
    "#f0f0f0",
  ];
  return (
    <SafeAreaView>
      <View style={styles.section1}>
        <Text style={styles.section1TextHeader}>Pod Analytics</Text>
        <Text style={styles.section1Text}>
          View analytics of your pod to determine usage per member.
        </Text>
        <View style={styles.statsSection}>
          <Icon name="rowing" style={styles.icon} size={40} />
          <View>
            <Text style={{ fontSize: 24, fontWeight: "600", color: "#434190" }}>
              35 Trips
            </Text>
            <Text>Your Pod took 35 trips this month!</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Icon name="rowing" style={styles.icon} size={40} />
          <View>
            <Text style={{ fontSize: 24, fontWeight: "600", color: "#434190" }}>
              300 Miles
            </Text>
            <Text>Your Pod traveled 300 miles this month!</Text>
          </View>
        </View>
      </View>
      <ScrollView>
        <Card>
          <Card.Title
            style={{
              fontSize: 24,
              fontWeight: "600",
              color: "#434190",
              alignSelf: "flex-start",
            }}
          >
            Gas Usage
          </Card.Title>
          <Card.Divider />
          <View>
            <VictoryChart
              domainPadding={30}
              width={350}
              theme={VictoryTheme.material}
            >
              <VictoryBar
                data={fakeGasData}
                x="user"
                y="gallons"
                style={{ data: { fill: "#434190" } }}
              />
            </VictoryChart>
          </View>
        </Card>
        <Card>
          <Card.Title
            style={{
              fontSize: 24,
              fontWeight: "600",
              color: "#434190",
              alignSelf: "flex-start",
            }}
          >
            Time Usage
          </Card.Title>
          <Card.Divider />
          <View>
            <VictoryPie
              width={375}
              data={[
                { x: "chloe", y: 120 },
                { x: "caro", y: 150 },
                { x: "ally", y: 75 },
                { x: "zulfi", y: 100 },
              ]}
              colorScale={["#434190", "#667EEA", "#319795", "navy"]}
            />
          </View>
        </Card>
      </ScrollView>
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
  chartcontainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5fcff",
  },
  chart: {
    flex: 1,
  },
});

export default PodAnalytics;
