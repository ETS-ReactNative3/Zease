import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  Switch,
} from "react-native";
import React from "react";
import { useEffect, useState } from "react";
import { database } from "../firebase";
import tw from "tailwind-react-native-classnames";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const dummySleepFactors = {
  1: {
    name: "Caffeine",
    category: "chemical",
  },
  2: {
    name: "CBD",
    category: "chemical",
  },
  3: {
    name: "Melatonin",
    category: "chemical",
  },
  4: {
    name: "Sleep Mask",
    category: "tool",
  },
  5: {
    name: "C-Pap",
    category: "tool",
  },
  6: {
    name: "Screentime before bed",
    category: "practice",
  },
  7: {
    name: "Listening to a sleep podcast",
    category: "practice",
  },
  8: {
    name: "Meditation before bed",
    category: "practice",
  },
};

const BuildProfile = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [name, setName] = useState("");
  const [isBedTimePickerVisible, setBedTimePickerVisibility] = useState(false);
  const [sleepGoalStart, setsleepGoalStart] = useState(null);
  const [sleepGoalEnd, setsleepGoalEnd] = useState(null);
  const [isWakeTimePickerVisible, setWakeTimePickerVisibility] =
    useState(false);
  const [logReminderOn, setLogReminder] = useState(false);
  const [sleepReminderOn, setSleepReminder] = useState(false);

  //takes in a UTC Time Date object, and returns the local time hours and minutes in a four digit integer.
  const convertToMilitaryString = (UTCTimeDate) => {
    let hoursString = String(UTCTimeDate.getHours());
    //make sure that the hours string has 2 characters even it is less than 10
    hoursString = hoursString.length < 2 ? 0 + hoursString : hoursString;

    let minutesString = String(UTCTimeDate.getMinutes());
    //make sure that the minutes string has 2 characters even it is less than 10
    minutesString =
      minutesString.length < 2 ? 0 + minutesString : minutesString;

    return hoursString + minutesString;
  };

  const convertToAmPm = (militaryString) => {
    let militaryHoursNum = Number(militaryString.slice(0, 2));
    let hoursString =
      militaryHoursNum > 12
        ? String(militaryHoursNum - 12)
        : String(militaryHoursNum);
    if (hoursString === "00") {
      hoursString = "12";
    }

    let minString = militaryString.slice(-2);
    let AmPm = militaryHoursNum > 11 ? "PM" : "AM";
    return `${hoursString}:${minString} ${AmPm}`;
  };

  const handleBedTimeConfirm = (time) => {
    setsleepGoalStart(convertToMilitaryString(time));
    setBedTimePickerVisibility(false);
  };

  const handleWakeTimeConfirm = (time) => {
    setsleepGoalEnd(convertToMilitaryString(time));
    setWakeTimePickerVisibility(false);
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
          placeholder="Confirm Password"
          value={passwordConfirm}
          onChangeText={(text) => setPasswordConfirm(text)}
          secureTextEntry
        />
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <View style={tw``}>
          <Text>
            Bed Time Goal: {sleepGoalStart && convertToAmPm(sleepGoalStart)}
          </Text>
          <Button
            title="Set Time"
            onPress={() => setBedTimePickerVisibility(true)}
          />
        </View>
        <DateTimePickerModal
          isVisible={isBedTimePickerVisible}
          mode="time"
          onConfirm={handleBedTimeConfirm}
          onCancel={() => setBedTimePickerVisibility(false)}
        />
        <View style={tw``}>
          <Text>
            Wake Up Goal: {sleepGoalEnd && convertToAmPm(sleepGoalEnd)}
          </Text>
          <Button
            title="Set Time"
            onPress={() => setWakeTimePickerVisibility(true)}
          />
        </View>
        <DateTimePickerModal
          isVisible={isWakeTimePickerVisible}
          mode="time"
          onConfirm={handleWakeTimeConfirm}
          onCancel={() => setWakeTimePickerVisibility(false)}
        />
        <View>
          <Text>Remind me to enter daily sleep log</Text>
          <Switch
            value={logReminderOn}
            onValueChange={() =>
              setLogReminder((previousValue) => !previousValue)
            }
          />
        </View>
        <View>
          <Text>Remind me to go to sleep</Text>
          <Switch
            value={sleepReminderOn}
            onValueChange={() =>
              setSleepReminder((previousValue) => !previousValue)
            }
          />
        </View>
        <Text>Sleep Factors</Text>
      </View>
    </View>
  );
};

export default BuildProfile;
