import {
  View,
  Text,
  TextInput,
  Button,
  Switch,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import React from "react";
import { useEffect, useState } from "react";
import { auth, database } from "../firebase";
import tw from "tailwind-react-native-classnames";
// import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

import SleepFactorCategory from "./SleepFactorCategory";
import {
  convertToMilitaryString,
  convertToAmPm,
  reformatFactors,
} from "../Util";
import { isNullOrUndefined } from "util";

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

const dummyCategory = {
  name: "Practices",
  factors: [
    "Screentime before bed",
    "Listening to a sleep podcast",
    "Meditation before bed",
  ],
};

const BuildProfile = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [name, setName] = useState("");
  // const [isBedTimePickerVisible, setBedTimePickerVisibility] = useState(false);
  // const [sleepGoalStart, setsleepGoalStart] = useState(null);
  // const [sleepGoalEnd, setsleepGoalEnd] = useState(null);
  // const [isWakeTimePickerVisible, setWakeTimePickerVisibility] =
  //   useState(false);
  const [logReminderOn, setLogReminder] = useState(false);
  const [sleepReminderOn, setSleepReminder] = useState(false);
  const [isFactorInfoVisible, setFactorInfoVisibility] = useState(false);

  // const handleBedTimeConfirm = (time) => {
  //   setsleepGoalStart(convertToMilitaryString(time));
  //   setBedTimePickerVisibility(false);
  // };

  // const handleWakeTimeConfirm = (time) => {
  //   setsleepGoalEnd(convertToMilitaryString(time));
  //   setWakeTimePickerVisibility(false);
  // };

  const handleSubmit = async () => {
    let validated = true;

    if (password !== passwordConfirm) {
      Alert.alert("Error", "Password and Confirm Password do not match.");
      validated = false;
    }

    try {
      //get the user's selected sleep factors from async storage
      const userFactorsString = await AsyncStorage.getItem("userFactors");

      const userFactors = userFactorsString
        ? JSON.parse(userFactorsString)
        : null;

      //make sure that all required fields are filled in
      console.log("userFactors from async storage", userFactors);

      if (
        email === "" ||
        name === "" ||
        // sleepGoalStart === null ||
        // sleepGoalEnd === null ||
        userFactors === null
      ) {
        Alert.alert("Error", "Please fill in all required fields.");
        validated = false;
      }

      if (validated) {
        putUserinDB(userFactors);
      }
    } catch (error) {
      console.log(
        "there was an error in fetching the user's sleep factors from async storage: ",
        error
      );
    }
  };

  const putUserinDB = async (userFactors) => {
    try {
      let newUser = {
        email,
        name,
        // sleepGoalStart,
        // sleepGoalEnd,
        userFactors,
        logReminderOn,
        sleepReminderOn,
      };
      console.log("newUser about to be added to db", newUser);

      auth
        .createUserWithEmailAndPassword(email, password)
        .then((userCredentials) => {
          const userId = userCredentials.user.uid;
          database.ref("users/" + userId).set(newUser);
        })
        .catch((error) => alert(error.message));
    } catch (error) {
      console.log(
        "there was an error in attempting to add this user to the database: ",
        error
      );
    }
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
        {/* <View style={tw``}>
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
        /> */}
        <View>
          <Switch
            value={logReminderOn}
            onValueChange={() =>
              setLogReminder((previousValue) => !previousValue)
            }
          />
          <Text>Remind me to enter daily sleep log</Text>
        </View>
        <View>
          <Switch
            value={sleepReminderOn}
            onValueChange={() =>
              setSleepReminder((previousValue) => !previousValue)
            }
          />
          <Text>Remind me to go to sleep</Text>
        </View>
        <View>
          <Text>Sleep Factors</Text>
          <TouchableOpacity onPress={() => setFactorInfoVisibility(true)}>
            <Ionicons name="information-circle-outline" size={25} />
          </TouchableOpacity>
        </View>
        {reformatFactors(dummySleepFactors).map((category) => {
          return (
            <SleepFactorCategory key={category.name} category={category} />
          );
        })}
        <TouchableOpacity onPress={handleSubmit}>
          <Text>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BuildProfile;
