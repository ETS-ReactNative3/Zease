import React from "react";
import { Text, View } from "react-native";
import { useEffect, useState } from "react";
import {
  VictoryChart,
  VictoryLabel,
  VictoryAxis,
  VictoryLine,
} from "victory-native";

import { Svg, G } from "react-native-svg";
import tw from "tailwind-react-native-classnames";
import { getDateObj, calculateSleepLength } from "../Util";
//custom charts are wrapped in svg (and then within the sgv they are wrapped in g).  you need to get a library that allows you to do svg and g though since its not part of react native.

//determining the x domain for the two VictoryLines, tickValues and tickFormat for the x axis (time) could be tricky because the appropriate scale for that axis will depend greatly on how long the data spans.  We'll leave it blank for now and make choices about that once data is rendered.
//^ in order to accomplish this we might do something where we get the most recent and the oldest date from the data set.

const ChartB = (props) => {
  //data from db has already been pulled in by parent component.  However it still needs to be reformatted.
  const sleepEntryDbData = props.data;
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
      <Text>Line chart goes here</Text>
      <VictoryChart>
        <VictoryLabel
          x={25}
          y={20}
          style={{ fill: "#F78A03" }}
          text={"Sleep Length (Hours)"}
        />
        <VictoryLabel
          x={320}
          y={20}
          style={{ fill: "#1C3F52" }}
          text={"Sleep Quality"}
        />
        <G>
          <VictoryAxis scale="time" standalone={false} />
          <VictoryAxis
            domain={[0, 15]}
            dependentAxis
            orientation="left"
            standalone={false}
            style={{ axis: { stroke: "#F78A03", strokeWidth: 2 } }}
          />
          <VictoryLine
            data={getSleepLengthData(sleepEntryDbData)}
            domain={{
              x: [new Date(2022, 2, 1), new Date(2022, 2, 8)],
              y: [0, 15],
            }}
            scale={{ x: "time", y: "linear" }}
            standalone={false}
            style={{ data: { stroke: "#F78A03", strokeWidth: 4 } }}
          />

          <VictoryAxis
            offsetX={50}
            domain={[0, 100]}
            dependentAxis
            orientation="right"
            standalone={false}
            style={{ axis: { stroke: "#1C3F52", strokeWidth: 2 } }}
          />
          <VictoryLine
            data={getSleepQualityData(sleepEntryDbData)}
            domain={{
              x: [new Date(2022, 2, 1), new Date(2022, 2, 8)],
              y: [0, 100],
            }}
            scale={{ x: "time", y: "linear" }}
            standalone={false}
            style={{ data: { stroke: "#1C3F52", strokeWidth: 4 } }}
          />
        </G>
      </VictoryChart>
      {/* <Svg
        style={{ boxSizing: "border-box", display: "inline" }}
        viewBox="0 0 450 350"
      >
        <VictoryLabel
          x={25}
          y={20}
          style={{ fill: "#F78A03" }}
          text={"Sleep Length (Hours)"}
        />
        <VictoryLabel
          x={320}
          y={20}
          style={{ fill: "#1C3F52" }}
          text={"Sleep Quality"}
        />
        <G>
          <VictoryAxis scale="time" standalone={false} />

          <VictoryAxis
            domain={[0, 15]}
            dependentAxis
            orientation="left"
            standalone={false}
            style={{ axis: { stroke: "#F78A03", strokeWidth: 2 } }}
          />
          <VictoryLine
            data={getSleepLengthData(sleepEntryDbData)}
            domain={{
              x: [new Date(2022, 2, 1), new Date(2022, 2, 8)],
              y: [0, 15],
            }}
            scale={{ x: "time", y: "linear" }}
            standalone={false}
            style={{ data: { stroke: "#F78A03", strokeWidth: 4 } }}
          />

          <VictoryAxis
            offsetX={50}
            domain={[0, 100]}
            dependentAxis
            orientation="right"
            standalone={false}
            style={{ axis: { stroke: "#1C3F52", strokeWidth: 2 } }}
          />
          <VictoryLine
            data={getSleepQualityData(sleepEntryDbData)}
            domain={{
              x: [new Date(2022, 2, 1), new Date(2022, 2, 8)],
              y: [0, 100],
            }}
            scale={{ x: "time", y: "linear" }}
            standalone={false}
            style={{ data: { stroke: "#1C3F52", strokeWidth: 4 } }}
          />
        </G>
      </Svg> */}
    </View>
  );
};

export default ChartB;
