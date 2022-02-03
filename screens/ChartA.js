import React from "react";
import { useEffect, useState } from "react";
import { VictoryChart, VictoryScatter } from "victory-native";
import { database } from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

// const DummyDBData= {
//   1:{
//     1:{

//     }
//   }
// }
// const userId = "AbNQWuHhkpSGbArIfJ17twjyuum1";

const ChartA = () => {
  const [data, setData] = useState([]);

  useEffect(async () => {
    //get the userId from async storage
    const userId = await AsyncStorage.getItem("userID");
    console.log("userId pulled from Async storage: ", userId);

    //get data from firebase.  the reference for the data was established when it was written into the database.  This is getting a "snapshot" of the data
    const sleepEntriesRef = database.ref(`sleepEntries/${JSON.parse(userId)}`);

    //this on method gets the value of the data at that reference.
    sleepEntriesRef.on("value", (snapshot) => {
      const sleepEntryData = snapshot.val();
      console.log(
        "sleep entry data pulled from db before it is put on local state",
        sleepEntryData
      );
      setData(sleepEntryData);
    });
  }, []);

  const reformatDataForChart = (dbData) => {
    console.log("Database data: ", dbData);
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
