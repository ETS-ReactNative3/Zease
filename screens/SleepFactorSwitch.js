import { View, Text, Switch } from "react-native";
import React from "react";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SleepFactorSwitch = (props) => {
  const [factorRelevant, setFactorRelevance] = useState(false);
  const { factorId, factor } = props;

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
      let newUserFactors = {};
      if (oldUserFactors && oldUserFactors[factorId]) {
        //if old user factors object currently includes this factor's key value pair, remove it.
        newUserFactors = { ...oldUserFactors };
        delete newUserFactors[factorId];
      }

      if (oldUserFactors && !oldUserFactors[factorId]) {
        //if the old user factors object doesn't include this factor's key value pair, add it.
        newUserFactors = { ...oldUserFactors, [factorId]: factor };
      }
      if (oldUserFactors === null) {
        //if the old user factors object is null, the new factors object will have just this factor's key value pair in it.
        newUserFactors[factorId] = factor;
      }
      //store the updated user factors in async storage.
      // newUserFactors = {};
      console.log(
        "new user factors about to be put in local storage",
        newUserFactors
      );
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
      <Text>{props.factor.name}</Text>
    </View>
  );
};

export default SleepFactorSwitch;
