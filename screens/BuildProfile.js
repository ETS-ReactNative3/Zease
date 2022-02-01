import { StyleSheet, View, Text, TextInput, Button } from "react-native";
import React from "react";
import { useEffect, useState } from "react";
import { database } from "../firebase";
import tw from "tailwind-react-native-classnames";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const BuildProfile = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [name, setName] = useState("");
  const [isBedTimePickerVisible, setBedTimePickerVisibility] = useState(false);
  const [sleepGoalStart, setsleepGoalStart] = useState(0);

  //takes in a UTC Time Date object, and returns the local time hours and minutes in a four digit integer.
  const convertToMilitaryInteger = (UTCTimeDate) => {
    let hoursString = String(UTCTimeDate.getHours());
    //make sure that the hours string has 2 characters even it is less than 10
    hoursString = hoursString.length < 2 ? 0 + hoursString : hoursString;

    let minutesString = String(UTCTimeDate.getMinutes());
    //make sure that the minutes string has 2 characters even it is less than 10
    minutesString =
      minutesString.length < 2 ? 0 + minutesString : minutesString;

    //let militaryTimeString = hoursString + minutesString;

    return Number(hoursString + minutesString);
  };

  const showBedTimePicker = () => {
    setBedTimePickerVisibility(true);
  };
  const hideBedTimePicker = () => {
    setBedTimePickerVisibility(false);
  };
  const handleTimeConfirm = (time) => {
    console.log(`${time} has been picked`);
    console.log("militarytime int", convertToMilitaryInteger(time));

    setsleepGoalStart(convertToMilitaryInteger(time));
    hideBedTimePicker();
  };

  return (
    <View style={tw`flex-1 items-center justify-center`}>
      <Text>Welcome!</Text>
      <View>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
        />
        <TextInput
          placeholder="passwordConfirm"
          value={passwordConfirm}
          onChangeText={(text) => setPasswordConfirm(text)}
          secureTextEntry
        />
        <TextInput
          placeholder="name"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <Button title="Select Bed Time Goal" onPress={showBedTimePicker} />
        <DateTimePickerModal
          isVisible={isBedTimePickerVisible}
          mode="time"
          onConfirm={handleTimeConfirm}
          onCancel={hideBedTimePicker}
        />
      </View>
    </View>
  );
};

export default BuildProfile;
