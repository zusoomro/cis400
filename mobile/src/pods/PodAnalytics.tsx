import React, { useState } from "react";
import { Text, View, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { Icon, Card, ButtonGroup } from "react-native-elements";
import apiUrl from "../config";
import * as SecureStore from "expo-secure-store";
import { RootState } from "../configureStore";
import { useSelector } from "react-redux";
import { RadioButton } from "react-native-paper";

import {
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryPie,
  VictoryLabel,
  VictoryAxis,
  VictoryLegend,
} from "victory-native";

interface Props {
  navigation: {
    navigate: (screen: string) => void;
  };
}

const PodAnalytics: React.FC<Props> = ({ navigation }) => {
  const [timeFrame, setTimeFrame] = useState("month");
  // State for Pod totals
  const [milesTraveled, setMilesTraveled] = useState(0);
  const [numTrips, setNumTrips] = useState(0);
  const [travelTime, setTravelTime] = useState(0);

  // State for gas breakdown
  const gasButtons = ["Percentage", "Total"];
  const [selectedGasIndex, setSelectedGasIndex] = useState(0);
  const [gasTotalData, setgasTotalData] = useState([]);
  const [gasPercentageData, setGasPercentageData] = useState([]);

  // State for time breakdown
  const [timeTotalData, setTimeTotalData] = useState([]);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(0);
  const [timePercentageData, setTimePercentageData] = useState([]);

  const [pieLegendLabels, setPieLegendLabels] = useState([]);
  const pieChartColorScale = [
    "#312E81",
    "#BFDBFE",
    "#4338CA",
    "#818CF8",
    "#3B82F6",
    "#C7D2FE",
  ];
  const podId = useSelector((state: RootState) => state.pods.pod.id);

  async function fetchAnalytics() {
    try {
      const res = await fetch(
        `${apiUrl}/analytics/pods/${podId}?time=${timeFrame}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            "x-auth-token": (await SecureStore.getItemAsync(
              "wigo-auth-token"
            ))!,
          },
        }
      );

      const json = await res.json();
      setNumTrips(json.numTrips);
      setMilesTraveled(json.milesTraveled.toFixed(2));
      setTravelTime(json.travelTime);
    } catch (err) {
      console.log("error loading analytics", err);
    }
  }

  async function fetchAnalyticsBreakdown() {
    try {
      const res = await fetch(
        `${apiUrl}/analytics/breakdown/${podId}?time=${timeFrame}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            "x-auth-token": (await SecureStore.getItemAsync(
              "wigo-auth-token"
            ))!,
          },
        }
      );

      const json = await res.json();
      let gasReport = [];
      let gasPercentage = [];
      let timeTotalReport = [];
      let timePercentageReport = [];
      let pieLabels = [];
      json.forEach(async function (data) {
        let emailShort: String = data.email.substring(
          0,
          data.email.indexOf("@")
        );
        gasReport.push({ user: emailShort, gallons: data.gasUsage });
        gasPercentage.push({ x: emailShort, y: data.gasPercentage });

        timeTotalReport.push({
          user: emailShort,
          seconds: data.timeUsage / 3600,
        });
        timePercentageReport.push({ x: emailShort, y: data.timePercentage });

        pieLabels.push({ name: emailShort });
      });
      setgasTotalData(gasReport);
      setGasPercentageData(gasPercentage);
      setTimeTotalData(timeTotalReport);
      setTimePercentageData(timePercentageReport);
      setPieLegendLabels(pieLabels);
    } catch (err) {
      console.log("error loading analytics", err);
    }
  }

  React.useEffect(() => {
    fetchAnalytics();
    fetchAnalyticsBreakdown();
  }, [timeFrame]);

  React.useEffect(() => {
    fetchAnalytics();
    fetchAnalyticsBreakdown();
  }, []);

  return (
    <SafeAreaView>
      <View style={styles.headerSection}>
        <Text style={styles.section1TextHeader}>Pod Analytics</Text>
        <Text style={styles.section1Text}>
          View analytics of your pod to determine usage per member.
        </Text>
      </View>
      <View style={{ backgroundColor: "#FFF" }}>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ paddingTop: 10, paddingLeft: 5, paddingRight: 10 }}>
            View anayltics for the past:{" "}
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ paddingTop: 10 }}>Month</Text>
            <RadioButton.Android
              value="month"
              color="#312E81"
              status={timeFrame === "month" ? "checked" : "unchecked"}
              onPress={() => setTimeFrame("month")}
            />
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ paddingTop: 10 }}>Week</Text>
            <RadioButton.Android
              value="week"
              color="#312E81"
              status={timeFrame === "week" ? "checked" : "unchecked"}
              onPress={() => setTimeFrame("week")}
            />
          </View>
        </View>
      </View>
      {numTrips == 0 ? (
        <View
          style={{
            backgroundColor: "#FFF",
            display: "flex",
            height: 615,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              paddingTop: 200,
              fontSize: 20,
              color: "#312E81",
            }}
          >
            Your Pod has not scheduled any trips this {timeFrame} :(
          </Text>
          <Text
            style={{
              textAlign: "center",
              fontSize: 20,
              color: "#312E81",
              paddingTop: 15,
            }}
          >
            Go to the events page to schedule upcoming trips!
          </Text>
        </View>
      ) : (
        <ScrollView height="83%">
          <View style={styles.section1}>
            <View style={styles.statsSection}>
              <Icon name="work" style={styles.icon} size={40} />
              <View>
                <Text
                  style={{ fontSize: 24, fontWeight: "600", color: "#434190" }}
                >
                  {numTrips} Trips
                </Text>
                <Text>
                  Your Pod took {numTrips} trips this {timeFrame}!
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Icon
                name="car"
                type="font-awesome"
                style={styles.icon}
                size={35}
              />
              <View>
                <Text
                  style={{ fontSize: 24, fontWeight: "600", color: "#434190" }}
                >
                  {milesTraveled} Miles
                </Text>
                <Text>
                  Your Pod traveled {milesTraveled} miles this {timeFrame}!
                </Text>
              </View>
            </View>
          </View>

          <View>
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
              <ButtonGroup
                onPress={(index) => {
                  setSelectedGasIndex(index);
                }}
                selectedIndex={selectedGasIndex}
                buttons={gasButtons}
                containerStyle={styles.buttonGroup}
              />
              <View>
                {selectedGasIndex == 1 ? (
                  <VictoryChart
                    domainPadding={30}
                    width={350}
                    theme={VictoryTheme.material}
                  >
                    <VictoryBar
                      data={gasTotalData}
                      x="user"
                      y="gallons"
                      style={{ data: { fill: "#434190" } }}
                    />
                    <VictoryAxis
                      dependentAxis
                      label="Gas (gallons)"
                      style={{
                        axisLabel: {
                          padding: 40,
                        },
                        grid: { strokeWidth: 0.0 },
                      }}
                    />
                    <VictoryAxis style={{ grid: { strokeWidth: 0.0 } }} />
                  </VictoryChart>
                ) : (
                  <View>
                    <VictoryPie
                      width={350}
                      height={375}
                      padding={10}
                      labelPosition="startAngle"
                      data={gasPercentageData}
                      colorScale={pieChartColorScale}
                      labels={() => null}
                    />
                    <VictoryLegend
                      colorScale={pieChartColorScale}
                      orientation="horizontal"
                      gutter={20}
                      title="Legend"
                      height={100}
                      centerTitle
                      style={{ border: { stroke: "black" } }}
                      data={pieLegendLabels}
                      itemsPerRow={3}
                    />
                  </View>
                )}
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
              <ButtonGroup
                onPress={(index) => {
                  setSelectedTimeIndex(index);
                }}
                selectedIndex={selectedTimeIndex}
                buttons={gasButtons}
                containerStyle={styles.buttonGroup}
              />
              <View>
                {selectedTimeIndex == 0 ? (
                  <View>
                    <VictoryPie
                      width={355}
                      height={375}
                      padding={10}
                      data={timePercentageData}
                      colorScale={pieChartColorScale}
                      labels={() => null}
                    />
                    <VictoryLegend
                      colorScale={pieChartColorScale}
                      orientation="horizontal"
                      gutter={20}
                      title="Legend"
                      height={100}
                      centerTitle
                      style={{ border: { stroke: "black" } }}
                      data={pieLegendLabels}
                      itemsPerRow={3}
                    />
                  </View>
                ) : (
                  <VictoryChart
                    domainPadding={30}
                    width={350}
                    theme={VictoryTheme.material}
                  >
                    <VictoryBar
                      data={timeTotalData}
                      x="user"
                      y="seconds"
                      style={{ data: { fill: "#434190" } }}
                    />
                    <VictoryAxis
                      dependentAxis
                      label="Time (hours)"
                      style={{
                        axisLabel: {
                          padding: 40,
                        },
                        grid: { strokeWidth: 0.0 },
                      }}
                    />
                    <VictoryAxis style={{ grid: { strokeWidth: 0.0 } }} />
                  </VictoryChart>
                )}
              </View>
            </Card>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#7F9CF5",
    flex: 1,
  },
  headerSection: {
    backgroundColor: "#C7D2FE",
    padding: 5,
    paddingTop: 20,
  },
  section1: {
    backgroundColor: "#FFF",
    padding: 12,
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
  buttonGroup: {
    height: 25,
  },
});

export default PodAnalytics;
