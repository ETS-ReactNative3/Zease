import {
  View,
  Text,
  TextInput,
  Button,
  Switch,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import React from "react";
import { useEffect, useState } from "react";
import { auth, database } from "../firebase";
import tw from "tailwind-react-native-classnames";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SleepFactorCategory from "./SleepFactorCategory";
import {
  convertToMilitaryString,
  convertToAmPm,
  reformatFactors,
} from "../Util";

const BuildProfile = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(true);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [name, setName] = useState("");
  const [isBedTimePickerVisible, setBedTimePickerVisibility] = useState(false);
  const [sleepGoalStart, setsleepGoalStart] = useState(null);
  const [sleepGoalStartUTC, setsleepGoalStartUTC] = useState(Date.now());
  const [sleepGoalEnd, setsleepGoalEnd] = useState(null);
  const [sleepGoalEndUTC, setsleepGoalEndUTC] = useState(Date.now());
  const [isWakeTimePickerVisible, setWakeTimePickerVisibility] =
    useState(false);
  const [logReminderOn, setLogReminder] = useState(false);
  const [sleepReminderOn, setSleepReminder] = useState(false);
  const [isFactorInfoVisible, setFactorInfoVisibility] = useState(false);
  const [sleepFactors, setSleepFactors] = useState({});

  //get the sleep factors from db when the page loads
  useEffect(() => {
    let sleepFactorsRef = database.ref("sleepFactors");
    sleepFactorsRef.on("value", (snapshot) => {
      const data = snapshot.val();
      setSleepFactors(data);
    });
  }, []);

  useEffect(() => {
    setEmailValid(
      String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    );
  }, [email]);

  useEffect(() => {
    setPasswordsMatch(password === passwordConfirm);
  }, [passwordConfirm, password]);

  const handleBedTimeConfirm = (evt, time) => {
    setsleepGoalStartUTC(time);
    setsleepGoalStart(convertToMilitaryString(time));
  };

  const handleWakeTimeConfirm = (evt, time) => {
    setsleepGoalEndUTC(time);
    setsleepGoalEnd(convertToMilitaryString(time));
  };

  const handleSubmit = async () => {
    let validated = true;

    if (!passwordsMatch) {
      Alert.alert("Error", "Password and Confirm Password do not match.");
      validated = false;
    }

    if (!emailValid) {
      Alert.alert("Error", "Please enter a valid email address");
      validated = false;
    }

    try {
      //get the user's selected sleep factors from async storage
      const userFactorsString = await AsyncStorage.getItem("userFactors");

      const userFactors = userFactorsString
        ? JSON.parse(userFactorsString)
        : {};

      if (Object.keys(userFactors).length === 0) {
        Alert.alert("Error", "Please select at least one sleep factor");
        validated = false;
      }

      //make sure that all required fields are filled in
      if (
        email === "" ||
        name === "" ||
        sleepGoalStart === null ||
        sleepGoalEnd === null
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
        <View style={tw`flex-row`}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          {!emailValid && (
            <Ionicons name="alert-outline" size={20} color="red" />
          )}
        </View>
        <View style={tw`flex-row`}>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
          />
          {!passwordsMatch && (
            <Ionicons name="alert-outline" size={20} color="red" />
          )}
        </View>
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
        <View style={tw`flex-row`}>
          <Text>
            Bed Time Goal: {sleepGoalStart && convertToAmPm(sleepGoalStart)}
          </Text>
          {isBedTimePickerVisible && (
            <DateTimePicker
              mode="time"
              value={sleepGoalStartUTC}
              onChange={handleBedTimeConfirm}
            />
          )}
          <Button
            title={isBedTimePickerVisible ? "Confirm" : "Set Time"}
            onPress={() => setBedTimePickerVisibility(!isBedTimePickerVisible)}
          />
        </View>
        <View style={tw`flex-row`}>
          <Text>
            Wake Up Goal: {sleepGoalEnd && convertToAmPm(sleepGoalEnd)}
          </Text>

          {isWakeTimePickerVisible && (
            <DateTimePicker
              mode="time"
              value={sleepGoalEndUTC}
              onChange={handleWakeTimeConfirm}
            />
          )}
          <Button
            title={isWakeTimePickerVisible ? "Confirm" : "Set Time"}
            onPress={() =>
              setWakeTimePickerVisibility(!isWakeTimePickerVisible)
            }
          />
        </View>
        <View style={tw`flex-row`}>
          <Switch
            value={logReminderOn}
            onValueChange={() =>
              setLogReminder((previousValue) => !previousValue)
            }
          />
          <Text>Remind me to enter daily sleep log</Text>
        </View>
        <View style={tw`flex-row`}>
          <Switch
            value={sleepReminderOn}
            onValueChange={() =>
              setSleepReminder((previousValue) => !previousValue)
            }
          />
          <Text>Remind me to go to sleep</Text>
        </View>
        <View style={tw`flex-row`}>
          <Text>Sleep Factors</Text>
          <TouchableOpacity onPress={() => setFactorInfoVisibility(true)}>
            <Ionicons name="information-circle-outline" size={25} />
          </TouchableOpacity>
        </View>
        <Modal
          transparent={false}
          animationType="slide"
          visible={isFactorInfoVisible}
          onRequestClose={() => setFactorInfoVisibility(!isFactorInfoVisible)}
        >
          <View style={tw`flex-1 items-center justify-center`}>
            <Text>
              A sleep factor is something that has the potential to affect your
              sleep. When you are making a daily sleep entry you will be able to
              select any number of the sleep factors you choose here. When
              viewing visualizations of your sleep entries you will be able to
              see any correlations that may exist between factors you have
              chosen to track and the quality or duration of your sleep.
            </Text>
            <Pressable
              onPress={() => setFactorInfoVisibility(!isFactorInfoVisible)}
            >
              <Text>Close</Text>
            </Pressable>
          </View>
        </Modal>
        {reformatFactors(sleepFactors).map((category) => {
          return (
            <SleepFactorCategory key={category.name} category={category} />
          );
        })}
        <View style={tw`items-center `}>
          <TouchableOpacity onPress={handleSubmit}>
            <Text>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
            <Text>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default BuildProfile;
