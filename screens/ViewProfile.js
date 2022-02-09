import { StyleSheet, View, Text, Button, Pressable, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { auth, database } from '../firebase';
import { convertToAmPm } from '../Util';
import { logout } from '../store/profile';
import tw from 'tailwind-react-native-classnames';

const AddEntry = ({ navigation }) => {
  let profileData = useSelector((state) => state.profile);
  let userFactors = useSelector((state) => state.userFactors);

  const dispatch = useDispatch();

  const handleEdit = () => {
    console.log('Edit profile');
    navigation.navigate('EditProfile');
  };

  const handleLogOut = async () => {
    console.log('Logging out');
    dispatch(logout(navigation));
  };

  return (
    <View style={styles.container}>
      {profileData.name && (
        <View style={styles.contentContainer}>
          <Text style={tw`font-bold text-3xl text-white mb-5 text-center`}>Your Profile</Text>
          <View>
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
            {Object.keys(userFactors).map((key) => (
              <Text key={key} style={tw`font-extrabold text-white mb-1`}>
                {userFactors[key].name}
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
