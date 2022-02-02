import { View, TouchableOpacity, Text, Switch } from "react-native";
import React from "react";
import { useEffect, useState } from "react";

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
  return;
};
