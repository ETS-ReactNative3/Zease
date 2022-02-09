import React from "react";
import { Text, View } from "react-native";
import { useEffect, useState } from "react";
import {
  VictoryChart,
  VictoryAxis,
  VictoryScatter,
  VictoryTooltip,
} from "victory-native";
import { Picker } from "@react-native-picker/picker";
import { useSelector } from "react-redux";

const ChartA = ({ data }) => {

  const [userFactors, setUserFactors] = useState([]);
  const [selectedFactor, setSelectedFactor] = useState("");
  const userFactorsObj = useSelector((state) => state.userFactors);

  //get sleep factors for this user from firebase.
  useEffect(() => {
    const userFactorsArr = [];
    for (let factorId in userFactorsObj) {
      let factor = userFactorsObj[factorId];
      factor.id = factorId;
      userFactorsArr.push(factor);
    }
    setUserFactors(userFactorsArr);
  }, [userFactorsObj]);

  return (
    <View>
      <VictoryChart domainPadding={{ x: [10, 10], y: [10, 10] }}>
        <VictoryAxis
          style={{ axisLabel: { padding: 36 } }}
          label="Sleep Quality (%)"
          dependentAxis
          domain={[data.sleepQualityMin, data.sleepQualityMax]}
        />
        <VictoryAxis
          style={{ axisLabel: { padding: 36 } }}
          label="Sleep Duration (Hours)"
          domain={[data.sleepDurationMin, data.sleepDurationMax]}
        />
        <VictoryScatter
          data={data.scatterData}
          x="sleepDuration"
          y="sleepQuality"
          style={{
            data: {
              fill: ({ datum }) =>
                datum[selectedFactor] ? "#F78A03" : "#1C3F52",
            },
          }}
          labelComponent={<VictoryTooltip />}
        />
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
