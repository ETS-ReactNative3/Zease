import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";

import DataVisualization from "./DataVisualization";
import ViewProfile from "./ViewProfile";
import AllSleepEntries from "./AllSleepEntries";
import AddEntry from "./AddEntry";
import SingleEntry from "./SingleEntry";
import { setOldestEntry } from "../store/oldestEntry";
import { setNewestEntry } from "../store/newestEntry";
import { yesterday, getDateNumber } from "../Util";

const Tab = createBottomTabNavigator();

export default function NavBar() {
  //determine if the user has an entry that was made yesterday.
  const [loggedYesterday, setLoggedYesterday] = useState(false);
  //const userId = auth.currentUser ? auth.currentUser.uid : null;
  let userEntries = useSelector((state) => state.userEntries);
  const dispatch = useDispatch();

  //if an entry was made yesterday indicate that on local state.
  useEffect(() => {
    //identify oldest and newest entries for this user.
    let newestEntry = { date: "0" };
    let oldestEntry = { date: "3000-00-00" };
    userEntries.forEach((entry) => {
      let currentEntryDateNum = getDateNumber(entry.date);
      if (currentEntryDateNum > getDateNumber(newestEntry.date)) {
        newestEntry = entry;
      }
      if (currentEntryDateNum < getDateNumber(oldestEntry.date)) {
        oldestEntry = entry;
      }
    });
    //put the oldest and newest entries in redux store
    //(this is determining the correct domain of x axis in ChartB)
    dispatch(setNewestEntry(newestEntry));
    dispatch(setOldestEntry(oldestEntry));

    // console.log("newest entry date: ", newestEntry.date);
    // console.log("yesterday: ", yesterday());

    //if the most recent entry was made yesterday put it in async storage, and note on local state that an entry has been made today
    if (newestEntry.date === yesterday()) {
      setLoggedYesterday(true);
    }
  }, [userEntries]);

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
