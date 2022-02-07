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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

import SleepFactorCategory from "./SleepFactorCategory";
import {
  convertToMilitaryString,
  convertToAmPm,
  reformatFactors,
} from "../Util";

const EditProfile = ({ navigation }) => {
  //sleep factor options from the DB (not specific to user)
  const [sleepFactors, setSleepFactors] = useState({});

  //Manage form inputs
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [sleepGoalStart, setsleepGoalStart] = useState(null);
  const [sleepGoalEnd, setsleepGoalEnd] = useState(null);
  const [logReminderOn, setLogReminder] = useState(false);
  const [sleepReminderOn, setSleepReminder] = useState(false);

  //form validation
  const [emailValid, setEmailValid] = useState(true);

  //visibility of modals
  const [isBedTimePickerVisible, setBedTimePickerVisibility] = useState(false);
  const [isWakeTimePickerVisible, setWakeTimePickerVisibility] =
    useState(false);
  const [isFactorInfoVisible, setFactorInfoVisibility] = useState(false);

  //when the page loads get info from db
  useEffect(() => {
    //get the sleep factors from db
    let sleepFactorsRef = database.ref("sleepFactors");
    sleepFactorsRef.on("value", (snapshot) => {
      const data = snapshot.val();
      setSleepFactors(data);
    });

    //Get logged in user's information and put it on local state/asyncStorage
    const userId = auth.currentUser.uid;
    const userRef = database.ref("users/" + userId);
    userRef.on("value", async (snapshot) => {
      const user = snapshot.val();
      setEmail(auth.currentUser.email);
      setName(user.name);
      setsleepGoalStart(user.sleepGoalStart);
      setsleepGoalEnd(user.sleepGoalEnd);
      setSleepReminder(user.sleepReminderOn);
      setLogReminder(user.logReminderOn);
      await AsyncStorage.setItem(
        "userFactors",
        JSON.stringify(user.userFactors)
      );
    });
  }, []);

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
        updateUserinDB(updatedUser);
      }
    } catch (error) {
      console.log(
        "there was an error in fetching the user's sleep factors from async storage: ",
        error
      );
    }
  };

  const updateUserinDB = (updatedUser) => {
    //update the user in firebase auth
    try {
      auth.currentUser.updateEmail(updatedUser.email);
    } catch (error) {
      console.log(
        "There was an error updating this user's email in firbase auth: ",
        error
      );
    }
    //update the user in firebase realtimee
    try {
      database.ref("users/" + auth.currentUser.uid).set(updatedUser);

      //go back to the navbar when done
      navigation.navigate("NavBar");
    } catch (error) {
      console.log(
        "There was an error updating this user's information in the reatime database: ",
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
