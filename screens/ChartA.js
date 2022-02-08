import React from "react";
import { Text, View } from "react-native";
import { useEffect, useState } from "react";
import {
  VictoryChart,
  VictoryAxis,
  VictoryScatter,
  VictoryTooltip,
} from "victory-native";
import { useSelector } from "react-redux";
import { Picker } from "@react-native-picker/picker";
import { database, auth } from "../firebase";
import { reformatDate, calculateSleepLength } from "../Util";

const ChartA = (props) => {
  const data = props.data;
  let userEntries = useSelector((state) => state.userEntries);

  const [userFactors, setUserFactors] = useState([]);
  const [selectedFactor, setSelectedFactor] = useState("");

  //get sleep factors for this user from firebase.
  useEffect(async () => {
    //get the userId from async storage
    const userId = auth.currentUser ? auth.currentUser.uid : currentUserId;

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

  const reformatDataForChart = (userEntriesArray) => {
    return userEntriesArray.map((entry) => {
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
      return entryForChart;
    });
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
            data={reformatDataForChart(userEntries)}
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
