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
import { auth, database } from "../firebase";
import tw from "tailwind-react-native-classnames";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { reformatDate, calculateSleepLength } from "../Util";

//this could be a modal sub component of the all entries view.  i.e. each of the entry snapshots in the all entries is nested inside touchableOpacity.  The presshandler for its touchable opacity does two things:
//1- opens a modal that displays this component (along with a back button)
//2- sets this entry's ID as the selected entry (that entry Id can then be passed to this element through props).

//the other way to reach this screen would be through the "today's entry".  In that case the entryId would not have been given through props.  If the entyr ID is not defined then the systme should just grab the most recent entry for this user.

//|| ;
const SingleEntry = (props) => {
  const [entry, setEntry] = useState(props.entry || {});
  const [factorNames, setFactorNames] = useState([]);

  //go get entry from the database if needed
  useEffect(async () => {
    //if no entry was passed to this component through props then entry.date will be undefined, so we need to get the entyr from db.
    if (!entry.date) {
      //get the userId from async storage
      const userId = await AsyncStorage.getItem("userID");
      //TODO: how to identify the most recently added entry??
      //TODO: how to get only one entry?  If thats not possible you could pull all the entries and then look for the one that has the most recent date.

      //get data from firebase. This is getting a "snapshot" of the data
      const entryRef = database.ref(
        `sleepEntries/${JSON.parse(userId)}/${entryId}`
      );

      //this on method gets the value of the data at that reference.
      entryRef.on("value", (snapshot) => {
        const entry = snapshot.val();
        console.log("sleep entry from db", entry);

        let factorNames = [];
        for (let factorId in entry.entryFactors) {
          factors.push(entry.entryFactors[factorId].name);
        }

        const reformattedEntry = {
          date: reformatDate(entry.date),
          sleepHours: calculateSleepLength(entry),
          bedTime: convertToAmPm(entry.startTime),
          wakeTime: convertToAmPm(entry.endTime),
          notes: entry.notes,
          quality: entry.quality,
          factors: factorNames,
        };
        setEntry(reformattedEntry);
      });
    }
  }, []);

  //Every time the entry object is changed set the factors array using factors object from the entry object.
  useEffect(() => {
    if (entry.entryFactors) {
      let factors = [];
      for (let factorId in entry.entryFactors) {
        factors.push(entry.entryFactors[factorId].name);
      }
      setFactorNames(factors);
    }
  }, [entry]);

  //this gets plugged into the flatList of the factors for this sleep entry
  const renderFactor = ({ factor }) => {
    return <Item title={factor} />;
  };

  return (
    <View style={tw`flex-1 items-center justify-center`}>
      <Text style={tw`text-xl`}>{reformatDate(entry.date)}</Text>
      <View>
        <Text style={tw`text-lg`}>Overview</Text>
        <Text>Bed Time: {convertToAmPm(entry.startTime)}</Text>
        <Text>Wake Up Time: {convertToAmPm(entry.endTime)}</Text>
        <Text>
          Sleep Duration: {Math.floor(calculateSleepLength(entry))} hours,
          {(calculateSleepLength(entry) -
            Math.floor(calculateSleepLength(entry))) *
            60}
          minutes
        </Text>
        <Text> Quality: {entry.quality}%</Text>
      </View>
      <View>
        <Text style={tw`text-lg`}>Factors</Text>
        <FlatList
          data={factorNames}
          renderItem={renderFactor}
          keyExtractor={(factor) => factor}
        />
      </View>
      <View>
        <Text style={tw`text-lg`}>Notes</Text>
        <Text>{entry.notes}</Text>
      </View>
    </View>
  );
};

export default SingleEntry;
