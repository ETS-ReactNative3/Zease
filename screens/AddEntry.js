import { StyleSheet, View, Text, Button, FlatList } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Slider from "@react-native-community/slider";
import MultiSelect from "react-native-multiple-select";

import { auth, database } from "../firebase";
import { convertToMilitaryString, convertToAmPm } from "../utils";

const AddEntry = () => {
  // User sleep factors (pulled in from firebase)
  const [factors, setFactors] = useState([]);

  // Form state
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [quality, setQuality] = useState(0);
  const [entryFactors, setEntryFactors] = useState([]);
  const [notes, setNotes] = useState("");

  // Time picker state
  const [startTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [endTimePickerVisible, setEndTimePickerVisible] = useState(false);

  // Sleep factors multiselect state
  const [selectedItems, setSelectedItems] = useState([]);
  // Sleep factor multiselect ref (used to call prototype methods)
  const multiSelectRef = useRef();

  // Hide modals for both time pickers
  const hideTimePickers = () => {
    setStartTimePickerVisible(false);
    setEndTimePickerVisible(false);
  };

  // Set state for sleep startTime once modal picker selection confirmed
  const handleConfirmStart = (time) => {
    // console.warn("A time has been picked: ", time);
    setStartTime(convertToMilitaryString(time));
    hideTimePickers();
  };

  // Set state for sleep endTime once modal picker selection confirmed
  const handleConfirmEnd = (time) => {
    // console.warn("A time has been picked: ", time);
    setEndTime(convertToMilitaryString(time));
    hideTimePickers();
  };

  // Set state for sleep quality when slider changes
  const handleSelectQuality = (val) => {
    console.warn("Quality selected: ", val);
    setQuality(val);
  };

  const onSelectedItemsChange = (selectedItems) => {
    console.warn("Sleep factors selected: ", selectedItems);
    setSelectedItems(selectedItems);
  };

  const userIdTest = "AbNQWuHhkpSGbArIfJ17twjyuum1"; // User alston ID
  // Grab userId from the firebase auth component
  const userId = auth.currentUser ? auth.currentUser.uid : userIdTest;

  // User's sleep factors dummy data
  const factorsTest = [
    { name: "caffeine", category: "chemical" },
    { name: "CBD", category: "chemical" },
    { name: "meditation", category: "practice" },
    { name: "stressful day", category: "practice" },
    { name: "exercised late", category: "practice" },
  ];

  useEffect(() => {
    // Load user's sleep factors from firebase
    const factorsRef = database.ref(`users/${userId}/userFactors`);
    factorsRef.on("value", (snapshot) => {
      const userFactors = snapshot.val();
      setFactors(userFactors);
      console.log("userFactors", userFactors);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Set date to date string yyyy-mm-dd
    // setFormData({ ...formData, date: new Date(Date.now()) });
    // Restructure data for firebase, convert any strings to numbers
    // Write form inputs to firebase
    const sleepEntriesRef = database.ref(`sleepEntries/${userId}`);
    // sleepEntriesRef.push(formData);
    // Success alert
    // Reset form data
    // Take user to SingleEntry view of submitted entry
  };

  return (
    <View style={styles.container}>
      <Text>Add Entry</Text>
      <View style={styles.formContainer}>
        <Text>Sleep Duration</Text>
        <Text>Sleep time</Text>
        <Button
          title={startTime ? convertToAmPm(startTime) : "Select"}
          onPress={() => {
            setStartTimePickerVisible(true);
          }}
        />
        <DateTimePickerModal
          isVisible={startTimePickerVisible}
          mode="time"
          onConfirm={handleConfirmStart}
          onCancel={hideTimePickers}
        />
        <Text>Wake time</Text>
        <Button
          title={endTime ? convertToAmPm(endTime) : "Select"}
          onPress={() => {
            setEndTimePickerVisible(true);
          }}
        />
        <DateTimePickerModal
          isVisible={endTimePickerVisible}
          mode="time"
          onConfirm={handleConfirmEnd}
          onCancel={hideTimePickers}
        />
        <Text>Sleep Quality</Text>
        <Slider
          step={1}
          minimumValue={0}
          maximumValue={100}
          value={quality}
          onValueChange={handleSelectQuality}
          minimumTrackTintColor="#3395ff"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#eeeeee"
        />
        <Text>Factors</Text>
        <MultiSelect
          hideTags
          items={factorsTest}
          uniqueKey="name"
          onSelectedItemsChange={onSelectedItemsChange}
          selectedItems={selectedItems}
          selectText="Pick Items"
          searchInputPlaceholderText="Search Items..."
          ref={multiSelectRef}
          onChangeInput={(text) => console.log(text)}
          //   altFontFamily="ProximaNova-Light"
          tagRemoveIconColor="#CCC"
          tagBorderColor="#CCC"
          tagTextColor="#CCC"
          selectedItemTextColor="#CCC"
          selectedItemIconColor="#CCC"
          itemTextColor="#000"
          displayKey="name"
          searchInputStyle={{ color: "#CCC" }}
          submitButtonColor="#CCC"
          submitButtonText="Submit"
        />
        <View>{multiSelectRef.current.getSelectedItemsExt(selectedItems)}</View>
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
