import React from "react";
import { useEffect, useState } from "react";
import { VictoryChart, VictoryScatter } from "victory-native";
import { database } from "../firebase";

// const dummyData = [
//   {
//     date: new Date(2022, 1, 1),
//     sleepLength: 420,
//     quality: "poor",
//     factors: ["screentime", "caffeine"],
//   },
//   {
//     date: new Date(2022, 1, 2),
//     sleepLength: 430,
//     quality: "ok",
//     factors: ["screentime", "caffeine"],
//   },
//   {
//     date: new Date(2022, 1, 3),
//     sleepLength: 440,
//     quality: "ok",
//     factors: ["caffeine"],
//   },
// ];

const ChartA = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    //get data from firebase.  the reference for the data was established when it was written into the database.  This is getting a "snapshot" of the data
    const sleepEntriesRef = database.ref("simplesleepEntries");

    //this on method gets the value of the data at that reference.
    sleepEntriesRef.on("value", (snapshot) => {
      const sleepEntryData = snapshot.val();
      //Im trying to put the data on local state so that it can be passed to the chart view.  this isn't working.  I'm not sure why.
      setData(sleepEntryData);
    });
  }, []);

  const reformatDataForChart = (dbData) => {
    return dbData.map((dbSleepEntry) => {
      return {
        SleepLength: dbSleepEntry.length,
        SleepQuality: dbSleepEntry.quality,
      };
    });
  };
  return (
    <VictoryChart>
      {data && (
        <VictoryScatter
          data={reformatDataForChart(data)}
          x="SleepLength"
          y="SleepQuality"
        />
      )}
    </VictoryChart>
  );
};

export default ChartA;
