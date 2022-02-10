import {
  View,
  Text,
  FlatList,
  Button,
  Switch,
  TouchableOpacity,
  Alert,
  Modal,
  StyleSheet,
  ScrollView
} from "react-native";
import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import tw from "tailwind-react-native-classnames";
import { StatusBar } from "expo-status-bar";

import { reformatDate, calculateSleepLength, convertToAmPm } from "../Util";

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
    <View style={styles.container}>
      <ScrollView style={styles.contentContainer}>
        <Text style={tw`font-bold text-2xl text-white mb-6 text-center`}>
          Overview for {entry.date && reformatDate(entry.date)}
        </Text>

        <View>
          <View style={styles.accountItem}>
            <View style={styles.header}>
              <Text style={tw`font-semibold text-lg text-white`}>{`Bed Time:`}</Text>
            </View>
            <View style={styles.item}>
              <Text style={tw`font-bold text-lg text-white`}>
                {entry.startTime && convertToAmPm(entry.startTime)}
              </Text>
            </View>
          </View>

          <View style={styles.accountItem}>
            <View style={styles.header}>
              <Text style={tw`font-semibold text-white text-lg`}>{`Wake Up Time:`}</Text>
            </View>
            <View style={styles.item}>
              <Text style={tw`font-bold text-white text-lg`}>
                {entry.endTime && convertToAmPm(entry.endTime)}
              </Text>
            </View>
          </View>

          <View style={styles.accountItem}>
            <View style={styles.header}>
              <Text style={tw`font-semibold text-white text-lg`}>{`Sleep Duration:`}</Text>
            </View>
            <View style={styles.item}>
              <Text style={tw`font-bold text-white text-lg`}>
                {entry.endTime && Math.floor(calculateSleepLength(entry))} hours,{" "}
                {entry.endTime &&
                  Math.floor(
                    (calculateSleepLength(entry) - Math.floor(calculateSleepLength(entry))) * 60
                  )}{" "}
                minutes
              </Text>
            </View>
          </View>

          <View style={styles.accountItem}>
            <View style={styles.header}>
              <Text style={tw`font-semibold text-white text-lg`}>{`Quality:`}</Text>
            </View>
            <View style={styles.item}>
              <Text style={tw`font-bold text-white text-lg`}>{entry.quality}%</Text>
            </View>
          </View>
        </View>
        <View>
          <Text style={tw`font-bold text-white mt-10 mb-2 text-xl`}>Sleep Factors:</Text>
          <View>
            {factorNames.map((factor) => {
              return (
                <Text key={factor} style={tw`font-bold text-white mb-1`}>
                  {factor}
                </Text>
              );
            })}
          </View>
        </View>

        <Text style={tw`font-bold text-white mt-10 mb-2 text-xl`}>Notes:</Text>
        <Text style={tw`font-bold text-white mb-1`}>{entry.notes}</Text>

        <View style={styles.buttonContainer}>
          {!props.entry && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => props.navigation.navigate("EditEntry")}
            >
              <Text style={styles.buttonText}>Edit Entry</Text>
            </TouchableOpacity>
          )}
        </View>

        <StatusBar style="light" />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1C3F52",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.95
  },
  contentContainer: {
    width: "100%",
    marginTop: 80,
    paddingLeft: 30,
    paddingRight: 30
  },
  accountItem: {
    flexDirection: "row",
    marginTop: 15
  },
  header: {
    flex: 4
  },
  item: {
    flex: 3
  },
  button: {
    alignItems: "center",
    backgroundColor: "#F78A03",
    paddingVertical: 12,
    width: 150,
    marginVertical: 50,
    borderRadius: 10
  },
  buttonContainer: {
    marginBottom: 30,
    alignItems: "center"
  },
  buttonText: {
    color: "white",
    fontWeight: "bold"
  }
});

export default SingleEntry;
