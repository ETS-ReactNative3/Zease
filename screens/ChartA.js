import React from "react";
import { Text, View } from "react-native";
import { useEffect, useState } from "react";
import { VictoryChart, VictoryAxis, VictoryScatter } from "victory-native";
import tw from "tailwind-react-native-classnames";

const ChartA = (props) => {
  const data = props.data;

  const reformatDataForChart = (dbDataObject) => {
    const dbDataArray = [];
    for (let entryId in dbDataObject) {
      let entry = dbDataObject[entryId];

      let startHrs = Number(entry.startTime.slice(0, 2));
      let startMin = Number(entry.startTime.slice(3));
      let sleepMinBeforeMidnight = (23 - startHrs) * 60 + (60 - startMin);
      //this line accounts for entries when they user went to sleep after midnight.
      if (startHrs < 10) {
        sleepMinBeforeMidnight = -(startHrs * 60 + startMin);
      }

      let endHrs = Number(entry.endTime.slice(0, 2));
      let endMin = Number(entry.endTime.slice(3));
      let sleepMinAfterMidnight = endHrs * 60 + endMin;
      let entryForChart = {
        SleepLength: (sleepMinBeforeMidnight + sleepMinAfterMidnight) / 60,
        SleepQuality: entry.quality,
        date: entry.date,
      };
      dbDataArray.push(entryForChart);
    }
    return dbDataArray;
  };
  return (
    <View>
      <VictoryChart>
        <VictoryAxis
          style={{ axisLabel: { padding: 36 } }}
          label="Sleep Quality (%)"
          dependentAxis
        />
        <VictoryAxis
          style={{ axisLabel: { padding: 36 } }}
          label="Sleep Duration (Hours)"
        />
        {data && (
          <VictoryScatter
            data={reformatDataForChart(data)}
            x="SleepLength"
            y="SleepQuality"
          />
        )}
      </VictoryChart>
    </View>
  );
};

export default ChartA;
