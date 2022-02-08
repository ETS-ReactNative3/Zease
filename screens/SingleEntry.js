import {
  View,
  Text,
  FlatList,
  Button,
  Switch,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import tw from "tailwind-react-native-classnames";

import {
  reformatDate,
  calculateSleepLength,
  convertToAmPm,
  yesterday,
} from "../Util";

//if this view is accessed from the AllEntries list then the entry data will be passed on props from the parent component.
//if this view is accessed from the Today button in the nav bar the entry data needs to be pulled from async storage
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
    <View style={tw`flex-1 items-center justify-center`}>
      <Text style={tw`text-xl`}>{entry.date && reformatDate(entry.date)}</Text>
      <View>
        <Text style={tw`text-lg`}>Overview</Text>
        <View>
          <Text>
            Bed Time: {entry.startTime && convertToAmPm(entry.startTime)}
          </Text>
          <Text>
            Wake Up Time: {entry.endTime && convertToAmPm(entry.endTime)}
          </Text>
          <Text>
            Sleep Duration:{" "}
            {entry.endTime && Math.floor(calculateSleepLength(entry))} hours,{" "}
            {entry.endTime &&
              Math.floor(
                (calculateSleepLength(entry) -
                  Math.floor(calculateSleepLength(entry))) *
                  60
              )}{" "}
            minutes
          </Text>
          <Text> Quality: {entry.quality}%</Text>
        </View>
      </View>
      <View>
        <Text style={tw`text-lg`}>Factors</Text>
        <View>
          {factorNames.map((factor) => {
            return <Text key={factor}>{factor}</Text>;
          })}
        </View>
      </View>
      <View>
        <Text style={tw`text-lg`}>Notes</Text>
        <View>
          <Text>{entry.notes}</Text>
        </View>
      </View>
      {isYesterdaysEntry && (
        <Pressable onPress={() => props.navigation.navigate("EditEntry")}>
          <Text>Edit Entry</Text>
        </Pressable>
      )}
    </View>
  );
};

export default SingleEntry;
