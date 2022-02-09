import {
  View,
  Text,
  FlatList,
  Button,
  Switch,
  TouchableOpacity,
  Alert,
  Modal,
  StyleSheet
} from 'react-native';
import React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import tw from 'tailwind-react-native-classnames';
import { StatusBar } from 'expo-status-bar';

import { reformatDate, calculateSleepLength, convertToAmPm, yesterday } from '../Util';

//if this view is accessed from the AllEntries list then the entry data will be passed on props from the parent component.
//if this view is accessed from the Today button in the nav bar the entry data needs to be pulled from redux
const SingleEntry = (props) => {
  const [entry, setEntry] = useState(props.entry || {});
  const [factorNames, setFactorNames] = useState([]);
  const [isYesterdaysEntry, setIsYesterdaysEntry] = useState(false);
  let newestEntry = useSelector((state) => {
    return state.newestEntry;
  });

  //reset Entry on local state to newest entry if needed
  useEffect(() => {
    //entry will be undefined if no entry was passed to this component through props
    //if nothing was passed through props this component is accessed from the Today tab.  This can only be accessed through the today tab if the newest entry is for yesterday's sleep
    if (entry && !entry.date) {
      setEntry(newestEntry);
      setIsYesterdaysEntry(true);
    }
  }, [newestEntry]);

  //When the entry object is changed set the factors array using factors object from the entry object.
  useEffect(() => {
    if (entry.entryFactors) {
      let factors = [];
      for (let factorId in entry.entryFactors) {
        factors.push(entry.entryFactors[factorId].name);
      }
      setFactorNames(factors);
    }
    //check if the entry's date is for yesterday (if so the edit button will be available)
    if (entry.date === yesterday()) {
      setIsYesterdaysEntry(true);
    }
  }, [entry]);

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}></View>
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

      {isYesterdaysEntry && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => props.navigation.navigate('EditEntry')}
        >
          <Text style={styles.buttonText}>Edit Entry</Text>
        </TouchableOpacity>
      )}
      <StatusBar style='light' />
    </View>
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
    width: '80%',
    marginTop: 60
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
