import React from 'react';
import { Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { VictoryChart, VictoryAxis, VictoryLine, VictoryTheme } from 'victory-native';

const ChartB = (props) => {
  //data from db has already been pulled in by parent comppnent.  However it still needs to be reformatted.
  // const sleepEntryDbData = props.data;

  // DUMMY DATA
  const data = [
    // x: (date), y: (hours)
    [
      { x: 'Feb 1', y: 5 },
      { x: 'Feb 2', y: 6.5 },
      { x: 'Feb 3', y: 10 },
      { x: 'Feb 4', y: 7 },
      { x: 'Feb 5', y: 7 },
      { x: 'Feb 6', y: 6.5 },
      { x: 'Feb 7', y: 7.5 }
    ],

    // x: (date), y: (sleep quality score)
    [
      { x: 'Feb 1', y: 50 },
      { x: 'Feb 2', y: 65 },
      { x: 'Feb 3', y: 90 },
      { x: 'Feb 4', y: 85 },
      { x: 'Feb 5', y: 75 },
      { x: 'Feb 6', y: 70 },
      { x: 'Feb 7', y: 85 }
    ]
  ];
  // find maxima for normalizing data
  const maxima = data.map((dataset) => Math.max(...dataset.map((d) => d.y)));

  const xOffsets = [50, 350];
  const anchors = ['end', 'start'];
  const colors = ['red', 'blue'];

  return (
    <View>
      <VictoryChart
        width={400}
        height={400}
        maxDomain={{ y: 1.1 }}
        minDomain={{ y: 0 }}
        theme={VictoryTheme.material}
      >
        <VictoryAxis
          label='Sleep Date'
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
            tickValues={[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]}
            // Re-scale ticks by multiplying by correct maxima
            tickFormat={(t) => t * maxima[i]}
            theme={VictoryTheme.material}
          />
        ))}
        {data.map((d, i) => (
          <VictoryLine
            interpolation='natural'
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
