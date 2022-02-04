import { StyleSheet, View, Text, Button, TextInput, Alert } from "react-native";
import React, { useEffect, useState, useRef } from "react";

import { auth, database } from "../firebase";
import { convertToMilitaryString, convertToAmPm } from "../utils";

const AddEntry = () => {
  // User sleep factors (pulled in from firebase)
  const [profileData, setProfileData] = useState({});

  // Grab userId from the firebase auth component
  const userId = auth.currentUser.uid;

  useEffect(() => {
    // Load user profile from firebase
    const profileRef = database.ref(`users/${userId}`);
    profileRef.on("value", (snapshot) => {
      const profile = snapshot.val();
      setProfileData(profile);
      console.log(profile);
    });
  }, []);

  const AccountItem = (key, val) => {
    return (
      <View style={styles.accountItem}>
        <Text>Name: </Text>
        <Text>Alston</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.header}>Your Profile</Text>
        <View style={styles.accountContainer}>
          <View style={styles.accountItem}>
            <Text>Name: </Text>
            <Text>{profileData.name}</Text>
          </View>
          <View style={styles.accountItem}>
            <Text>Email: </Text>
            <Text>{auth.currentUser.email}</Text>
          </View>
          <View style={styles.accountItem}>
            <Text>Bed Time Goal: </Text>
            <Text>{convertToAmPm(profileData.sleepGoalStart)}</Text>
          </View>
          <View style={styles.accountItem}>
            <Text>Wake Up Goal: </Text>
            <Text>{convertToAmPm(profileData.sleepGoalEnd)}</Text>
          </View>
          <View style={styles.accountItem}>
            <Text>Morning Log Reminder: </Text>
            <Text>{profileData.logReminderOn ? "On" : "Off"}</Text>
          </View>
          <View style={styles.accountItem}>
            <Text>Evening Sleep Reminder: </Text>
            <Text>{profileData.sleepReminderOn ? "On" : "Off"}</Text>
          </View>
        </View>
        <Text style={styles.header}>Your Sleep Factors</Text>
        <View style={styles.factorsContainer}>
          {Object.keys(profileData.userFactors).map((key) => (
            <Text style={styles.factorItem}>{profileData.userFactors[key].name}</Text>
          ))}
        </View>
      </View>
    </View>
  );
};

export default AddEntry;

const styles = StyleSheet.create({
  container: {
    width: "80%",
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  contentContainer: {
    width: "80%",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginTop: 20,
  },
  accountItem: {
    flexDirection: "row",
    paddingTop: 5,
  },
  factorItem: {
    paddingTop: 5,
  },
});
