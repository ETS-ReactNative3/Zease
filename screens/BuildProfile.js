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

  const showBedTimePicker = () => {
    setBedTimePickerVisibility(true);
  };
  const hideBedTimePicker = () => {
    setBedTimePickerVisibility(false);
  };
  const handleTimeConfirm = (time) => {
    console.log(`${time} has been picked`);
    console.dir("time object", time);
    console.log("time string object", JSON.stringify(time));
    //time porvided by picker is an object, and not an array object
    //if you stringify the object it has this format
    //"yyyy-mm-dd-Thh:mm:ss.Z"
    // 01234567890123456
    let hourString = JSON.stringify(time).slice(12, 14);
    let minString = JSON.stringify(time).slice(15, 17);
    let militaryTimeString = hourString + minString;
    console.log("militaryTimeString", militaryTimeString);

    setsleepGoalStart();
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
