import { StyleSheet, View, Text, TextInput } from "react-native";
import React from "react";
import { useEffect, useState } from "react";
import { database } from "../firebase";
import tw from "tailwind-react-native-classnames";

const BuildProfile = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [name, setName] = useState("");
  return (
    <View style={tw`flex-1 items-center justify-center`}>
      <Text>Welcome!</Text>
      <View>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
        />
        <TextInput
          placeholder="passwordConfirm"
          value={passwordConfirm}
          onChangeText={(text) => setPasswordConfirm(text)}
          secureTextEntry
        />
        <TextInput
          placeholder="name"
          value={name}
          onChangeText={(text) => setName(text)}
        />
      </View>
    </View>
  );
};

export default BuildProfile;
