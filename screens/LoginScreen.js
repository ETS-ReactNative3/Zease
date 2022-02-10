import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";

import BuildProfile from "./BuildProfile";
import tw from "tailwind-react-native-classnames";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useDispatch } from "react-redux";

import { login } from "../store/profile";
import { fetchDBFactors } from "../store/dbFactors";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const [showInfoModal, setShowInfoModal] = useState(false);

  const handleLogin = () => {
    dispatch(login(email, password, navigation));
    dispatch(fetchDBFactors());
    setEmail('')
    setPassword('')
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={tw`text-white text-4xl font-black`}>
        {<Ionicons name={"bed"} size={36} color={"white"} />}ZEASE
      </Text>
      <TouchableOpacity
        onPress={() => setShowInfoModal(true)}
        style={styles.button}
      >
        <Text style={styles.buttonText}>About</Text>
      </TouchableOpacity>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          placeholderTextColor={"gray"}
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor={"gray"}
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate(BuildProfile)}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="light" />
      <Modal
        transparent={false}
        animationType="slide"
        visible={showInfoModal}
        onRequestClose={() => setShowInfoModal(!showInfoModal)}
      >
        <View style={tw`flex-1 items-center justify-center`}>
          <Text>
            Zease allows you to log and track your sleep along with factors that
            may potentially affect it, such as caffeine.
          </Text>
          <Text>
            In profile creation select factors you're interested in tracking.
            When you make an entry about last night's rest add any sleep factors
            that were present for that sleep. When viewing visualizations of
            your sleep entries you will be able to see any correlations that may
            exist between factors you have chosen to track and the quality or
            duration of your sleep.
          </Text>
          <Text>
            Zease is a simple way to learn what you need to get the best night's
            rest, and build better habits around your sleep.
          </Text>
        </View>
        <TouchableOpacity onPress={() => setShowInfoModal(!showInfoModal)}>
          Close
        </TouchableOpacity>
      </Modal>
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
  inputContainer: {
    width: "80%",
    marginTop: 100,
  },
  input: {
    backgroundColor: "white",
    fontWeight: "bold",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#F78A03",
    paddingVertical: 12,
    width: 150,
    marginVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default LoginScreen;
