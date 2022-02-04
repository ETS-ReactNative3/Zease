import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import DataVisualization from './DataVisualization';
import LoginScreen from './LoginScreen';
import Chart from './Chart';
import AddEntry from './AddEntry';
import AllSleepEntries from './AllSleepEntries';

const Tab = createBottomTabNavigator();

export default function NavBar() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Add') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Entries') {
            iconName = 'list';
          } else if (route.name === 'Analyze') {
            iconName = 'analytics';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#F78A03',
        tabBarInactiveTintColor: '#1C3F52',
        // we can decide if we want to show the default header or not
        headerShown: false
      })}
    >
      <Tab.Screen name='Add' component={AddEntry} />
      <Tab.Screen name='Entries' component={AllSleepEntries} />
      <Tab.Screen name='Analyze' component={DataVisualization} options={{ headerShown: true }} />
      <Tab.Screen name='Profile' component={LoginScreen} />
    </Tab.Navigator>
  );
}
