import {
  View,
  TouchableOpacity,
  Text,
  Switch,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import React from "react";
import { useEffect, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "react-native-heroicons/outline";
/*
each SleepFactorCategory component in the build profile screen will be passed a category object through props with this format:
category= {
  name: "Chemical",
  factors: ["Caffeine", "CBD", "Melatonin"]
}
*/
const SleepFactorCategory = (props) => {
  const [category, setCategory] = useState(props.category.name);
  const [factors, setFactors] = useState(props.category.factors);
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
        <Text>{category}</Text>
        {expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </TouchableOpacity>
    </View>
  );
};

export default SleepFactorCategory;
