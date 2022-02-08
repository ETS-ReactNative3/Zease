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
  StyleSheet
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

const EditProfile = ({ navigation }) => {
  //sleep factor options from the DB (not specific to user)
  const [sleepFactors, setSleepFactors] = useState({});

  //Manage form inputs
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [sleepGoalStart, setsleepGoalStart] = useState(null);
  const [sleepGoalEnd, setsleepGoalEnd] = useState(null);
  const [logReminderOn, setLogReminder] = useState(false);
  const [sleepReminderOn, setSleepReminder] = useState(false);

  //form validation
  const [emailValid, setEmailValid] = useState(true);

  //visibility of modals
  const [isBedTimePickerVisible, setBedTimePickerVisibility] = useState(false);
  const [isWakeTimePickerVisible, setWakeTimePickerVisibility] = useState(false);
  const [isFactorInfoVisible, setFactorInfoVisibility] = useState(false);

  //when the page loads get info from db
  useEffect(() => {
    //get the sleep factors from db
    let sleepFactorsRef = database.ref('sleepFactors');
    sleepFactorsRef.on('value', (snapshot) => {
      const data = snapshot.val();
      setSleepFactors(data);
    });

    //Get logged in user's information and put it on local state/asyncStorage
    const userId = auth.currentUser.uid;
    const userRef = database.ref('users/' + userId);
    userRef.on('value', async (snapshot) => {
      const user = snapshot.val();
      setEmail(auth.currentUser.email);
      setName(user.name);
      setsleepGoalStart(user.sleepGoalStart);
      setsleepGoalEnd(user.sleepGoalEnd);
      setSleepReminder(user.sleepReminderOn);
      setLogReminder(user.logReminderOn);
      await AsyncStorage.setItem('userFactors', JSON.stringify(user.userFactors));
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
      Alert.alert('Error', 'Please enter a valid email address');
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
        let updatedUser = {
          email,
          name,
          sleepGoalStart,
          sleepGoalEnd,
          userFactors,
          logReminderOn,
          sleepReminderOn
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
      console.log("There was an error updating this user's email in firbase auth: ", error);
    }
    //update the user in firebase realtimee
    try {
      database.ref('users/' + auth.currentUser.uid).set(updatedUser);

      //go back to the navbar when done
      navigation.navigate('NavBar');
    } catch (error) {
      console.log(
        "There was an error updating this user's information in the reatime database: ",
        error
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={tw`font-bold text-3xl text-white mb-5 text-center`}>Edit Your Profile</Text>

        <View style={styles.accountItem}>
          <Text
            style={tw`font-semibold text-white`}
          >{`Name:                                     `}</Text>
          <TextInput
            style={tw`font-extrabold text-white`}
            placeholder='Name'
            value={name}
            onChangeText={(text) => setName(text)}
          />
        </View>

        <View style={styles.accountItem}>
          <Text
            style={tw`font-semibold text-white`}
          >{`Email:                                      `}</Text>
          <TextInput
            style={tw`font-extrabold text-white`}
            placeholder='Email'
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          {!emailValid && <Ionicons name='alert-outline' size={20} color='red' />}
        </View>

        <View style={styles.accountItem}>
          <Text style={tw`font-semibold text-white`}>{`Bed Time Goal:                    `} </Text>
          <Text style={tw`font-extrabold text-white`}>
            {sleepGoalStart && convertToAmPm(sleepGoalStart)}
          </Text>
        </View>

        <View>
          <DateTimePickerModal
            isVisible={isBedTimePickerVisible}
            mode='time'
            onConfirm={handleBedTimeConfirm}
            onCancel={() => setBedTimePickerVisibility(!isBedTimePickerVisible)}
            minuteInterval={15}
          />
          <Button
            title='Update Bed Time Goal'
            onPress={() => setBedTimePickerVisibility(!isBedTimePickerVisible)}
          />
        </View>

        <View style={styles.accountItem}>
          <Text style={tw`font-semibold text-white`}>{`Wake Up Goal:                     `} </Text>
          <Text style={tw`font-extrabold text-white`}>
            {sleepGoalEnd && convertToAmPm(sleepGoalEnd)}
          </Text>
        </View>

        <View>
          <DateTimePickerModal
            isVisible={isWakeTimePickerVisible}
            mode='time'
            onConfirm={handleWakeTimeConfirm}
            onCancel={() => setWakeTimePickerVisibility(!isWakeTimePickerVisible)}
            minuteInterval={15}
          />
          <Button
            title='Set Time'
            onPress={() => setWakeTimePickerVisibility(!isWakeTimePickerVisible)}
          />
        </View>

        <View style={tw`flex-row mb-4`}>
          <Switch
            style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
            value={logReminderOn}
            onValueChange={() => setLogReminder((previousValue) => !previousValue)}
          />
          <Text style={tw`font-semibold text-white mt-2 ml-1`}>
            Remind me to enter daily sleep log
          </Text>
        </View>
        <View style={tw`flex-row`}>
          <Switch
            style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
            value={sleepReminderOn}
            onValueChange={() => setSleepReminder((previousValue) => !previousValue)}
          />
          <Text style={tw`font-semibold text-white mt-2 ml-1`}>Remind me to go to sleep</Text>
        </View>

        <View style={tw`flex-row mt-5`}>
          <Text style={tw`font-bold text-lg text-white mr-2 mb-3`}>Sleep Factors</Text>
          <TouchableOpacity onPress={() => setFactorInfoVisibility(true)}>
            <Ionicons style={tw`mt-1 text-white`} name='information-circle-outline' size={20} />
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
              A sleep factor is something that has the potential to affect your sleep. When you are
              making a daily sleep entry you will be able to select any number of the sleep factors
              you choose here. When viewing visualizations of your sleep entries you will be able to
              see any correlations that may exist between factors you have chosen to track and the
              quality or duration of your sleep.
            </Text>
            <Pressable onPress={() => setFactorInfoVisibility(!isFactorInfoVisible)}>
              <Text>Close</Text>
            </Pressable>
          </View>
        </Modal>
        {reformatFactors(sleepFactors).map((category) => {
          return (
            <SleepFactorCategory
              style={styles.sleepFactors}
              key={category.name}
              category={category}
            />
          );
        })}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('NavBar')}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
  contentContainer: {
    width: '80%'
  },
  accountItem: {
    flexDirection: 'row',
    paddingTop: 10
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
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold'
  }
});

export default EditProfile;
