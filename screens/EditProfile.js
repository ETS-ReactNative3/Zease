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
import { updateProfile } from "../store/profile";

const EditProfile = ({ navigation }) => {
  const dispatch = useDispatch();

  //sleep factor options from the DB (not specific to user)
  const sleepFactors = useSelector((state) => state.dbFactors);

  //Manage form inputs
  let user = useSelector((state) => state.profile);
  const [email, setEmail] = useState(user.email || "");
  const [name, setName] = useState(user.name || "");
  const [sleepGoalStart, setsleepGoalStart] = useState(
    user.sleepGoalStart || null
  );
  const [sleepGoalEnd, setsleepGoalEnd] = useState(user.sleepGoalEnd || null);
  const [logReminderOn, setLogReminder] = useState(user.logReminderOn || false);
  const [sleepReminderOn, setSleepReminder] = useState(
    user.sleepReminderOn || false
  );
  let userFactors = useSelector((state) => state.userFactors);

  //form validation
  const [emailValid, setEmailValid] = useState(true);

  //visibility of modals
  const [isBedTimePickerVisible, setBedTimePickerVisibility] = useState(false);
  const [isWakeTimePickerVisible, setWakeTimePickerVisibility] =
    useState(false);
  const [isFactorInfoVisible, setFactorInfoVisibility] = useState(false);

  //when email changes update state about whether it is a valid email
  useEffect(() => {
    setEmailValid(
      String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    );
  }, [email]);

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

    if (!emailValid) {
      Alert.alert("Error", "Please enter a valid email address");
      validated = false;
    }

    try {
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
        let updatedUser = {
          email,
          name,
          sleepGoalStart,
          sleepGoalEnd,
          userFactors,
          logReminderOn,
          sleepReminderOn,
        };
        // console.log("newUser about to be updated in db", newUser)
        dispatch(updateProfile(updatedUser));
        navigation.navigate("NavBar");
      }
    } catch (error) {
      console.log(
        "there was an error in fetching the user's sleep factors from async storage: ",
        error
      );
    }
  };

  return (
    <View style={tw`flex-1 items-center justify-center`}>
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
          <TouchableOpacity onPress={() => navigation.navigate("NavBar")}>
            <Text>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default EditProfile;
