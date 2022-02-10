import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import OnboardingSlide from "./OnboardingSlide";

import tw from "tailwind-react-native-classnames";
import { Ionicons } from "@expo/vector-icons";

const slideDetails = [
  {
    key: 1,
    imageUri: "../assets/onboarding/slide1.png",
    slidetext: "This explains that first picture",
  },
  {
    key: 2,
    imageUri: "../assets/onboarding/slide2.png",
    slidetext: "This explains that second picture",
  },
  {
    key: 3,
    imageUri: "../assets/onboarding/slide3.png",
    slidetext: "This explains that third picture",
  },
  {
    key: 4,
    imageUri: "../assets/onboarding/slide4.png",
    slidetext: "This explains that fourth picture",
  },
];

const Onboarding = ({ navigation }) => {
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={tw`text-white text-4xl font-black`}>
        {<Ionicons name={"bed"} size={36} color={"white"} />}onboarding here
      </Text>
      <OnboardingSlide />
      {slideDetails.map}
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
