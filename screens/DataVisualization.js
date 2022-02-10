import { View, Text, Switch, Pressable, StyleSheet } from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import tw from "tailwind-react-native-classnames";
import { StatusBar } from "expo-status-bar";

import {
  reformatDate,
  calculateSleepLength,
  getDateObj,
  getBedTime,
  getWakeTime,
} from "../Util";
import ChartA from "./ChartA";
import ChartB from "./ChartB";
import ChartC from "./ChartC";

const DataVisualization = () => {
  const [selectedChart, setSelectedChart] = useState("A");
  const [timeRange, setTimeRange] = useState("week");
  const sleepGoalStart = useSelector((state) => state.profile.sleepGoalStart);
  const sleepGoalEnd = useSelector((state) => state.profile.sleepGoalEnd);

  const data = useSelector((state) => state.userEntries);

  const structureData = (dataRaw, timeRange) => {
    console.log("structuring data");
    console.log("data", dataRaw);
    const timeMap = {
      week: 7 * (1000 * 60 * 60 * 24),
      month: 30 * (1000 * 60 * 60 * 24),
      year: 365 * (1000 * 60 * 60 * 24),
    };
    const today = new Date();
    today.setHours(0, 0, 0);
    const scatterData = [];
    const lineDurationData = [];
    const lineQualityData = [];

    let sleepDurationMin = 24;
    let sleepDurationMax = 0;
    let sleepQualityMin = 100;
    let sleepQualityMax = 0;
    let firstDate = "3022-01-01";
    let lastDate = "1022-01-01";
    let sleepStartGoalMet = 0;
    let sleepStartGoalMissed = 0;
    let sleepEndGoalMet = 0;
    let sleepEndGoalMissed = 0;
    dataRaw.forEach((entry) => {
      if (
        timeRange === "all" ||
        today - new Date(entry.date) < timeMap[timeRange]
      ) {
        let formatEntry = {
          sleepDuration: calculateSleepLength(entry),
          sleepQuality: entry.quality,
          date: entry.date,
          label: reformatDate(entry.date),
        };
        if (entry.entryFactors) {
          Object.values(entry.entryFactors).forEach((factor) => {
            formatEntry[factor.name] = true;
          });
        }
        scatterData.push(formatEntry);
        lineDurationData.push({
          x: getDateObj(entry.date),
          y: calculateSleepLength(entry),
        });
        lineQualityData.push({ x: getDateObj(entry.date), y: entry.quality });
        sleepDurationMin = Math.min(
          sleepDurationMin,
          formatEntry.sleepDuration
        );
        sleepDurationMax = Math.max(
          sleepDurationMax,
          formatEntry.sleepDuration
        );
        sleepQualityMin = Math.min(sleepQualityMin, formatEntry.sleepQuality);
        sleepQualityMax = Math.max(sleepQualityMax, formatEntry.sleepQuality);

        if (firstDate > entry.date) firstDate = entry.date;
        if (lastDate < entry.date) lastDate = entry.date;
        if (
          getBedTime(entry.startTime) > getBedTime(sleepGoalStart) - 15 &&
          getBedTime(entry.startTime) < getBedTime(sleepGoalStart) + 15
        ) {
          sleepStartGoalMet++;
        } else {
          sleepStartGoalMissed++;
        }
        if (
          getWakeTime(entry.endTime) > getWakeTime(sleepGoalEnd) - 15 &&
          getWakeTime(entry.endTime) < getWakeTime(sleepGoalEnd) + 15
        ) {
          sleepEndGoalMet++;
        } else {
          sleepEndGoalMissed++;
        }
      }
    });
    return {
      scatterData,
      lineDurationData,
      lineQualityData,
      sleepDurationMin,
      sleepDurationMax,
      sleepQualityMin,
      sleepQualityMax,
      firstDate,
      lastDate,
      sleepStartGoalMet,
      sleepStartGoalMissed,
      sleepEndGoalMet,
      sleepEndGoalMissed,
    };
  };

  if (data.length <= 1) {
    return (
      <View style={styles.container}>
        <Text style={tw`font-semibold text-white`}>
          {" "}
          Come back to view the data once you have more entries!
        </Text>
      </View>
    );
  }
  return (
    <View>
      <View style={styles.contentContainer}>
        <View style={tw`items-center`}>
          <View style={tw`flex-row`}>
            <Pressable onPress={() => setSelectedChart("A")}>
              <Text
                style={tw`w-20 px-3 py-2 my-2 ${
                  selectedChart === "A"
                    ? `bg-blue-500 text-white`
                    : `bg-gray-300 text-black`
                } text-center`}
              >
                Scatter
              </Text>
            </Pressable>
            <Pressable onPress={() => setSelectedChart("B")}>
              <Text
                style={tw`w-20 px-3 py-2 my-2 rounded-full ${
                  selectedChart === "B"
                    ? `bg-blue-500 text-white`
                    : `bg-gray-300 text-black`
                } text-center`}
              >
                Line
              </Text>
            </Pressable>
            <Pressable onPress={() => setSelectedChart("C")}>
              <Text
                style={tw`w-20 px-3 py-2 my-2 rounded-full ${
                  selectedChart === "C"
                    ? `bg-blue-500 text-white`
                    : `bg-gray-300 text-black`
                } text-center`}
              >
                Pie
              </Text>
            </Pressable>
          </View>
          <View style={tw`flex-row`}>
            <Pressable onPress={() => setTimeRange("week")}>
              <Text
                style={tw`w-20 px-3 py-2 my-2 ${
                  timeRange === "week"
                    ? `bg-blue-500 text-white`
                    : `bg-gray-300 text-black`
                } text-center`}
              >
                1W
              </Text>
            </Pressable>
            <Pressable onPress={() => setTimeRange("month")}>
              <Text
                style={tw`w-20 px-3 py-2 my-2 ${
                  timeRange === "month"
                    ? `bg-blue-500 text-white`
                    : `bg-gray-300 text-black`
                } text-center`}
              >
                1M
              </Text>
            </Pressable>
            <Pressable onPress={() => setTimeRange("year")}>
              <Text
                style={tw`w-20 px-3 py-2 my-2 ${
                  timeRange === "year"
                    ? `bg-blue-500 text-white`
                    : `bg-gray-300 text-black`
                } text-center`}
              >
                1Y
              </Text>
            </Pressable>
            <Pressable onPress={() => setTimeRange("all")}>
              <Text
                style={tw`w-20 px-3 py-2 my-2 ${
                  timeRange === "all"
                    ? `bg-blue-500 text-white`
                    : `bg-gray-300 text-black`
                } text-center`}
              >
                All
              </Text>
            </Pressable>
          </View>
          {data.length && selectedChart === "A" && (
            <ChartA data={structureData(data, timeRange)} />
          )}
          {data.length && selectedChart === "B" && (
            <ChartB data={structureData(data, timeRange)} />
          )}
          {data.length && selectedChart === "C" && (
            <ChartC data={structureData(data, timeRange)} />
          )}
        </View>
      </View>
      <StatusBar style="dark" />
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    marginTop: 60,
  },
});

export default DataVisualization;
