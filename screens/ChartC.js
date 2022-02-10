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
import { getBedTime, getDateObj } from "../Util";
import { useSelector } from "react-redux";

const ChartC = ({ data }) => {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const xDomain = [getDateObj(data.firstDate), getDateObj(data.lastDate)];
  const yDomain = [data.earliestStartTime, data.latestStartTime];

  const sleepGoalStart = useSelector((state) => state.profile.sleepGoalStart);

  const bedTimeGoalLineData = [
    { x: data.firstDate, y: getBedTime(sleepGoalStart) },
    { x: data.lastDate, y: getBedTime(sleepGoalStart) },
  ];

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
          text={"Bed Time"}
        />
        <G>
          {/*shared x axis for time */}
          <VictoryAxis
            scale="time"
            standalone={false}
            tickValues={xTickValues}
          />
          {/*y axis for bedTime */}
          <VictoryAxis
            domain={[1140, 2600]}
            dependentAxis
            orientation="left"
            standalone={false}
            style={{ axis: { stroke: "#F78A03", strokeWidth: 2 } }}
          />
          {/*line chart for Bed Time Data */}
          <VictoryLine
            data={data.lineBedTimeData}
            domain={{
              x: xDomain,
              y: [1140, 2600],
            }}
            scale={{ x: "time", y: "linear" }}
            standalone={false}
            style={{ data: { stroke: "#F78A03", strokeWidth: 4 } }}
          />
          {/*annotation line for Bed Time Goal */}
          <VictoryLine
            data={bedTimeGoalLineData}
            domain={{
              x: xDomain,
              y: [1140, 2600],
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
              This graph shows a line for when you go to sleep and for when you
              wake up.
            </Text>
            <Text style={tw`p-4 text-base`}>
              The horizontal lines show your goals for bed time and wake up
              time.
            </Text>
            <Text style={tw`p-4 text-base`}>
              If your data lines are flatter, you are more consistently going to
              sleep/waking up at the same time each day.
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

export default ChartC;

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
