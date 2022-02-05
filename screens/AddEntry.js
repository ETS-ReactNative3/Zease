import { StyleSheet, View, Text, Button, TextInput, Alert } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import Slider from "@react-native-community/slider";
import MultiSelect from "react-native-multiple-select";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { auth, database } from "../firebase";
import { convertToMilitaryString, convertToAmPm } from "../utils";

const AddEntry = () => {
  // User sleep factors (pulled in from firebase)
  const [userFactors, setUserFactors] = useState({});
  const [userFactorsArr, setUserFactorsArr] = useState([]);

  // Form state
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [quality, setQuality] = useState(0);
  const [entryFactorsArr, setEntryFactorsArr] = useState([]);
  const [notes, setNotes] = useState("");

  // Time picker state
  const [startTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [endTimePickerVisible, setEndTimePickerVisible] = useState(false);
  // TODO: Initialize time picker to user's goal times
  // const [startTimeUTC, setStartTimeUTC] = useState(Date.now());
  // const [endTimeUTC, setEndTimeUTC] = useState(Date.now());
  // const [startTimeUTC, setStartTimeUTC] = useState(new Date().setHours(20,0,0,0));
  // const [endTimeUTC, setEndTimeUTC] = useState(new Date().setHours(7,0,0,0));

  // Sleep factor multiselect ref (used to call prototype methods)
  const multiSelectRef = useRef();

  // Hide modals for both time pickers
  const hideTimePickers = () => {
    setStartTimePickerVisible(false);
    setEndTimePickerVisible(false);
  };

  // Set state for sleep startTime once modal picker selection confirmed
  const handleConfirmStart = (time) => {
    // setStartTimeUTC(time);
    setStartTime(convertToMilitaryString(time));
    hideTimePickers();
  };

  // Set state for sleep endTime once modal picker selection confirmed
  const handleConfirmEnd = (time) => {
    // setEndTimeUTC(time);
    setEndTime(convertToMilitaryString(time));
    hideTimePickers();
  };

  // Set state for sleep quality when slider changes
  const handleSelectQuality = (val) => {
    setQuality(val);
  };

  const onEntryFactorsChange = (selectedItems) => {
    setEntryFactorsArr(selectedItems);
  };

  const alstonUserId = "AbNQWuHhkpSGbArIfJ17twjyuum1"; // User alston ID, delete once component incorporated to main app
  // Grab userId from the firebase auth component
  const userId = auth.currentUser ? auth.currentUser.uid : alstonUserId;

  useEffect(() => {
    // Load user's sleep factors from firebase
    const factorsRef = database.ref(`users/${userId}/userFactors`);
    factorsRef.on("value", (snapshot) => {
      const factors = snapshot.val();
      setUserFactors(factors);
      // Reformat factors to array of objects, with keys id, name, and category
      const formattedFactors = [];
      for (let key in factors) {
        formattedFactors.push({ ...factors[key], id: key });
      }
      setUserFactorsArr(formattedFactors);
    });
  }, []);

  const handleSubmit = async () => {
    // Validate form data
    if (!startTime || !endTime || !quality) {
      Alert.alert("Error", "Please fill in all required fields!");
      return;
    }
    // Set formData date to date string yyyy-mm-dd (of previous day)
    const dateObj = new Date();
    dateObj.setTime(dateObj.getTime() - 48 * 60 * 60 * 1000); // Subtract 24 hours
    const date = dateObj.toISOString().slice(0, 10);

    const entryFactors = {};
    entryFactorsArr.forEach(
      (factorId) => (entryFactors[factorId] = userFactors[factorId])
    ); // Only grab name and category
    // Set formData factors to formatted selectedItems (selected items will be array of ids)
    const formData = { date, startTime, endTime, quality, entryFactors, notes };
    //console.log("formData", formData);

    //put the new entry in async storage so singleEntry view can use it.
    await AsyncStorage.setItem("yesterdaysEntry", JSON.stringify(formData));

    // Write form inputs to firebase
    const sleepEntriesRef = database.ref(`sleepEntries/${userId}`);
    sleepEntriesRef.push(formData);
    // Success alert
    Alert.alert("Entry submitted!");
    // Reset form data
    setStartTime("");
    setEndTime("");
    setQuality(0);
    setEntryFactorsArr([]);
    setNotes("");
    // TODO: Take user to SingleEntry view of submitted entry
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
        {/* <DateTimePicker
          value={startTimeUTC}
          mode="time"
          onChange={handleConfirmStart}
        /> */}
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
        {/* <DateTimePicker
          value={endTimeUTC}
          mode="time"
          onChange={handleConfirmEnd}
        /> */}
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
          items={userFactorsArr}
          uniqueKey="id"
          onSelectedItemsChange={onEntryFactorsChange}
          selectedItems={entryFactorsArr}
          selectText="Select factors..."
          searchInputPlaceholderText="Search factors..."
          ref={multiSelectRef}
          onChangeInput={(text) => console.log(text)}
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
        {/* {entryFactorsArr && (
          <View>
            {multiSelectRef.current.getSelectedItemsExt(entryFactorsArr)}
          </View>
        )} */}
        <Text>Notes</Text>
        <TextInput
          multiline={true}
          numberOfLines={4}
          placeholder="Enter notes..."
          onChangeText={(input) => setNotes(input)}
          value={notes}
        />
        <Button
          onPress={handleSubmit}
          title="Submit"
          color="#3395ff"
          accessibilityLabel="Submit sleep entry form"
        />
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
