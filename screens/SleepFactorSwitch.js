import { View, Text, Switch } from 'react-native';
import React, { useEffect } from 'react';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'tailwind-react-native-classnames';

const SleepFactorSwitch = (props) => {
  const { factorId, factor } = props;
  const [factorRelevant, setFactorRelevance] = useState(false);
  const [userFactors, setUserFactors] = useState(null);

  //when the page loads put any userFactors from async storage on local state.
  useEffect(async () => {
    const userFactorsString = await AsyncStorage.getItem('userFactors');
    const userFactors = userFactorsString ? JSON.parse(userFactorsString) : null;
    // console.log(
    //   "userFactors from useEffect in sleepFactor switch",
    //   userFactors
    // );
    setUserFactors(userFactors);
  }, []);

  //if userFactors is updated check if the switch value needs to be updated.
  useEffect(async () => {
    for (let userFactorId in userFactors) {
      if (factorId === userFactorId) {
        setFactorRelevance(true);
      }
    }
  }, [userFactors]);

  //update userFactors for local state and async storage when switch is toggled
  const toggleSwitch = async () => {
    setFactorRelevance((previousValue) => !previousValue);
    try {
      let newUserFactors = {};
      if (userFactors && userFactors[factorId]) {
        //if old user factors object currently includes this factor's key value pair, remove it.
        newUserFactors = { ...userFactors };
        delete newUserFactors[factorId];
      }

      if (userFactors && !userFactors[factorId]) {
        //if the old user factors object doesn't include this factor's key value pair, add it.
        newUserFactors = { ...userFactors, [factorId]: factor };
      }
      if (userFactors === null) {
        //if the old user factors object is null, the new factors object will have just this factor's key value pair in it.
        newUserFactors[factorId] = factor;
      }
      //uncomment next line to clear async store's userFactors
      //newUserFactors = {};
      //console.log("new user factors",newUserFactors);

      //store the updated user factors in async storage.
      await AsyncStorage.setItem('userFactors', JSON.stringify(newUserFactors));
      setUserFactors(newUserFactors);
    } catch (error) {
      console.log(
        'There was an error in trying to update async storage with this sleep factor:',
        error
      );
    }
  };
  return (
    <View style={tw`flex-row mb-2`}>
      <Switch
        style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
        value={factorRelevant}
        onValueChange={() => toggleSwitch()}
      />
      <Text style={tw`font-semibold mt-2 ml-1 text-gray-800`}>{props.factor.name}</Text>
    </View>
  );
};

export default SleepFactorSwitch;
