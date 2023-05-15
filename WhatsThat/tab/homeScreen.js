/* eslint-disable react/prefer-stateless-function */
/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable no-sequences */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-use-before-define */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable no-throw-literal */
/* eslint-disable react/jsx-filename-extension */
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ContactScreen from '../components/contact';
import FindFriends from '../components/findFriends';
import ProfileScreen from '../components/profile';
import BlockedContacts from '../components/blockedContacts';
import ProfileStack from '../stack/profileStack';
import ChatList from '../components/chatList';
import ChatStack from '../stack/chatStack';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default class HomeScreen extends Component {
  render() {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            switch (route.name) {
              case 'Contacts':
                iconName = focused ? 'contacts' : 'contacts'; // Choose the icon name based on whether the tab is focused
                break;
              case 'Chats':
                iconName = focused ? 'chat' : 'chat';
                break;
              case 'Find Friends':
                iconName = focused ? 'person-search' : 'person-search';
                break;
              case 'Profile':
                iconName = focused ? 'person' : 'person';
                break;
              default:
                iconName = 'circle';
                break;
            }

            // Return a MaterialIcons component
            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen name="Contacts" component={ContactScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Chats" component={ChatStack} options={{ headerShown: false }} />
        <Tab.Screen name="Find Friends" component={FindFriends} options={{ headerShown: false }} />
        {/* <Tab.Screen name="Profile" component={ProfileScreen} /> */}
        <Tab.Screen name="Profile" component={ProfileStack} options={{ headerShown: false }} />
      </Tab.Navigator>
    );
  }
}

// function BlockedContactsScreen() {
//   return (
//       <Stack.Navigator screenOptions={{ headerShown: false }}>
//           <Stack.Screen name="UserProfile" component={ProfileScreen}/>
//           <Stack.Screen name="BlockedContacts" component={BlockedContacts} />
//       </Stack.Navigator>
//   );
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
