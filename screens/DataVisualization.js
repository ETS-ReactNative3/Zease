import { View, Text, Switch, Pressable } from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tw from "tailwind-react-native-classnames";

import { database, auth } from "../firebase";
import ChartA from "./ChartA";
import ChartB from "./ChartB";

const DataVisualization = () => {
  const [viewChartA, setViewChartA] = useState(true);
  const [timeRange, setTimeRange] = useState("week");
  const [data, setData] = useState([]);

  //get sleep entry data from firebase
  useEffect(async () => {
    const userId = auth.currentUser.uid;

    //get data from firebase. This is getting a "snapshot" of the data
    const sleepEntriesRef = database.ref(`sleepEntries/${userId}`);

    //this on method gets the value of the data at that reference.
    sleepEntriesRef.on("value", (snapshot) => {
      const sleepEntryData = snapshot.val();
      setData(sleepEntryData);
    });
  }, []);

  return (
    <View>
      <View style={tw`items-center`}>
        <View style={tw`flex-row`}>
          <Pressable onPress={() => setViewChartA(true)}>
            <Text
              style={tw`w-20 px-3 py-2 my-2 ${
                viewChartA ? `bg-blue-500 text-white` : `bg-gray-300 text-black`
              } text-center`}
            >
              Scatter
            </Text>
          </Pressable>
          <Pressable onPress={() => setViewChartA(false)}>
            <Text
              style={tw`w-20 px-3 py-2 my-2 rounded-full ${
                !viewChartA ? `bg-blue-500 text-white` : `bg-gray-300 text-black`
              } text-center`}
            >
              Line
            </Text>
          </Pressable>
        </View>
        <View style={tw`flex-row`}>
          <Pressable onPress={() => setTimeRange("week")}>
            <Text
              style={tw`w-20 px-3 py-2 my-2 ${
                timeRange==="week" ? `bg-blue-500 text-white` : `bg-gray-300 text-black`
              } text-center`}
            >
              1W
            </Text>
          </Pressable>
          <Pressable onPress={() => setTimeRange("month")}>
            <Text
              style={tw`w-20 px-3 py-2 my-2 ${
                timeRange==="month" ? `bg-blue-500 text-white` : `bg-gray-300 text-black`
              } text-center`}
            >
              1M
            </Text>
          </Pressable>
          <Pressable onPress={() => setTimeRange("year")}>
            <Text
              style={tw`w-20 px-3 py-2 my-2 ${
                timeRange==="year"? `bg-blue-500 text-white` : `bg-gray-300 text-black`
              } text-center`}
            >
              1Y
            </Text>
          </Pressable>
          <Pressable onPress={() => setTimeRange("all")}>
            <Text
              style={tw`w-20 px-3 py-2 my-2 ${
                timeRange==="all" ? `bg-blue-500 text-white` : `bg-gray-300 text-black`
              } text-center`}
            >
              All
            </Text>
          </Pressable>
        </View>
        {viewChartA ? <ChartA data={data} /> : <ChartB data={data} />}
      </View>
    </View>
  );
};

export default DataVisualization;
