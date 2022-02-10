import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import OnboardingSlide from "./OnboardingSlide";
import { useSelector } from "react-redux";
import tw from "tailwind-react-native-classnames";
import { Ionicons } from "@expo/vector-icons";

const slides = [
  {
    id: 0,
    imageSource: require("../assets/onboarding/slide1.png"),
    slideText:
      "Congratulations on setting up your profile!  If you need to update it or log out, visit the Profile tab.",
  },
  {
    id: 1,
    imageSource: require("../assets/onboarding/slide2.png"),
    slideText:
      "Once you've made your first sleep entry you can review it - and any later entries - in the All Entries tab.  However you'll only be able to edit the entry about last night's sleep.",
  },
  {
    id: 2,
    imageSource: require("../assets/onboarding/slide3.png"),
    slideText:
      "Once you've made two sleep entries you can analyze the data.  If you need help understanding a chart, use the information icon.",
  },
  {
    id: 3,
    imageSource: require("../assets/onboarding/slide4.png"),
    slideText:
      "It all starts with making sleep entries!  You can only make one sleep entry every day, and it must be about your sleep from last night.",
  },
];

const Onboarding = ({ navigation }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const userName = useSelector((state) => state.profile.name) || "name";

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Text style={tw`text-white text-4xl font-black`}>
        {<Ionicons name={"bed"} size={36} color={"white"} />}Welcome, {userName}
        !
      </Text>
      <OnboardingSlide slideInfo={slides[currentSlide]} />
      <View style={tw`flex-row `}>
        {slides.map((slide) => {
          return (
            <TouchableOpacity
              key={slide.id}
              onPress={() => setCurrentSlide(slide.id)}
              style={{
                borderRadius: 50,
                backgroundColor:
                  currentSlide === slide.id ? "#F78A03" : "#fdf0d5",
                height: 25,
                width: 25,
                margin: 15,
              }}
            />
          );
        })}
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("NavBar")}
      >
        <Text style={styles.buttonText}>Make first sleep entry</Text>
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
    paddingTop: 60,
  },
  slideSelector: {
    borderRadius: 50,
    backgroundColor: "#fdf0d5",
    height: 25,
    width: 25,
    margin: 15,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#F78A03",
    paddingVertical: 12,
    width: 170,
    marginVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Onboarding;
