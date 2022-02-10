import React from "react";
import { Text, View, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import {
  VictoryChart,
  VictoryAxis,
  VictoryScatter,
  VictoryTooltip,
} from "victory-native";
import { Picker } from "@react-native-picker/picker";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";

const ChartA = ({ data }) => {
  const [userFactors, setUserFactors] = useState([]);
  const [selectedFactor, setSelectedFactor] = useState("");
  const userFactorsObj = useSelector((state) => state.userFactors);
  const [showInfoModal, setShowInfoModal] = useState(false);

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
      <TouchableOpacity onPress={() => setShowInfoModal(true)}>
        <Ionicons
          style={tw`mt-1 pr-10 self-end`}
          name="information-circle-outline"
          size={25}
        />
      </TouchableOpacity>
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
      <Modal
        transparent={false}
        animationType="slide"
        visible={showInfoModal}
        onRequestClose={() => setShowInfoModal(!showInfoModal)}
        style={{ backgroundColor: "#3e8cb6" }}
      >
        <View style={tw`flex-1 items-center justify-center`}>
          <View style={tw`p-4`}>
            <Text style={tw`p-4 text-base`}>
              This scatter plot shows a point for each sleep entry.
            </Text>
            <Text style={tw`p-4 text-base`}>
              The best sleep entries will be in the upper right corner; they
              have the best quality and the longest duration.
            </Text>
            <Text style={tw`p-4 text-base`}>
              Select a sleep factor to highlight all entries that include it.
            </Text>
            <Text style={tw`p-4 text-base`}>
              If a factor's highlighted entries are grouped together it shows a
              relationship between that factor and the quality or length of your
              sleep.
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowInfoModal(!showInfoModal)}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default ChartA;

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#F78A03",
    paddingVertical: 12,
    width: 150,
    marginVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
