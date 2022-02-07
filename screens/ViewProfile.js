import { StyleSheet, View, Text, Button } from "react-native";
import React, { useEffect, useState } from "react";

import { auth, database } from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { convertToAmPm } from "../utils";

const AddEntry = ({ navigation }) => {
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
      //console.log("useEffect profile", profile);
    });
  }, []);

  const handleEdit = () => {
    console.log("Edit profile");

    navigation.navigate("BuildProfile");
  };

  const handleLogOut = async () => {
    console.log("Logging out");
    await AsyncStorage.removeItem("oldestEntry");
    await AsyncStorage.removeItem("mostRecentEntry");
    await AsyncStorage.removeItem("userFactors");
    await AsyncStorage.removeItem("yesterdaysEntry");
    auth
      .signOut()
      .then(() => {
        console.log("Log out sucess");
        navigation.navigate("LoginScreen");
      })
      .catch((error) => {
        console.log("Error logging out", error);
      });

    await AsyncStorage.setItem("userFactors", JSON.stringify({}));
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
            {Object.keys(profileData.userFactors).map((key) => (
              <Text key={key} style={styles.factorItem}>
                {profileData.userFactors[key].name}
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
