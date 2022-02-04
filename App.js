import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import Chart from './screens/Chart';
import BuildProfile from './screens/BuildProfile';
import NavBar from './screens/NavBar';

import TestReadFromDB from './screens/TestReadFromDB';

// const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <NavBar />

      {/* <TestReadFromDB /> */}
      {/* /* <Chart />
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            options={{ headerShown: false }}
            name="Login"
            component={LoginScreen}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="BuildProfile"
            component={BuildProfile}
          />
        </Stack.Navigator>
    </NavigationContainer> */}
    </>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center'
//   }
// });
