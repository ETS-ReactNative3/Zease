import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";

import tw from "tailwind-react-native-classnames";
import { Ionicons } from "@expo/vector-icons";

const Onboarding = ({ navigation }) => {
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={tw`text-white text-4xl font-black`}>
        {<Ionicons name={"bed"} size={36} color={"white"} />}onboarding here
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("NavBar")}
      >
        <Text>Start using the app!</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1C3F52",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.95,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#F78A03",
    paddingVertical: 12,
    width: 150,
    marginVertical: 10,
    borderRadius: 10,
  },
});

export default Onboarding;
