import {
  View,
  TouchableOpacity,
  Text,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import React from "react";
import { useEffect, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "react-native-heroicons/outline";

import SleepFactorSwitch from "./SleepFactorSwitch";

/*
each SleepFactorCategory component in the build profile screen will be passed a category object through props with this format:
category= {
  name: "Chemical",
  factors: ["Caffeine", "CBD", "Melatonin"]
}
*/
const SleepFactorCategory = (props) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((previousValue) => !previousValue);
  };

  if (Platform.OS === "android") {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  return (
    <View>
      <TouchableOpacity onPress={() => toggleExpand()}>
        {expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
        <Text>{props.category.name}</Text>
      </TouchableOpacity>
      <View />
      {expanded && (
        <View>
          {props.category.factors.map((factor) => {
            return (
              <SleepFactorSwitch
                key={factor[1]}
                factorId={factor[1]}
                factor={factor[0]}
              />
            );
          })}
        </View>
      )}
    </View>
  );
};

export default SleepFactorCategory;
