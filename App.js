import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import BuildProfile from './screens/BuildProfile';
import NavBar from './screens/NavBar';

import TestReadFromDB from './screens/TestReadFromDB';

// const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false }} name='LoginScreen' component={LoginScreen} />
        <Stack.Screen
          options={{ headerShown: false }}
          name='BuildProfile'
          component={BuildProfile}
        />
        <Stack.Screen options={{ headerShown: false }} name='NavBar' component={NavBar} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
