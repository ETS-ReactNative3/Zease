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
import { Svg, G } from "react-native-svg";
import tw from "tailwind-react-native-classnames";
import { getDateObj, calculateSleepLength } from "../Util";
//custom charts are wrapped in svg (and then within the sgv they are wrapped in g).  you need to get a library that allows you to do svg and g though since its not part of react native.

//determining the x domain for the two VictoryLines, tickValues and tickFormat for the x axis (time) could be tricky because the appropriate scale for that axis will depend greatly on how long the data spans.  We'll leave it blank for now and make choices about that once data is rendered.
//^ in order to accomplish this we might do something where we get the most recent and the oldest date from the data set.

const ChartB = (props) => {
  //data from db has already been pulled in by parent component.  However it still needs to be reformatted.
  const sleepEntryDbData = props.data;
  const [xDomain, setXDomain] = useState([
    new Date(2022, 2, 1),
    new Date(2022, 2, 14),
  ]);
  const [xTickValues, setXTickValues] = useState([]);

  //on page load get oldest and newst entrys from async storage.  This is needed to determine x axis domain
  useEffect(async () => {
    const newestEntryString = await AsyncStorage.getItem("mostRecentEntry");
    const newestDateObj = getDateObj(JSON.parse(newestEntryString).date);
    const oldestEntryString = await AsyncStorage.getItem("oldestEntry");
    const oldestDateObj = getDateObj(JSON.parse(oldestEntryString).date);
    setXDomain([oldestDateObj, newestDateObj]);

    //get the timespan between the oldest and newest entries.
    const msPerDay = 1000 * 60 * 60 * 24;
    const timeSpan = newestDateObj.getTime() - oldestDateObj.getTime();

    //divide the timeSpan by 4 and convert it from ms to days.  That's how often a tick mark should appear on the x axis
    const tickMarkFrequency = Math.floor(timeSpan / msPerDay / 4);

    //make four tick marks, start from the oldest date, and add the tickMarkFrequency
    let tickValues = [];
    for (let i = 1; i < 5; i++) {
      let tickMarkDate = new Date(
        oldestDateObj.getTime() + tickMarkFrequency * i * msPerDay
      );
      tickValues.push(tickMarkDate);
    }
    setXTickValues(tickValues);
  }, []);

  const getSleepLengthData = (dbDataObj) => {
    const dataArray = [];
    for (let entryId in dbDataObj) {
      let entry = dbDataObj[entryId];
      let entryForChart = {
        x: getDateObj(entry.date),
        y: calculateSleepLength(entry),
      };
      dataArray.push(entryForChart);
    }
    return dataArray;
  };

  const getSleepQualityData = (dbDataObj) => {
    const dataArray = [];
    for (let entryId in dbDataObj) {
      let entry = dbDataObj[entryId];
      let entryForChart = {
        x: getDateObj(entry.date),
        y: entry.quality,
      };
      dataArray.push(entryForChart);
    }
    return dataArray;
  };

  return (
    <View>
      <VictoryChart>
        <VictoryLabel
          x={25}
          y={20}
          style={{ fill: "#F78A03" }}
          text="Sleep Length (Hours)"
        />
        <VictoryLabel
          x={310}
          y={20}
          style={{ fill: "#1C3F52" }}
          text="Sleep Quality (%)"
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
            data={getSleepLengthData(sleepEntryDbData)}
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
            data={getSleepQualityData(sleepEntryDbData)}
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
