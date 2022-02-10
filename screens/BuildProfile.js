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
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import React from "react";
import { useEffect, useState, useRef } from "react";
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

  const bedTimeModalRef = useRef();
  const wakeTimeModalRef = useRef();

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
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView style={styles.contentContainer}>
        <Text style={tw`text-white text-2xl font-bold mb-2 text-center mt-10`}>
          Welcome to Zease!
        </Text>
        <Text style={tw`text-white text-xs font-semibold mb-10 text-center`}>
          Please complete your user profile below
        </Text>

        <View style={styles.accountItem}>
          <Text
            style={tw`font-semibold text-white ml-1`}
          >{`Email Address:`}</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Email*"
              placeholderTextColor={"gray"}
              backgroundColor={"white"}
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
            {!emailValid && (
              <Ionicons
                name="alert-outline"
                style={styles.icon}
                size={30}
                color="red"
              />
            )}
          </View>
        </View>

        <View style={styles.accountItem}>
          <Text
            style={tw`font-semibold text-white ml-1`}
          >{`Create Your Password:`}</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Password*"
              placeholderTextColor={"gray"}
              backgroundColor={"white"}
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry
            />
            {!passwordsMatch && (
              <Ionicons
                name="alert-outline"
                style={styles.icon}
                size={30}
                color="red"
              />
            )}
          </View>
        </View>

        <View style={styles.accountItem}>
          <Text
            style={tw`font-semibold text-white ml-1`}
          >{`Confirm Your Password:`}</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm Password*"
            placeholderTextColor={"gray"}
            backgroundColor={"white"}
            value={passwordConfirm}
            onChangeText={(text) => setPasswordConfirm(text)}
            secureTextEntry
          />
        </View>

        <View style={styles.accountItem}>
          <Text
            style={tw`font-semibold text-white ml-1`}
          >{`Enter Your Name:`}</Text>
          <TextInput
            style={styles.input}
            placeholder="Your Name*"
            placeholderTextColor={"gray"}
            backgroundColor={"white"}
            value={name}
            onChangeText={(text) => setName(text)}
          />
        </View>

        <View style={tw`flex-row mb-2`}>
          <Text style={tw`font-semibold ml-6 text-white mt-3`}>
            {sleepGoalStart && convertToAmPm(sleepGoalStart)}
          </Text>

          <DateTimePickerModal
            isVisible={isBedTimePickerVisible}
            mode="time"
            ref={bedTimeModalRef}
            onConfirm={handleBedTimeConfirm}
            onCancel={() => setBedTimePickerVisibility(!isBedTimePickerVisible)}
            minuteInterval={15}
          />
          <View style={styles.updateButton}>
            <Button
              color="#F78A03"
              title="Set Your Bed Time Goal"
              onPress={() => {
                setBedTimePickerVisibility(!isBedTimePickerVisible);
                bedTimeModalRef.current.state.currentDate.setHours(20, 0, 0, 0);
              }}
            />
          </View>
        </View>
        <View style={tw`flex-row mb-4`}>
          <Text style={tw`font-semibold ml-6 text-white mt-3`}>
            {sleepGoalEnd && convertToAmPm(sleepGoalEnd)}
          </Text>
          <DateTimePickerModal
            isVisible={isWakeTimePickerVisible}
            mode="time"
            ref={wakeTimeModalRef}
            onConfirm={handleWakeTimeConfirm}
            onCancel={() =>
              setWakeTimePickerVisibility(!isWakeTimePickerVisible)
            }
            minuteInterval={15}
          />
          <View style={styles.updateButton}>
            <Button
              color="#F78A03"
              title="Set Your Wake Up Goal"
              onPress={() => {
                setWakeTimePickerVisibility(!isWakeTimePickerVisible);
                wakeTimeModalRef.current.state.currentDate.setHours(8, 0, 0, 0);
              }}
            />
          </View>
        </View>
        <View style={styles.switches}>
          <Switch
            style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
            value={logReminderOn}
            onValueChange={() =>
              setLogReminder((previousValue) => !previousValue)
            }
          />
          <Text style={tw`font-semibold text-white mt-2 ml-1`}>
            Remind me to enter daily sleep log
          </Text>
        </View>
        <View style={styles.switches}>
          <Switch
            style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
            value={sleepReminderOn}
            onValueChange={() =>
              setSleepReminder((previousValue) => !previousValue)
            }
          />
          <Text style={tw`font-semibold text-white mt-2 ml-1`}>
            Remind me to go to sleep
          </Text>
        </View>
        <View style={styles.accountItem}>
          <View style={tw`flex-row mt-5`}>
            <Text style={tw`font-bold text-lg text-white mr-2 mb-3`}>
              Sleep Factors
            </Text>
            <TouchableOpacity onPress={() => setFactorInfoVisibility(true)}>
              <Ionicons
                style={tw`mt-1 text-white`}
                name="information-circle-outline"
                size={20}
              />
            </TouchableOpacity>
          </View>
        </View>

        <Modal
          transparent={false}
          animationType="slide"
          visible={isFactorInfoVisible}
          onRequestClose={() => setFactorInfoVisibility(!isFactorInfoVisible)}
        >
          <View style={tw`flex-1 items-center justify-center`}>
            <View style={tw`p-4`}>
              <Text style={tw`p-4 text-base`}>
                A sleep factor is something that has the potential to affect
                your sleep.
              </Text>
              <Text style={tw`p-4 text-base`}>
                When you are making a daily sleep entry you will be able to
                select any number of the sleep factors you choose here.
              </Text>
              <Text style={tw`p-4 text-base`}>
                When viewing visualizations of your sleep entries you will be
                able to see any correlations that may exist between factors you
                have chosen to track and the quality or duration of your sleep.
              </Text>
            </View>
            <Pressable
              onPress={() => setFactorInfoVisibility(!isFactorInfoVisible)}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Close</Text>
            </Pressable>
          </View>
        </Modal>
        <View style={styles.accountItem}>
          {reformatFactors(sleepFactors).map((category) => {
            return (
              <SleepFactorCategory key={category.name} category={category} />
            );
          })}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("LoginScreen")}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1C3F52",
    opacity: 0.95,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    width: "100%",
    marginTop: 80,
    paddingLeft: 30,
    paddingRight: 30,
  },
  accountItem: {
    width: "95%",
    justifyContent: "center",
    marginLeft: 20,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#F78A03",
    paddingVertical: 12,
    width: 150,
    marginVertical: 10,
    borderRadius: 10,
  },
  buttonContainer: {
    marginTop: 40,
    marginBottom: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  icon: {
    marginTop: 10,
  },
  input: {
    width: "90%",
    height: 40,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#1C3F52",
    borderRadius: 5,
    padding: 10,
    marginBottom: 25,
  },
  inputRow: {
    flexDirection: "row",
  },
  switches: {
    flex: 1,
    flexDirection: "row",
    marginLeft: 20,
    marginBottom: 4,
  },
  updateButton: {
    flex: 1,
    marginBottom: 10,
  },
});

export default BuildProfile;
