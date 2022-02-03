import React from "react";
import { useEffect, useState } from "react";
import { VictoryChart, VictoryLine } from "victory-native";
import { database } from "../firebase";

const dummyData = [
  { x: 1, y: 2 },
  { x: 2, y: 3 },
  { x: 3, y: 5 },
  { x: 4, y: 4 },
  { x: 5, y: 7 },
];

const ChartB = () => {
  // const [data, setData] = useState([]);

  // useEffect(() => {
  //   //get data from firebase.  the reference for the data was established when it was written into the database.  This is getting a "snapshot" of the data
  //   const sleepEntriesRef = database.ref("simplesleepEntries");

  //   //this on method gets the value of the data at that reference.
  //   sleepEntriesRef.on("value", (snapshot) => {
  //     const sleepEntryData = snapshot.val();
  //     //Im trying to put the data on local state so that it can be passed to the chart view.  this isn't working.  I'm not sure why.
  //     setData(sleepEntryData);
  //   });
  // }, []);

  // const reformatDataForChart = (dbData) => {
  //   return dbData.map((dbSleepEntry) => {
  //     return {
  //       SleepLength: dbSleepEntry.length,
  //       SleepQuality: dbSleepEntry.quality,
  //     };
  //   });
  // };
  return (
    <VictoryChart>
      <VictoryLine
        data={dummyData}
        style={{
          data: { stroke: "#c43a31" },
          parent: { border: "1px solid #ccc" },
        }}
        x="Time"
        y="Quality"
      />
    </VictoryChart>
  );
};

export default ChartB;
