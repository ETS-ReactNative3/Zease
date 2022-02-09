import {
  View,
  Text,
  FlatList,
  Button,
  Switch,
  TouchableOpacity,
  Alert,
  Modal,
  SafeAreaView,
  StyleSheet
} from 'react-native';
import React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import tw from 'tailwind-react-native-classnames';

import { reformatDate, calculateSleepLength, convertToAmPm } from '../Util';

//if this view is accessed from the AllEntries list then the entry data will be passed on props from the parent component.
//if this view is accessed from the Today button in the nav bar the entry data needs to be pulled from redux
const SingleEntry = (props) => {
  const [factorNames, setFactorNames] = useState([]);
  let newestEntry = useSelector((state) => {
    return state.newestEntry;
  });
  const entry = props.entry || newestEntry;

  //When the entry object is changed set the factors array using factors object from the entry object.
  useEffect(() => {
    if (entry.entryFactors) {
      let factors = [];
      for (let factorId in entry.entryFactors) {
        factors.push(entry.entryFactors[factorId].name);
      }
      setFactorNames(factors);
    }
  }, [entry]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={tw`font-bold text-2xl text-white mb-5 text-center`}>
        Overview for {entry.date && reformatDate(entry.date)}
      </Text>
      <View style={styles.contentContainer}>
        <View>
          <View>
            <View style={styles.accountItem}>
              <Text style={tw`font-semibold text-white`}>{`Bed Time:               `}</Text>
              <Text style={tw`font-extrabold text-white`}>
                {entry.startTime && convertToAmPm(entry.startTime)}
              </Text>
            </View>

            <View style={styles.accountItem}>
              <Text style={tw`font-semibold text-white`}>{`Wake Up Time:      `}</Text>
              <Text style={tw`font-extrabold text-white`}>
                {entry.endTime && convertToAmPm(entry.endTime)}
              </Text>
            </View>

            <View style={styles.accountItem}>
              <Text style={tw`font-semibold text-white`}>{`Sleep Duration:    `} </Text>
              <Text style={tw`font-extrabold text-white`}>
                {entry.endTime && Math.floor(calculateSleepLength(entry))} hours,{' '}
                {entry.endTime &&
                  Math.floor(
                    (calculateSleepLength(entry) - Math.floor(calculateSleepLength(entry))) * 60
                  )}{' '}
                minutes
              </Text>
            </View>

            <View style={styles.accountItem}>
              <Text style={tw`font-semibold text-white`}>{`Quality:                   `}</Text>
              <Text style={tw`font-extrabold text-white`}>{entry.quality}%</Text>
            </View>
          </View>
        </View>
        <View>
          <Text style={tw`font-semibold text-white mt-10 mb-2`}>Sleep Factors:</Text>
          <View>
            {factorNames.map((factor) => {
              return (
                <Text key={factor} style={tw`font-extrabold text-white mb-1`}>
                  {factor}
                </Text>
              );
            })}
          </View>
        </View>
        <View style={styles.contentContainer}>
          <Text style={tw`font-semibold text-white mt-10 mb-2`}>Notes:</Text>
          <View>
            <Text style={tw`font-extrabold text-white mb-1`}>{entry.notes}</Text>
          </View>
        </View>
      </View>

      {!props.entry && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => props.navigation.navigate('EditEntry')}
        >
          <Text style={styles.buttonText}>Edit Entry</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1C3F52',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.95
  },
  contentContainer: {
    width: '80%'
  },
  accountItem: {
    flexDirection: 'row',
    paddingTop: 10
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#F78A03',
    paddingVertical: 12,
    width: 150,
    marginVertical: 50,
    borderRadius: 10
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold'
  }
});

export default SingleEntry;
