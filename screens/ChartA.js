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
import { database } from "../firebase";
import { reformatDate } from "../Util";

const ChartA = (props) => {
  const data = props.data;
  const [userFactors, setUserFactors] = useState([]);
  const [selectedFactor, setSelectedFactor] = useState("");
  // const [selectedEntry, setSelectedEntry] = useState({});

  //get slepe factors for this user from firebase.
  useEffect(async () => {
    //get the userId from async storage
    const userId = await AsyncStorage.getItem("userID");

    //get data from firebase. This is getting a "snapshot" of the data
    const userRef = database.ref(`users/${JSON.parse(userId)}`);

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
          onValueChange={(factor, idx) => setSelectedFactor(factor)}
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
