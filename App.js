import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import * as V from "victory";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import Chart from "./screens/Chart";
import { database } from "../firebase";
const Stack = createNativeStackNavigator();

export default function App() {
  //make it so we store data from firebase in our local state.
  const [data, setData] = useState([]);
  console.log("hello world");
  //I tried putting this inside useEffect and it didn't run.
  //so I made it a function to run when a button is pressed.  That didn't work either because the button isn't appearing.
  const getDataOnPress = () => {
    console.log("hello world");
    //get data from firebase
    const sleepEntriesRef = database.ref("simpleSleepEntries/");
    sleepEntriesRef.on("value", (snapshot) => {
      const sleepEntryData = snapshot.val();
      setData(sleepEntryData);
    });

    console.log("local state data", data);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Button
          onPress={() => {
            getDataOnPress();
          }}
          title="Get Data"
          accessibilityLabel="Get Data"
        />
        <Stack.Screen name="Chart" component={Chart} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
