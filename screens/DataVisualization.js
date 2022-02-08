import { View, Text, Switch } from "react-native";
import React from "react";
import { useState } from "react";
import tw from "tailwind-react-native-classnames";
import ChartA from "./ChartA";
import ChartB from "./ChartB";

const DataVisualization = () => {
  const [viewChartA, toggleChartView] = useState(true);

  return (
    <View>
      <View style={tw` items-center justify-center`}>
        <Switch
          value={viewChartA}
          onValueChange={() => toggleChartView(!viewChartA)}
        />
        {viewChartA ? <ChartA /> : <ChartB />}
      </View>
    </View>
  );
};

export default DataVisualization;
