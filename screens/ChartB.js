import React from "react";
import { Text, View } from "react-native";
import { useEffect, useState } from "react";
import { VictoryChart } from "victory-native";

const ChartB = (props) => {
  //data from db has already been pulled in by parent comppnent.  However it still needs to be reformatted.
  const sleepEntryDbData = props.data;

  return (
    <View>
      <Text>Line chart goes here</Text>
    </View>
  );
};

export default ChartB;
