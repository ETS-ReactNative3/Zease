import React from "react";
import { Text, View } from "react-native";
import { useEffect, useState } from "react";
import {
  VictoryChart,
  VictoryAxis,
  VictoryScatter,
  VictoryTooltip,
} from "victory-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { database, auth } from "../firebase";
import { reformatDate, calculateSleepLength } from "../Util";

const ChartA = (props) => {
  const data = props.data;
  const [userFactors, setUserFactors] = useState([]);
  const [selectedFactor, setSelectedFactor] = useState("");

  //get sleep factors for this user from firebase.
  useEffect(async () => {

    const userId = auth.currentUser.uid;

    //get data from firebase. This is getting a "snapshot" of the data
    const userRef = database.ref(`users/${userId}`);

    //this on method gets the value of the data at that reference.
    userRef.on("value", (snapshot) => {
      const user = snapshot.val();
      const userFactorsObj = user.userFactors;
      const userFactorsArr = [];
      for (let factorId in userFactorsObj) {
        let factor = userFactorsObj[factorId];
        factor.id = factorId;
        userFactorsArr.push(factor);
      }
      setUserFactors(userFactorsArr);
    });
  }, []);

  const reformatDataForChart = (dbDataObject) => {
    const dbDataArray = [];
    for (let entryId in dbDataObject) {
      let entry = dbDataObject[entryId];

      let entryForChart = {
        SleepLength: calculateSleepLength(entry),
        SleepQuality: entry.quality,
        date: entry.date,
        label: reformatDate(entry.date),
      };

      //put the name of the factor directly on the entry object. (perhaps it should be the id of the factor?)
      for (let entryFactorId in entry.entryFactors) {
        let entryFactor = entry.entryFactors[entryFactorId];
        entryForChart[entryFactor.name] = true;
      }

      dbDataArray.push(entryForChart);
    }
    return dbDataArray;
  };

  const structureData = (dataRaw, timeRange) => {
    console.log(dataRaw);
    const timeMap = {
      "week": 7 * (1000 * 60 * 60 * 24),
      "month": 30 * (1000 * 60 * 60 * 24),
      "year": 365 * (1000 * 60 * 60 * 24),
    }
    const today = new Date()
    today.setHours(0,0,0,)
    const chartData = [];
    let sleepDurationMin = 0;
    let sleepDurationMax = 0;
    let sleepQualityMin = 0;
    let sleepQualityMax = 0;
    Object.values(dataRaw).forEach(entry => {
      console.log("today", today)
      console.log("entry date", new Date(entry.date))
      console.log("timeMap", timeMap[timeRange])
      if (timeRange === "all" || today - new Date(entry.date) < timeMap[timeRange]) {
        let formatEntry = {
          sleepDuration: calculateSleepLength(entry),
          sleepQuality: entry.quality,
          date: entry.date,
          label: reformatDate(entry.date),
        };
        Object.values(entry.entryFactors).forEach(factor => {
          formatEntry[factor.name] = true;
        })
        chartData.push(formatEntry);
        sleepDurationMin = Math.min(sleepDurationMin, formatEntry.sleepDuration)
        sleepDurationMax =  Math.max(sleepDurationMax, formatEntry.sleepDuration)
        sleepQualityMin =  Math.min(sleepQualityMin, formatEntry.sleepQuality)
        sleepQualityMax = Math.max(sleepQualityMax, formatEntry.sleepDuration)
      }
    })
    return {chartData, sleepDurationMin, sleepDurationMax, sleepQualityMin, sleepQualityMax}
  } 
  const structuredData = structureData(data, "week");
  console.log("structuredData", structuredData)
  console.log("structuredData.chartData", structuredData.chartData)
  console.log("current data", reformatDataForChart(data))
  

  return (
    <View>
      <VictoryChart
          domainPadding={{x: [10, 10], y: [10, 10]}}
          >
        <VictoryAxis
          style={{ axisLabel: { padding: 36 } }}
          label="Sleep Quality (%)"
          dependentAxis
        />
        <VictoryAxis
          style={{ axisLabel: { padding: 36 } }}
          label="Sleep Duration (Hours)"
          domain={[5.5, 10.5]}
        />
        {data && (
          <VictoryScatter
            data={reformatDataForChart(data)}
            x="SleepLength"
            y="SleepQuality"
            style={{
              data: {
                fill: ({ datum }) =>
                  datum[selectedFactor] ? "#F78A03" : "#1C3F52",
              },
            }}
            labelComponent={<VictoryTooltip />}
          />
        )}
      </VictoryChart>

      <View>
        <Text>Select a Sleep Factor:</Text>
        <Picker
          selectedValue={selectedFactor}
          onValueChange={(factor) => setSelectedFactor(factor)}
        >
          {userFactors.map((factor) => {
            return (
              <Picker.Item
                label={factor.name}
                value={factor.name}
                key={factor.id}
              />
            );
          })}
        </Picker>
      </View>
    </View>
  );
};

export default ChartA;
