import React from 'react';
import { Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { VictoryChart, VictoryAxis, VictoryLine, VictoryTheme } from 'victory-native';

const ChartB = (props) => {
  //data from db has already been pulled in by parent comppnent.  However it still needs to be reformatted.
  // const sleepEntryDbData = props.data;

  const data = [
    // x: (date), y: (hours)
    [
      { x: 1, y: 5 },
      { x: 2, y: 7 },
      { x: 3, y: 8 },
      { x: 4, y: 7 }
    ],

    // x: (date), y: (sleep quality score)
    [
      { x: 1, y: 50 },
      { x: 2, y: 75 },
      { x: 3, y: 90 },
      { x: 4, y: 85 }
    ]
  ];
  // find maxima for normalizing data
  const maxima = data.map((dataset) => Math.max(...dataset.map((d) => d.y)));

  const xOffsets = [50, 350];
  const tickPadding = [0, 0, 20];
  const anchors = ['end', 'start'];
  const colors = ['red', 'blue'];

  return (
    <View>
      <VictoryChart width={400} height={400} domain={{ y: [0, 1] }} theme={VictoryTheme.material}>
        <VictoryAxis
          label='Dates'
          style={{ axisLabel: { padding: 36 } }}
          theme={VictoryTheme.material}
        />
        {data.map((d, i) => (
          <VictoryAxis
            label='Hours Slept'
            dependentAxis
            key={i}
            offsetX={xOffsets[i]}
            style={{
              axis: { stroke: colors[i] },
              axisLabel: { padding: 24 },
              tickLabels: { fill: colors[i], textAnchor: anchors[i] }
            }}
            // Use normalized tickValues (0 - 1)
            tickValues={[0.25, 0.5, 0.75, 1]}
            // Re-scale ticks by multiplying by correct maxima
            tickFormat={(t) => t * maxima[i]}
            theme={VictoryTheme.material}
          />
        ))}
        {data.map((d, i) => (
          <VictoryLine
            key={i}
            data={d}
            style={{ data: { stroke: colors[i] } }}
            // normalize data
            y={(datum) => datum.y / maxima[i]}
            theme={VictoryTheme.material}
          />
        ))}
      </VictoryChart>
    </View>
  );
};

export default ChartB;
