import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { auth, database } from '../firebase';
import BuildProfile from './BuildProfile';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then(async (userCredentials) => {
        const user = userCredentials.user;
        const userId = user.uid;
        console.log('Logged In with', user.email);
        console.log('userId', userId);
        try {
          await AsyncStorage.setItem('userID', JSON.stringify(userId));
        } catch (error) {
          console.log(
            'there was an error in attempting to save the userID info in async storage: ',
            error
          );
        }
        //show the navbar screen after login
        navigation.navigate('NavBar');
      })
      .catch((error) => alert(error.message));
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior='padding'>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder='Email'
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder='Password'
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1C3F52',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputContainer: {
    width: '80%'
  },
  input: {
    backgroundColor: 'white',
    fontWeight: 'bold',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    marginVertical: 10
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    alignItems: 'center'
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'orange',
    paddingVertical: 12,
    width: 150,
    marginVertical: 10,
    borderRadius: 10
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold'
  }
});

export default LoginScreen;
