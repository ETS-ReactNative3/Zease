import React from "react";
import { Text, View, TouchableOpacity, Modal, StyleSheet, Pressable } from "react-native";
import { useState } from "react";
import { VictoryPie } from "victory-native";

import tw from "tailwind-react-native-classnames";
import { Ionicons } from "@expo/vector-icons";

const ChartC = ({ data }) => {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedPie, setSelectedPie] = useState("start");

  return (
    <View>
      <View style={tw`items-center`}>
        <View style={tw`flex-row`}>
          <Pressable onPress={() => setSelectedPie("start")}>
            <Text
              style={tw`w-40 px-3 py-2 my-2 ${
                selectedPie === "start" ? `bg-yellow-500 text-white` : `bg-gray-300 text-black`
              } text-center`}
            >
              Bed Time
            </Text>
          </Pressable>
          <Pressable onPress={() => setSelectedPie("end")}>
            <Text
              style={tw`w-40 px-3 py-2 my-2 ${
                selectedPie === "end" ? `bg-yellow-500 text-white` : `bg-gray-300 text-black`
              } text-center`}
            >
              Wake Up Time
            </Text>
          </Pressable>
        </View>
      </View>
      <TouchableOpacity onPress={() => setShowInfoModal(true)}>
        <Ionicons style={tw`mt-1 pr-10 self-end`} name="information-circle-outline" size={25} />
      </TouchableOpacity>

      {selectedPie === "start" ? (
        <VictoryPie
          padAngel={5}
          innerRadius={0}
          labelRadius={({ innerRadius }) => innerRadius + 35}
          colorScale={["#F78A03", "#1C3F52"]}
          data={[
            { x: "Bed Time Met", y: data.sleepStartGoalMet },
            { x: "Bed Time Missed", y: data.sleepStartGoalMissed }
          ]}
          style={{ labels: { fill: "white", fontSize: 16, fontEight: "bold" } }}
        />
      ) : (
        <VictoryPie
          padAngel={5}
          innerRadius={0}
          labelRadius={({ innerRadius }) => innerRadius + 25}
          colorScale={["#F78A03", "#1C3F52"]}
          data={[
            { x: "Wake Time Met", y: data.sleepEndGoalMet },
            { x: "Wake Time Missed", y: data.sleepEndGoalMissed }
          ]}
          style={{ labels: { fill: "white", fontSize: 16, fontEight: "bold" } }}
        />
      )}

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
              This pie chart shows how often you are going to sleep (or waking up) within fifteen
              minutes of your goal.
            </Text>
            <Text style={tw`p-4 text-base`}>
              Toggling through the different time windows can show the progress you have been making
              on this.
            </Text>
          </View>
          <TouchableOpacity onPress={() => setShowInfoModal(!showInfoModal)} style={styles.button}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default ChartC;

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#F78A03",
    paddingVertical: 12,
    width: 150,
    marginVertical: 10,
    borderRadius: 10
  },
  buttonText: {
    color: "white",
    fontWeight: "bold"
  }
});
