import { StyleSheet, View, Text, Button, TextInput, Alert } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Slider from "@react-native-community/slider";
import MultiSelect from "react-native-multiple-select";

// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { yesterday, convertToMilitaryString, convertToAmPm } from "../Util";
import { goUpdateUserEntry } from "../store/userEntries";
// import NativePushNotificationManagerIOS from "react-native/Libraries/PushNotificationIOS/NativePushNotificationManagerIOS";
// import { withSafeAreaInsets } from "react-native-safe-area-context";

const EditEntry = ({ navigation }) => {
  let dispatch = useDispatch();

  //all entries pulled from redux
  //(this will be needed to identify entryId)
  let entryList = useSelector((state) => state.userEntries);
  const [entryId, setEntryId] = useState("");

  // User and DB factors (pulled in from redux)
  let userFactors = useSelector((state) => state.userFactors);
  //DB factors are needed to convert the factor IDarray to an object
  let dbFactors = useSelector((state) => state.dbFactors);
  const [userFactorsArr, setUserFactorsArr] = useState([]);

  //users can only edit yesterday's entry, so the newest entry should display
  const yesterdaysEntry = useSelector((state) => state.newestEntry);

  // Form state
  const [startTime, setStartTime] = useState(yesterdaysEntry.startTime || "");
  const [endTime, setEndTime] = useState(yesterdaysEntry.endTime || "");
  const [quality, setQuality] = useState(yesterdaysEntry.quality || 0);
  const [entryFactorsArr, setEntryFactorsArr] = useState(
    Object.keys(yesterdaysEntry.entryFactors) || []
  );
  const [notes, setNotes] = useState(yesterdaysEntry.notes || "");
  const [date, setDate] = useState(yesterdaysEntry.date || "");

  // Time picker state
  const [startTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [endTimePickerVisible, setEndTimePickerVisible] = useState(false);

  // Sleep factor multiselect ref (used to call prototype methods)
  const multiSelectRef = useRef();

  // Hide modals for both time pickers
  const hideTimePickers = () => {
    setStartTimePickerVisible(false);
    setEndTimePickerVisible(false);
  };

  // Set state for sleep startTime once modal picker selection confirmed
  const handleConfirmStart = (time) => {
    setStartTime(convertToMilitaryString(time));
    hideTimePickers();
  };

  // Set state for sleep endTime once modal picker selection confirmed
  const handleConfirmEnd = (time) => {
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

  useEffect(() => {
    // reformat the sleep factors from redux
    const formattedFactors = [];
    for (let key in userFactors) {
      formattedFactors.push({ ...userFactors[key], id: key });
    }
    setUserFactorsArr(formattedFactors);

    //extract entryId from redux's list of entries
    entryList.forEach((entry) => {
      if (entry.date === yesterday()) {
        setEntryId(entry.id);
      }
    });
  }, []);

  const handleSubmit = async () => {
    // Validate form data
    if (!startTime || !endTime || !quality) {
      Alert.alert("Error", "Please fill in all required fields!");
      return;
    }

    // Convert entryFactorsArr (arr of ids) for factor objects
    const entryFactors = {};
    entryFactorsArr.forEach((factorId) => {
      entryFactors[factorId] = dbFactors[factorId];
    });
    const formData = { date, startTime, endTime, quality, entryFactors, notes };
    try {
      // Write form inputs to firebase
      dispatch(goUpdateUserEntry(formData, entryId));

      Alert.alert("Changes submitted!");
      navigation.navigate("NavBar");
    } catch (error) {
      console.log("Error updating firebase", error);
    }
  };

  const handleCancel = () => {
    navigation.navigate("NavBar");
  };

  return (
    <View style={styles.container}>
      <Text>Edit Entry</Text>
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
          accessibilityLabel="Submit edit sleep entry form"
        />
        <Button
          onPress={handleCancel}
          title="Cancel"
          color="#3395ff"
          accessibilityLabel="Cancel edit sleep entry"
        />
      </View>
    </View>
  );
};

export default EditEntry;

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
