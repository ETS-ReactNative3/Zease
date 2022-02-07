import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { database, auth } from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

import DataVisualization from "./DataVisualization";
import ViewProfile from "./ViewProfile";
import AllSleepEntries from "./AllSleepEntries";
import AddEntry from "./AddEntry";
import SingleEntry from "./SingleEntry";
import EditEntry from "./EditEntry";
import { yesterday, getDateNumber } from "../Util";

const Tab = createBottomTabNavigator();

export default function NavBar() {
  //determine if the user has an entry that was made yesterday.
  const [loggedYesterday, setLoggedYesterday] = useState(false);
  const userId = auth.currentUser ? auth.currentUser.uid : currentUserId;

  //if an entry was made yesterday set it on local state.
  useEffect(() => {
    //get the sleep entries for this user
    const entryRef = database.ref(`sleepEntries/${userId}`);
    entryRef.on("value", async (snapshot) => {
      const entries = snapshot.val();

      //identify which entry was made most recently, and which is oldest.
      let mostRecentEntry = { date: "0" };
      let oldestEntry = { date: "3000-00-00" };
      for (let id in entries) {
        let currentEntry = entries[id];
        let currentEntryDateNum = getDateNumber(currentEntry.date);
        if (currentEntryDateNum > getDateNumber(mostRecentEntry.date)) {
          mostRecentEntry = currentEntry;
        }
        if (currentEntryDateNum < getDateNumber(oldestEntry.date)) {
          oldestEntry = currentEntry;
        }
      }

      //put the oldest and most recent entries in async storage (this is determining the correct domain of x axis in ChartB)
      await AsyncStorage.setItem(
        "mostRecentEntry",
        JSON.stringify(mostRecentEntry)
      );
      await AsyncStorage.setItem("oldestEntry", JSON.stringify(oldestEntry));

      // console.log("most recent entry date: ", mostRecentEntry.date);
      // console.log("yesterday: ", yesterday());

      //if the most recent entry was made yesterday put it in async storage, and note on local state that an entry has been made today
      if (mostRecentEntry.date === yesterday()) {
        setLoggedYesterday(true);
        await AsyncStorage.setItem(
          "yesterdaysEntry",
          JSON.stringify(mostRecentEntry)
        );
      }
    });
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Today") {
            iconName = "today-outline";
          } else if (route.name === "Entries") {
            iconName = "list";
          } else if (route.name === "Analyze") {
            iconName = "analytics";
          } else if (route.name === "Profile") {
            iconName = "person";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#F78A03",
        tabBarInactiveTintColor: "#1C3F52",
        // we can decide if we want to show the default header or not
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Today"
        component={loggedYesterday ? SingleEntry : AddEntry}
      />
      <Tab.Screen
        name="EditEntry"
        component={EditEntry}
      />
      <Tab.Screen name="Entries" component={AllSleepEntries} />

      <Tab.Screen
        name="Analyze"
        component={DataVisualization}
        options={{ headerShown: true }}
      />
      <Tab.Screen name="Profile" component={ViewProfile} />
    </Tab.Navigator>
  );
}
