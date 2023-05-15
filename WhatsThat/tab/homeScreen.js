import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';


import ContactScreen from '../components/contact'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
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
          <Tab.Navigator screenOptions={{ headerShown: false }} >
              <Tab.Screen name="Contacts" component={ContactScreen} />
              <Tab.Screen name="Chats" component={ChatStack} />
              <Tab.Screen name="Find Friends" component={FindFriends} />
              {/* <Tab.Screen name="Profile" component={ProfileScreen} /> */}
              <Tab.Screen name="Profile" component={ProfileStack} />
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