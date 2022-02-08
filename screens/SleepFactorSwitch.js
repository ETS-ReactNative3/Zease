import { View, Text, Switch } from "react-native";
import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
//import AsyncStorage from "@react-native-async-storage/async-storage";
import tw from "tailwind-react-native-classnames";

import { addFactor, removeFactor } from "../store/userFactors";

const SleepFactorSwitch = (props) => {
  const dispatch = useDispatch();
  const { factorId, factor } = props;
  const [factorRelevant, setFactorRelevance] = useState(false);
  //const [userFactors, setUserFactors] = useState(null);
  let userFactors = useSelector((state) => state.userFactors);

  // //when the page loads put any userFactors from async storage on local state.
  // useEffect(async () => {
  //   const userFactorsString = await AsyncStorage.getItem("userFactors");
  //   const userFactors = userFactorsString
  //     ? JSON.parse(userFactorsString)
  //     : null;
  //   // console.log(
  //   //   "userFactors from useEffect in sleepFactor switch",
  //   //   userFactors
  //   // );
  //   setUserFactors(userFactors);
  // }, []);

  //if userFactors is updated check if the switch value needs to be updated.
  useEffect(() => {
    //console.log("userFactors from useEffect in factorswitch, ", userFactors);
    for (let userFactorId in userFactors) {
      if (factorId === userFactorId) {
        setFactorRelevance(true);
      }
    }
  }, [userFactors]);

  //update userFactors for local state and async storage when switch is toggled
  const toggleSwitch = () => {
    setFactorRelevance((previousValue) => !previousValue);

    //if the factor is already on userfactors it should be removed
    console.log();
    if (userFactors[factorId]) {
      dispatch(removeFactor(factor));
    }

    //if the factor is not already on userFactors it should be added
    if (!userFactors[factorId]) {
      dispatch(addFactor(factor));
    }

    // try {
    //   let newUserFactors = {};
    //   if (userFactors && userFactors[factorId]) {
    //     //if old user factors object currently includes this factor's key value pair, remove it.
    //     newUserFactors = { ...userFactors };
    //     delete newUserFactors[factorId];
    //   }

    //   if (userFactors && !userFactors[factorId]) {
    //     //if the old user factors object doesn't include this factor's key value pair, add it.
    //     newUserFactors = { ...userFactors, [factorId]: factor };
    //   }
    //   if (userFactors === null) {
    //     //if the old user factors object is null, the new factors object will have just this factor's key value pair in it.
    //     newUserFactors[factorId] = factor;
    //   }
    //   //uncomment next line to clear async store's userFactors
    //   //newUserFactors = {};
    //   //console.log("new user factors",newUserFactors);

    //   //store the updated user factors in async storage.
    //   await AsyncStorage.setItem("userFactors", JSON.stringify(newUserFactors));
    //   setUserFactors(newUserFactors);
    // } catch (error) {
    //   console.log(
    //     "There was an error in trying to update async storage with this sleep factor:",
    //     error
    //   );
    // }
  };
  return (
    <View style={tw`flex-row`}>
      <Switch value={factorRelevant} onValueChange={() => toggleSwitch()} />
      <Text>{props.factor.name}</Text>
    </View>
  );
};

export default SleepFactorSwitch;
