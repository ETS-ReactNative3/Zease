import { View, Text, Switch } from "react-native";
import React from "react";
import { useState } from "react";

const SleepFactorSwitch = (props) => {
  const [factorRelevant, setFactorRelevance] = useState(false);
  return (
    <View>
      <Switch
        value={factorRelevant}
        onValueChange={() =>
          setFactorRelevance((previousValue) => !previousValue)
        }
      />
      <Text>{props.factor}</Text>
    </View>
  );
};

export default SleepFactorSwitch;
