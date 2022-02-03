import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import LoginScreen from './LoginScreen';
import Chart from './Chart';

function AddScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Add Your Entry Here</Text>
    </View>
  );
}

function AllSleepEntries() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>All Sleep Entries Here</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function NavBar() {
  return (
    <NavigationContainer>
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
        <Tab.Screen name='Add' component={AddScreen} />
        <Tab.Screen name='Entries' component={AllSleepEntries} />
        <Tab.Screen name='Analyze' component={Chart} options={{ headerShown: true }} />
        <Tab.Screen name='Profile' component={LoginScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
