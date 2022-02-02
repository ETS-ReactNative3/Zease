import {
  View,
  Text,
  TextInput,
  Button,
  Switch,
  TouchableOpacity,
  Alert,
  Modal
} from "react-native";
import React from "react";
import { useEffect, useState } from "react";
import { auth, database } from "../firebase";
import tw from "tailwind-react-native-classnames";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

import SleepFactorCategory from "./SleepFactorCategory";

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
  const [isBedTimePickerVisible, setBedTimePickerVisibility] = useState(false);
  const [sleepGoalStart, setsleepGoalStart] = useState(null);
  const [sleepGoalEnd, setsleepGoalEnd] = useState(null);
  const [isWakeTimePickerVisible, setWakeTimePickerVisibility] =
    useState(false);
  const [logReminderOn, setLogReminder] = useState(false);
  const [sleepReminderOn, setSleepReminder] = useState(false);
  const [isFactorInfoVisible, setFactorInfoVisibility] = useState(false);

  //takes in a UTC Time Date object, and returns the local time hours and minutes in a four digit string.
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
  //takes in a 4 digitstring in military time and returns it in AM/PM time format
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

  //takes in the object of all sleep factors fetched from realtime firebase and reformats it into an array of categories that can be mapped into sleep factor category sub components.
  const reformatFactors = (dbFactorsObject) => {
    const categories = [
      {
        name: "Practices",
        factors: [],
      },
      {
        name: "Tools",
        factors: [],
      },
      {
        name: "Chemicals",
        factors: [],
      },
    ];

    for (const factor in dbFactorsObject) {
      let factorSubArray = [dbFactorsObject[factor].name, factor];
      switch (dbFactorsObject[factor].category) {
        case "practice":
          categories[0].factors.push(factorSubArray);
          break;
        case "tool":
          categories[1].factors.push(factorSubArray);
          break;
        case "chemical":
          categories[2].factors.push(factorSubArray);
          break;
      }
    }
    return categories;
  };

  const handleBedTimeConfirm = (time) => {
    setsleepGoalStart(convertToMilitaryString(time));
    setBedTimePickerVisibility(false);
  };

  const handleWakeTimeConfirm = (time) => {
    setsleepGoalEnd(convertToMilitaryString(time));
    setWakeTimePickerVisibility(false);
  };

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
        : [];

      //make sure that all required fields are filled in

      if (
        email === "" ||
        name === "" ||
        sleepGoalStart === null ||
        sleepGoalEnd === null ||
        userFactors.length === 0
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
        sleepGoalStart,
        sleepGoalEnd,
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
        <TouchableOpacity
        onPress={() => setFactorInfoVisibility(true)}>
          <Text>What is that?</Text>
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
