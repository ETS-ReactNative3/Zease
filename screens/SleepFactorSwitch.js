import { View, Text, Switch } from "react-native";
import React from "react";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SleepFactorSwitch = (props) => {
  const [factorRelevant, setFactorRelevance] = useState(false);
  const factorId = props.factorId;

  const toggleSwitch = async () => {
    setFactorRelevance((previousValue) => !previousValue);
    try {
      //get the pre-existing user factors from async storage (if there are any)
      const oldUserFactorsString = await AsyncStorage.getItem("userFactors");

      const oldUserFactors = oldUserFactorsString
        ? JSON.parse(oldUserFactorsString)
        : null;
      console.log("oldUserFactors fetched from async storage", oldUserFactors);
      //
      let newUserFactors = [];
      if (oldUserFactors && oldUserFactors.includes(factorId)) {
        //if old user factors array currently includes this factor's ID, remove it.
        newUserFactors = oldUserFactors.filter((id) => id !== factorId);
        //if the old user factors array doesn't include this factor's ID, add it.
      }

      if (oldUserFactors && !oldUserFactors.includes(factorId)) {
        //if the old user factors array doesn't include this factor's ID, add it.
        newUserFactors = [...oldUserFactors, factorId];
      }
      if (oldUserFactors === null) {
        //if the old user factors array is null, the new factors array will have just this factor's ID in it.
        newUserFactors = [factorId];
      }
      //store the updated user factors in async stroage.
      await AsyncStorage.setItem("userFactors", JSON.stringify(newUserFactors));
    } catch (error) {
      console.log(
        "There was an error in trying to update async storage with this sleep factor:",
        error
      );
    }
  };
  return (
    <View>
      <Switch value={factorRelevant} onValueChange={() => toggleSwitch()} />
      <Text>{props.factor}</Text>
    </View>
  );
};

export default SleepFactorSwitch;
