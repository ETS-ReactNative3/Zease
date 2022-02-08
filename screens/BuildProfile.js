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
  SafeAreaView
} from 'react-native';
import React from 'react';
import { useEffect, useState } from 'react';
import { auth, database } from '../firebase';
import tw from 'tailwind-react-native-classnames';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import SleepFactorCategory from './SleepFactorCategory';
import { convertToMilitaryString, convertToAmPm, reformatFactors } from '../Util';

const BuildProfile = ({ navigation }) => {
  //sleep factor options from the DB (not specific to user)
  const [sleepFactors, setSleepFactors] = useState({});

  //Manage form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [sleepGoalStart, setsleepGoalStart] = useState(null);
  const [sleepGoalEnd, setsleepGoalEnd] = useState(null);
  const [logReminderOn, setLogReminder] = useState(false);
  const [sleepReminderOn, setSleepReminder] = useState(false);

  //form validation
  const [emailValid, setEmailValid] = useState(true);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  //visibility of modals
  const [isBedTimePickerVisible, setBedTimePickerVisibility] = useState(false);
  const [isWakeTimePickerVisible, setWakeTimePickerVisibility] = useState(false);
  const [isFactorInfoVisible, setFactorInfoVisibility] = useState(false);

  //when the page loads get the sleep factors from db
  useEffect(() => {
    let sleepFactorsRef = database.ref('sleepFactors');
    sleepFactorsRef.on('value', (snapshot) => {
      const data = snapshot.val();
      setSleepFactors(data);
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
      Alert.alert('Error', 'Password and Confirm Password do not match.');
      validated = false;
    }

    if (!emailValid) {
      Alert.alert('Error', 'Please enter a valid email address');
      validated = false;
    }

    if (password === '') {
      Alert.alert('Error', 'Please enter a password for account creation.');
      validated = false;
    }

    try {
      //get the user's selected sleep factors from async storage
      const userFactorsString = await AsyncStorage.getItem('userFactors');
      const userFactors = userFactorsString ? JSON.parse(userFactorsString) : {};
      if (Object.keys(userFactors).length === 0) {
        Alert.alert('Error', 'Please select at least one sleep factor');
        validated = false;
      }

      //make sure that all required fields are filled in
      if (email === '' || name === '' || sleepGoalStart === null || sleepGoalEnd === null) {
        Alert.alert('Error', 'Please fill in all required fields.');
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
          sleepReminderOn
        };
        // console.log("newUser about to be added in db", newUser)
        putUserinDB(newUser);
      }
    } catch (error) {
      console.log(
        "there was an error in fetching the user's sleep factors from async storage: ",
        error
      );
    }
  };

  //once form entry has been validated write it to auth and Realtime db
  const putUserinDB = async (newUser) => {
    try {
      auth
        .createUserWithEmailAndPassword(email, password)
        .then((userCredentials) => {
          const userId = userCredentials.user.uid;
          database.ref('users/' + userId).set(newUser);
        })
        .catch((error) => alert(error.message));

      navigation.navigate('NavBar');
    } catch (error) {
      console.log('there was an error in attempting to add this user to the database: ', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={tw`text-white text-3xl font-extrabold mb-2 text-center mt-4`}>
          Welcome to Zease!
        </Text>
        <Text style={tw`text-white text-xs font-bold mb-6 text-center`}>
          Please complete your user profile below
        </Text>
        <View style={tw`bg-white rounded-xl px-10 pt-6`}>
          <View style>
            <TextInput
              style={styles.input}
              placeholder='Email*'
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
            {!emailValid && <Ionicons name='alert-outline' size={20} color='red' />}
          </View>
          <View>
            <TextInput
              style={styles.input}
              placeholder='Password*'
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry
            />
            {!passwordsMatch && <Ionicons name='alert-outline' size={20} color='red' />}
          </View>
          <TextInput
            style={styles.input}
            placeholder='Confirm Password*'
            value={passwordConfirm}
            onChangeText={(text) => setPasswordConfirm(text)}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder='Your Name*'
            value={name}
            onChangeText={(text) => setName(text)}
          />
          <View style={tw`flex-row mb-2`}>
            <Text>{sleepGoalStart && convertToAmPm(sleepGoalStart)}</Text>

            <DateTimePickerModal
              isVisible={isBedTimePickerVisible}
              mode='time'
              onConfirm={handleBedTimeConfirm}
              onCancel={() => setBedTimePickerVisibility(!isBedTimePickerVisible)}
              minuteInterval={15}
            />
            <Button
              title='Set Bed Time Goal'
              onPress={() => setBedTimePickerVisibility(!isBedTimePickerVisible)}
            />
          </View>
          <View style={tw`flex-row mb-4`}>
            <Text>{sleepGoalEnd && convertToAmPm(sleepGoalEnd)}</Text>
            <DateTimePickerModal
              isVisible={isWakeTimePickerVisible}
              mode='time'
              onConfirm={handleWakeTimeConfirm}
              onCancel={() => setWakeTimePickerVisibility(!isWakeTimePickerVisible)}
              minuteInterval={15}
            />
            <Button
              title='Set Wake Up Goal'
              onPress={() => setWakeTimePickerVisibility(!isWakeTimePickerVisible)}
            />
          </View>
          <View style={tw`flex-row mb-4`}>
            <Switch
              style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
              value={logReminderOn}
              onValueChange={() => setLogReminder((previousValue) => !previousValue)}
            />
            <Text style={tw`font-semibold text-gray-800 mt-2 ml-1`}>
              Remind me to enter daily sleep log
            </Text>
          </View>
          <View style={tw`flex-row mb-4`}>
            <Switch
              style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
              value={sleepReminderOn}
              onValueChange={() => setSleepReminder((previousValue) => !previousValue)}
            />
            <Text style={tw`font-semibold text-gray-800 mt-2 ml-1`}>Remind me to go to sleep</Text>
          </View>
          <View style={tw`flex-row mt-5`}>
            <Text style={tw`font-bold text-lg text-gray-800 mr-2 mb-3`}>Sleep Factors</Text>
            <TouchableOpacity onPress={() => setFactorInfoVisibility(true)}>
              <Ionicons
                style={tw`mt-1 text-gray-800`}
                name='information-circle-outline'
                size={20}
              />
            </TouchableOpacity>
          </View>
          <Modal
            transparent={false}
            animationType='slide'
            visible={isFactorInfoVisible}
            onRequestClose={() => setFactorInfoVisibility(!isFactorInfoVisible)}
          >
            <View style={tw`flex-1 items-center justify-center`}>
              <Text>
                A sleep factor is something that has the potential to affect your sleep. When you
                are making a daily sleep entry you will be able to select any number of the sleep
                factors you choose here. When viewing visualizations of your sleep entries you will
                be able to see any correlations that may exist between factors you have chosen to
                track and the quality or duration of your sleep.
              </Text>
              <Pressable onPress={() => setFactorInfoVisibility(!isFactorInfoVisible)}>
                <Text>Close</Text>
              </Pressable>
            </View>
          </Modal>
          {reformatFactors(sleepFactors).map((category) => {
            return <SleepFactorCategory key={category.name} category={category} />;
          })}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('LoginScreen')}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1C3F52',
    opacity: 0.95,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#F78A03',
    paddingVertical: 12,
    width: 150,
    marginVertical: 10,
    borderRadius: 10
  },
  buttonContainer: {
    marginTop: 40,
    marginBottom: 20,
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderColor: '#1C3F52',
    borderRadius: 2,
    padding: 10
  }
});

export default BuildProfile;
