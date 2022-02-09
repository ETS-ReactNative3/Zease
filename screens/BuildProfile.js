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
import { useSelector, useDispatch } from "react-redux";
import tw from "tailwind-react-native-classnames";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Ionicons } from "@expo/vector-icons";

import SleepFactorCategory from "./SleepFactorCategory";
import {
  convertToMilitaryString,
  convertToAmPm,
  reformatFactors,
} from "../Util";
import { createProfile } from "../store/profile";
import { fetchDBFactors } from "../store/dbFactors";

const BuildProfile = ({ navigation }) => {
  const dispatch = useDispatch();

  //sleep factor options from the DB (not specific to user)
  //const [sleepFactors, setSleepFactors] = useState({});
  const sleepFactors = useSelector((state) => state.dbFactors);

  //Manage form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [name, setName] = useState("");
  const [sleepGoalStart, setsleepGoalStart] = useState(null);
  const [sleepGoalEnd, setsleepGoalEnd] = useState(null);
  const [logReminderOn, setLogReminder] = useState(false);
  const [sleepReminderOn, setSleepReminder] = useState(false);
  let userFactors = useSelector((state) => state.userFactors);

  //form validation
  const [emailValid, setEmailValid] = useState(true);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  //visibility of modals
  const [isBedTimePickerVisible, setBedTimePickerVisibility] = useState(false);
  const [isWakeTimePickerVisible, setWakeTimePickerVisibility] =
    useState(false);
  const [isFactorInfoVisible, setFactorInfoVisibility] = useState(false);

  //when the page loads get the sleep factors from db
  useEffect(() => {
    dispatch(fetchDBFactors());
  }, []);

  //when email changes update state about whether it is a valid email
  useEffect(() => {
    //console.log("dbSleepFactors, ", sleepFactors);
    setEmailValid(
      String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    );
  }, [email]);

  //when a password changes update state about whether they match
  useEffect(() => {
    setPasswordsMatch(password === passwordConfirm);
  }, [passwordConfirm, password]);

  const handleBedTimeConfirm = (time) => {
    setsleepGoalStart(convertToMilitaryString(time));
    setBedTimePickerVisibility(false);
  };

  const handleWakeTimeConfirm = (time) => {
    setsleepGoalEnd(convertToMilitaryString(time));
    setWakeTimePickerVisibility(false);
  };

  //front end validation check on form data
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

    if (password === "") {
      Alert.alert("Error", "Please enter a password for account creation.");
      validated = false;
    }

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
      let newUser = {
        email,
        name,
        sleepGoalStart,
        sleepGoalEnd,
        userFactors,
        logReminderOn,
        sleepReminderOn,
      };
      console.log("newUser about to be added in db", newUser);

      dispatch(createProfile(newUser, password, navigation));
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
        <View>
          <Text>
            Bed Time Goal: {sleepGoalStart && convertToAmPm(sleepGoalStart)}
          </Text>

          <DateTimePickerModal
            isVisible={isBedTimePickerVisible}
            mode="time"
            onConfirm={handleBedTimeConfirm}
            onCancel={() => setBedTimePickerVisibility(!isBedTimePickerVisible)}
            minuteInterval={15}
          />
          <Button
            title="Set Time"
            onPress={() => setBedTimePickerVisibility(!isBedTimePickerVisible)}
          />
        </View>
        <View>
          <Text>
            Wake Up Goal: {sleepGoalEnd && convertToAmPm(sleepGoalEnd)}
          </Text>
          <DateTimePickerModal
            isVisible={isWakeTimePickerVisible}
            mode="time"
            onConfirm={handleWakeTimeConfirm}
            onCancel={() =>
              setWakeTimePickerVisibility(!isWakeTimePickerVisible)
            }
            minuteInterval={15}
          />
          <Button
            title="Set Time"
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
