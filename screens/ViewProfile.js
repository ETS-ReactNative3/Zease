import {
  StyleSheet,
  View,
  Text,
  Button,
  Pressable,
  TouchableOpacity,
  ScrollView
} from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { auth, database } from "../firebase";
import { convertToAmPm } from "../Util";
import { logout } from "../store/profile";
import tw from "tailwind-react-native-classnames";
import { StatusBar } from "expo-status-bar";

const AddEntry = ({ navigation }) => {
  let profileData = useSelector((state) => state.profile);
  let userFactors = useSelector((state) => state.userFactors);

  const dispatch = useDispatch();

  const handleEdit = () => {
    navigation.navigate("EditProfile");
  };

  const handleLogOut = async () => {
    dispatch(logout(navigation));
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.contentContainer}>
        {profileData.name && (
          <View>
            <Text style={tw`font-bold text-2xl text-white mb-6 text-center`}>Your Profile</Text>
            <View>
              <View style={styles.accountItem}>
                <View style={styles.header}>
                  <Text style={tw`font-semibold text-white`}>{`Name:`}</Text>
                </View>
                <View style={styles.item}>
                  <Text style={tw`font-bold text-white`}>{profileData.name}</Text>
                </View>
              </View>

              <View style={styles.accountItem}>
                <View style={styles.header}>
                  <Text style={tw`font-semibold text-white`}>{`Email:`}</Text>
                </View>
                <View style={styles.item}>
                  <Text style={tw`font-bold text-white`}>{auth.currentUser.email}</Text>
                </View>
              </View>

              <View style={styles.accountItem}>
                <View style={styles.header}>
                  <Text style={tw`font-semibold text-white`}>{`Bed Time Goal:`}</Text>
                </View>
                <View style={styles.item}>
                  <Text style={tw`font-bold text-white`}>
                    {convertToAmPm(profileData.sleepGoalStart)}
                  </Text>
                </View>
              </View>

              <View style={styles.accountItem}>
                <View style={styles.header}>
                  <Text style={tw`font-semibold text-white`}>{`Wake Up Goal:`}</Text>
                </View>
                <View style={styles.item}>
                  <Text style={tw`font-bold text-white`}>
                    {convertToAmPm(profileData.sleepGoalEnd)}
                  </Text>
                </View>
              </View>

              <View style={styles.accountItem}>
                <View style={styles.header}>
                  <Text style={tw`font-semibold text-white`}>{`Morning Log Reminder:`}</Text>
                </View>
                <View style={styles.item}>
                  <Text style={tw`font-bold text-white`}>
                    {profileData.logReminderOn ? "On" : "Off"}
                  </Text>
                </View>
              </View>

              <View style={styles.accountItem}>
                <View style={styles.header}>
                  <Text style={tw`font-semibold text-white`}>{`Evening Log Reminder:`}</Text>
                </View>
                <View style={styles.item}>
                  <Text style={tw`font-bold text-white`}>
                    {profileData.sleepReminderOn ? "On" : "Off"}
                  </Text>
                </View>
              </View>
            </View>
            <Text style={tw`font-bold text-white mt-10 mb-2 text-lg`}>Your Sleep Factors:</Text>
            <View>
              {Object.keys(userFactors).map((key) => (
                <Text key={key} style={tw`font-bold text-white mb-1`}>
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
        <StatusBar style="light" />
      </ScrollView>
    </View>
  );
};

export default AddEntry;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1C3F52",
    opacity: 0.95,
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  contentContainer: {
    width: "100%",
    marginTop: 80,
    paddingLeft: 30,
    paddingRight: 30
  },
  accountItem: {
    flexDirection: "row",
    paddingTop: 10
  },
  button: {
    alignItems: "center",
    backgroundColor: "#F78A03",
    paddingVertical: 12,
    width: 150,
    marginVertical: 10,
    borderRadius: 10
  },
  buttonContainer: {
    marginTop: 40,
    alignItems: "center"
  },
  buttonText: {
    color: "white",
    fontWeight: "bold"
  },
  header: {
    flex: 5
  },
  item: {
    flex: 4
  }
});
