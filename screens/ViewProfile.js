import { StyleSheet, View, Text, Button, Pressable, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';

import { auth, database } from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { convertToAmPm } from '../utils';
import tw from 'tailwind-react-native-classnames';

const AddEntry = ({ navigation }) => {
  // User sleep factors (pulled in from firebase)
  const [profileData, setProfileData] = useState({});

  // Grab userId from the firebase auth component
  const userId = auth.currentUser.uid;

  useEffect(() => {
    // Load user profile from firebase
    const profileRef = database.ref(`users/${userId}`);
    profileRef.on('value', (snapshot) => {
      const profile = snapshot.val();
      setProfileData(profile);
      //console.log("useEffect profile", profile);
    });
  }, []);

  const handleEdit = () => {
    console.log('Edit profile');

    navigation.navigate('EditProfile');
  };

  const handleLogOut = async () => {
    console.log('Logging out');
    await AsyncStorage.removeItem('oldestEntry');
    await AsyncStorage.removeItem('mostRecentEntry');
    await AsyncStorage.removeItem('userFactors');
    await AsyncStorage.removeItem('yesterdaysEntry');
    auth
      .signOut()
      .then(() => {
        console.log('Log out sucess');
        navigation.navigate('LoginScreen');
      })
      .catch((error) => {
        console.log('Error logging out', error);
      });

    await AsyncStorage.setItem('userFactors', JSON.stringify({}));
  };

  return (
    <View style={styles.container}>
      {profileData.name && (
        <View style={styles.contentContainer}>
          <Text style={tw`font-bold text-3xl text-white mb-5 text-center`}>Your Profile</Text>
          <View style={styles.accountContainer}>
            <View style={styles.accountItem}>
              <Text
                style={tw`font-semibold text-white`}
              >{`Name:                                     `}</Text>
              <Text style={tw`font-extrabold text-white`}>{profileData.name}</Text>
            </View>
            <View style={styles.accountItem}>
              <Text
                style={tw`font-semibold text-white`}
              >{`Email:                                      `}</Text>
              <Text style={tw`font-extrabold text-white`}>{auth.currentUser.email}</Text>
            </View>
            <View style={styles.accountItem}>
              <Text style={tw`font-semibold text-white`}>
                {`Bed Time Goal:                    `}{' '}
              </Text>
              <Text style={tw`font-extrabold text-white`}>
                {convertToAmPm(profileData.sleepGoalStart)}
              </Text>
            </View>
            <View style={styles.accountItem}>
              <Text style={tw`font-semibold text-white`}>
                {`Wake Up Goal:                     `}{' '}
              </Text>
              <Text style={tw`font-extrabold text-white`}>
                {convertToAmPm(profileData.sleepGoalEnd)}
              </Text>
            </View>
            <View style={styles.accountItem}>
              <Text style={tw`font-semibold text-white`}>{`Morning Log Reminder:     `} </Text>
              <Text style={tw`font-extrabold text-white`}>
                {profileData.logReminderOn ? 'On' : 'Off'}
              </Text>
            </View>
            <View style={styles.accountItem}>
              <Text style={tw`font-semibold text-white`}>{`Evening Sleep Reminder:   `}</Text>
              <Text style={tw`font-extrabold text-white`}>
                {profileData.sleepReminderOn ? 'On' : 'Off'}
              </Text>
            </View>
          </View>
          <Text style={tw`font-semibold text-white mt-10 mb-2`}>Your Sleep Factors:</Text>
          <View>
            {Object.keys(profileData.userFactors).map((key) => (
              <Text key={key} style={tw`font-extrabold text-white`}>
                {profileData.userFactors[key].name}
              </Text>
            ))}
          </View>
        </View>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleEdit}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLogOut}>
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddEntry;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1C3F52',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  contentContainer: {
    width: '80%'
  },
  accounttContainer: {
    paddingLeft: 5
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
