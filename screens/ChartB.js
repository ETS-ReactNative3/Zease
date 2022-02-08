import React from "react";
import { Text, View } from "react-native";
import { useEffect, useState } from "react";
import {
  VictoryChart,
  VictoryLabel,
  VictoryAxis,
  VictoryLine,
} from "victory-native";
import { G } from "react-native-svg";
import { useSelector } from "react-redux";
import { getDateObj, calculateSleepLength } from "../Util";

const ChartB = () => {
  //get data in array form from redux, but it still needs to be rearranged for the chart
  let userEntries = useSelector((state) => state.userEntries);
  let newestEntry = useSelector((state) => state.newestEntry);
  let oldestEntry = useSelector((state) => state.oldestEntry);
  const [xDomain, setXDomain] = useState([
    new Date(2022, 2, 1),
    new Date(2022, 2, 14),
  ]);
  const [xTickValues, setXTickValues] = useState([]);

  //on page load determine x axis domain based on oldest and newest date
  useEffect(() => {
    const newestDateObj = getDateObj(newestEntry.date);
    const oldestDateObj = getDateObj(oldestEntry.date);
    setXDomain([oldestDateObj, newestDateObj]);
    //console.log("oldest date object", oldestDateObj);
    //console.log("newestDateObj", JSON.parse(newestEntryString).date);
    //console.log("oldest Date", JSON.parse(oldestEntryString).date);
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

  const getSleepLengthData = (userEntriesArray) => {
    return userEntriesArray.map((entry) => {
      return {
        x: getDateObj(entry.date),
        y: calculateSleepLength(entry),
      };
    });
  };

  const getSleepQualityData = (userEntriesArray) => {
    return userEntriesArray.map((entry) => {
      return {
        x: getDateObj(entry.date),
        y: entry.quality,
      };
    });
  };

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
          x={310}
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
            dependentAxis
            orientation="left"
            standalone={false}
            style={{ axis: { stroke: "#F78A03", strokeWidth: 2 } }}
          />
          {/*line chart for sleep duration */}
          <VictoryLine
            data={getSleepLengthData(userEntries)}
            domain={{
              x: xDomain,
              y: [0, 17],
            }}
            scale={{ x: "time", y: "linear" }}
            standalone={false}
            style={{ data: { stroke: "#F78A03", strokeWidth: 4 } }}
          />
          {/*y axis for sleep quality */}
          <VictoryAxis
            offsetX={50}
            domain={[0, 100]}
            dependentAxis
            orientation="right"
            standalone={false}
            style={{ axis: { stroke: "#1C3F52", strokeWidth: 2 } }}
          />
          {/*line chart for sleep quality */}
          <VictoryLine
            data={getSleepQualityData(userEntries)}
            domain={{
              x: xDomain,
              y: [0, 100],
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
