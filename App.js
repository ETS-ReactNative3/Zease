import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import store from './store';
import LoginScreen from './screens/LoginScreen';
import BuildProfile from './screens/BuildProfile';
import EditProfile from './screens/EditProfile';
import NavBar from './screens/NavBar';
import SingleEntry from './screens/SingleEntry';
import EditEntry from './screens/EditEntry';
import { LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Ignore log notification by message:
LogBox.ignoreAllLogs();

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              options={{ headerShown: false }}
              name='LoginScreen'
              component={LoginScreen}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name='BuildProfile'
              component={BuildProfile}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name='EditProfile'
              component={EditProfile}
            />
            <Stack.Screen options={{ headerShown: false, gestureEnabled: false}} name='NavBar' component={NavBar} />
            <Stack.Screen
              options={{ headerShown: false }}
              name='SingleEntry'
              component={SingleEntry}
            />
            <Stack.Screen options={{ headerShown: false }} name='EditEntry' component={EditEntry} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}
