import { StyleSheet, View, Text, Button } from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { auth, database } from "../firebase";
import { convertToAmPm } from "../Util";
import { logout } from "../store/profile";

const AddEntry = ({ navigation }) => {
  let profileData = useSelector((state) => state.profile);
  let userFactors = useSelector((state) => state.userFactors);

  const dispatch = useDispatch();

  const handleEdit = () => {
    console.log("Edit profile");
    navigation.navigate("EditProfile");
  };

  const handleLogOut = async () => {
    console.log("Logging out");
    dispatch(logout(navigation));
  };

  return (
    <View style={styles.container}>
      {profileData.name && (
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
            {Object.keys(userFactors).map((key) => (
              <Text key={key} style={styles.factorItem}>
                {userFactors[key].name}
              </Text>
            ))}
          </View>
        </View>
      )}
      <Button title="Edit Profile" onPress={handleEdit} />
      <Button title="Log Out" onPress={handleLogOut} />
    </View>
  );
};

export default AddEntry;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  accounttContainer: {
    paddingLeft: 5,
  },
  accountItem: {
    flexDirection: "row",
    paddingTop: 5,
  },
  factorsContainer: {
    paddingLeft: 5,
  },
  factorItem: {
    paddingTop: 5,
  },
});
