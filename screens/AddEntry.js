import { StyleSheet, View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { auth, database } from "../firebase";
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';

const AddEntry = () => {
  const [factors, setFactors] = useState([]);
  const [formData, setFormData] = useState({
    startTime: 0,
    endTime: 0,
    quality: 0,
    entryFactors: [],
    notes: "",
  });

  console.log("auth object uid", auth.currentUser.uid)
  const userIdTest = "AbNQWuHhkpSGbArIfJ17twjyuum1"; // User alston ID
  const userId = auth.currentUser ? auth.currentUser.uid : userIdTest;

  const factorsTest = [
      { name: "caffeine", category: "chemical"},
      { name: "CBD", category: "chemical"},
      { name: "meditation", category: "practice"},
      { name: "stressful day", category: "practice"},
      { name: "exercised late", category: "practice"},
      { name: "test name", category: "test category"},
      { name: "test name", category: "test category"},
      { name: "test name", category: "test category"},
      { name: "test name", category: "test category"},
      { name: "test name", category: "test category"},
      { name: "test name", category: "test category"},
      { name: "test name", category: "test category"},
      { name: "test name", category: "test category"},
    ]

  useEffect(() => {
    const factorsRef = database.ref(`users/${userId}/userFactors`);
    factorsRef.on("value", (snapshot) => {
      const userFactors = snapshot.val();
      setFactors(userFactors);
      console.log("userFactors", userFactors)
    });
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Restructure data for firebase, convert any strings to numbers
    // Write form inputs to firebase
    const sleepEntriesRef = database.ref(`sleepEntries/${userId}`);
    sleepEntriesRef.push(formData)
    // Success alert
    // Reset form data
    setFormData({
      startTime: 0,
      endTime: 0,
      quality: 0,
      entryFactors: [],
    });
    // Take user to SingleEntry view of submitted entry
  };

  const { startTime, endTime, quality, entryFactors, notes } = formData;
  return (
    <View style={styles.container}>
      <Text>Add Entry</Text>
      <View style={styles.formContainer}>
        <Text>Sleep Duration</Text>
        <Text>Sleep Quality</Text>
        <Text>Factors</Text>
        {/* <FlatList>
            data={factors}
            renderItem={renderFactorSelect}
            keyExtractor={factorId}
        </FlatList> */}
        <Text>Notes</Text>

      </View>
    </View>
  );
};

export default AddEntry;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: "80%",
  },
});
