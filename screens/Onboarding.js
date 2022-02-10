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

const slides = [
  {
    id: 0,
    imageSource: require("../assets/onboarding/slide1.png"),
    slideText: "This explains that first picture",
  },
  {
    id: 1,
    imageSource: require("../assets/onboarding/slide2.png"),
    slideText: "This explains that second picture",
  },
  {
    id: 2,
    imageSource: require("../assets/onboarding/slide3.png"),
    slideText: "This explains that third picture",
  },
  {
    id: 3,
    imageSource: require("../assets/onboarding/slide4.png"),
    slideText: "This explains that fourth picture",
  },
];

const Onboarding = ({ navigation }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={tw`text-white text-4xl font-black`}>
        {<Ionicons name={"bed"} size={36} color={"white"} />}onboarding here
      </Text>
      <OnboardingSlide slideInfo={slides[currentSlide]} />
      <View style={tw`flex-row `}>
        {slides.map((slide) => {
          return (
            <TouchableOpacity
              key={slide.id}
              onPress={() => setCurrentSlide(slide.id)}
              style={styles.slideSelector}
            />
          );
        })}
      </View>
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
  slideSelector: {
    borderRadius: 50,
    backgroundColor: currentSlide === slide.id ? "#1C3F52" : "#fdf0d5",
    height: 25,
    width: 25,
    margin: 15,
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
