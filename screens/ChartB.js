import React from "react";
import { Text, View, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import {
  VictoryChart,
  VictoryLabel,
  VictoryAxis,
  VictoryLine,
} from "victory-native";
import { G } from "react-native-svg";
import tw from "tailwind-react-native-classnames";
import { Ionicons } from "@expo/vector-icons";
import { getDateObj } from "../Util";

const ChartB = ({ data }) => {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const xDomain = [getDateObj(data.firstDate), getDateObj(data.lastDate)];

  let xTickValues = [];
  const msPerDay = 1000 * 60 * 60 * 24;
  const timeSpan = xDomain[0].getTime() - xDomain[1].getTime();
  const tickMarkFrequency = Math.floor(timeSpan / msPerDay / 4);
  for (let i = 0; i < 5; i++) {
    let tickMarkDate = new Date(
      xDomain[0].getTime() + tickMarkFrequency * i * msPerDay
    );
    xTickValues.push(tickMarkDate);
  }

  return (
    <View>
      <TouchableOpacity onPress={() => setShowInfoModal(true)}>
        <Ionicons
          style={tw`mt-1 pr-10 self-end`}
          name="information-circle-outline"
          size={25}
        />
      </TouchableOpacity>
      <VictoryChart>
        <VictoryLabel
          x={25}
          y={20}
          style={{ fill: "#F78A03" }}
          text={"Sleep Length (Hours)"}
        />
        <VictoryLabel
          x={260}
          y={20}
          style={{ fill: "#1C3F52" }}
          text={"Sleep Quality (%)"}
        />
        <G>
          {/*shared x axis for time */}
          <VictoryAxis
            scale="time"
            standalone={false}
            tickValues={xTickValues}
          />
          {/*y axis for duration */}
          <VictoryAxis
            domain={[0, 17]}
            // domain={[data.sleepDurationMin, data.sleepDurationMax]}
            dependentAxis
            orientation="left"
            standalone={false}
            style={{ axis: { stroke: "#F78A03", strokeWidth: 2 } }}
          />
          {/*line chart for sleep duration */}
          <VictoryLine
            data={data.lineDurationData}
            domain={{
              x: xDomain,
              y: [0, 17],
              // y: [data.sleepDurationMin, data.sleepDurationMax]
            }}
            scale={{ x: "time", y: "linear" }}
            standalone={false}
            style={{ data: { stroke: "#F78A03", strokeWidth: 4 } }}
          />
          {/*y axis for sleep quality */}
          <VictoryAxis
            offsetX={50}
            domain={[0, 100]}
            // domain={[data.sleepQualityMin, data.sleepQualityMax]}
            dependentAxis
            orientation="right"
            standalone={false}
            style={{ axis: { stroke: "#1C3F52", strokeWidth: 2 } }}
          />
          {/*line chart for sleep quality */}
          <VictoryLine
            data={data.lineQualityData}
            domain={{
              x: xDomain,
              y: [0, 100],
              // y: [data.sleepQualityMin, data.sleepQualityMax]
            }}
            scale={{ x: "time", y: "linear" }}
            standalone={false}
            style={{ data: { stroke: "#1C3F52", strokeWidth: 4 } }}
          />
        </G>
      </VictoryChart>
      <Modal
        transparent={false}
        animationType="slide"
        visible={showInfoModal}
        onRequestClose={() => setShowInfoModal(!showInfoModal)}
        style={{ backgroundColor: "#3e8cb6" }}
      >
        <View style={tw`flex-1 items-center justify-center`}>
          <View style={tw`p-4`}>
            <Text style={tw`p-4 text-base`}>
              This graph shows a line for the quality of your sleep and for the
              duration of your sleep.
            </Text>
            <Text style={tw`p-4 text-base`}>
              If either is improving its line will slope upwards.
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowInfoModal(!showInfoModal)}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default ChartB;

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#F78A03",
    paddingVertical: 12,
    width: 150,
    marginVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
