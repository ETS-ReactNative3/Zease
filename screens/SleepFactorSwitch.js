import { View, Text, Switch } from "react-native";
import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import tw from "tailwind-react-native-classnames";

import { addFactor, removeFactor } from "../store/userFactors";

const SleepFactorSwitch = (props) => {
  const dispatch = useDispatch();
  const { factorId, factor } = props;
  const [factorRelevant, setFactorRelevance] = useState(false);
  let userFactors = useSelector((state) => state.userFactors);

  //if userFactors is updated check if the switch value needs to be updated.
  useEffect(() => {
    for (let userFactorId in userFactors) {
      if (factorId === userFactorId) {
        setFactorRelevance(true);
      }
    }
  }, []);

  //update userFactors for local state and redux when switch is toggled
  const toggleSwitch = () => {
    setFactorRelevance((previousValue) => !previousValue);
    //if the factor is already on userfactors it should be removed
    if (userFactors[factorId]) {
      factor.id = factorId;
      dispatch(removeFactor(factor));
    }

    //if the factor is not already on userFactors it should be added
    if (!userFactors[factorId]) {
      factor.id = factorId;
      dispatch(addFactor(factor));
    }
  };
  return (
    <View style={tw`flex-row`}>
      <Switch value={factorRelevant} onValueChange={() => toggleSwitch()} />
      <Text>{props.factor.name}</Text>
    </View>
  );
};

export default SleepFactorSwitch;
