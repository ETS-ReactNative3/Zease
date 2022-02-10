import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";

import tw from "tailwind-react-native-classnames";
import { Ionicons } from "@expo/vector-icons";

const OnboardingSlide = ({ slideInfo }) => {
  const { imageSource, slideText } = slideInfo;
  console.log("imageSource", imageSource);
  return (
    <View style={styles.container}>
      <Image
        style={{ width: 300, height: 300, borderRadius: 15 }}
        source={imageSource}
      />

      <Text style={tw`text-white text-lg font-black p-10 h-64`}>
        {slideText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1C3F52",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.95,
    paddingTop: 30,
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

export default OnboardingSlide;
