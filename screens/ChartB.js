import React from "react";
import { Text, View } from "react-native";
import { useEffect, useState } from "react";
import {
  VictoryChart,
  VictoryLabel,
  VictoryAxis,
  VictoryLine,
} from "victory-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { G } from "react-native-svg";

import { getDateObj, calculateSleepLength } from "../Util";

const ChartB = ({ data }) => {
  //data from db has already been pulled in by parent component.  However it still needs to be reformatted.
  // const sleepEntryDbData = props.data;
  const [xDomain, setXDomain] = useState([
    // new Date(2022, 2, 1),
    // new Date(2022, 2, 14),
    getDateObj(data.firstDate), getDateObj(data.lastDate)
  ]);
  const [xTickValues, setXTickValues] = useState([]);

  //on page load get oldest and newst entrys from async storage.  This is needed to determine x axis domain
  useEffect(async () => {
    const newestEntryString = await AsyncStorage.getItem("mostRecentEntry");
    const newestDateObj = getDateObj(JSON.parse(newestEntryString).date);
    const oldestEntryString = await AsyncStorage.getItem("oldestEntry");
    const oldestDateObj = getDateObj(JSON.parse(oldestEntryString).date);
    // setXDomain([oldestDateObj, newestDateObj]);
    // setXDomain([getDateObj(data.firstDate), getDateObj(data.lastDate)]);
    //get the timespan between the oldest and newest entries.
    const msPerDay = 1000 * 60 * 60 * 24;
    const timeSpan = newestDateObj.getTime() - oldestDateObj.getTime();

    //divide the timeSpan by 4 and convert it from ms to days.  That's how often a tick mark should appear on the x axis
    const tickMarkFrequency = Math.floor(timeSpan / msPerDay / 4);

    //make four tick marks, start from the oldest date, and add the tickMarkFrequency
    let tickValues = [];
    for (let i = 0; i < 5; i++) {
      let tickMarkDate = new Date(
        oldestDateObj.getTime() + tickMarkFrequency * i * msPerDay
      );
      tickValues.push(tickMarkDate);
    }
    setXTickValues(tickValues);
  }, []);

  // const getSleepLengthData = (dbDataObj) => {
  //   const dataArray = [];
  //   for (let entryId in dbDataObj) {
  //     let entry = dbDataObj[entryId];
  //     let entryForChart = {
  //       x: getDateObj(entry.date),
  //       y: calculateSleepLength(entry),
  //     };
  //     dataArray.push(entryForChart);
  //   }
  //   return dataArray;
  // };

  // const getSleepQualityData = (dbDataObj) => {
  //   const dataArray = [];
  //   for (let entryId in dbDataObj) {
  //     let entry = dbDataObj[entryId];
  //     let entryForChart = {
  //       x: getDateObj(entry.date),
  //       y: entry.quality,
  //     };
  //     dataArray.push(entryForChart);
  //   }
  //   return dataArray;
  // };

  return (
    <View>
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
            // data={getSleepLengthData(sleepEntryDbData)}
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
            // data={getSleepQualityData(sleepEntryDbData)}
            data={data.lineQualityData}
            domain={{
              x: xDomain,
              y: [0, 100],
              // y = [data.sleepQualityMin, data.sleepQualityMax]
            }}
            scale={{ x: "time", y: "linear" }}
            standalone={false}
            style={{ data: { stroke: "#1C3F52", strokeWidth: 4 } }}
          />
        </G>
      </VictoryChart>
    </View>
  );
};

export default ChartB;
