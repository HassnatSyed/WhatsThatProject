/* eslint-disable linebreak-style */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable linebreak-style */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/sort-comp */
/* eslint-disable eqeqeq */
/* eslint-disable max-len */
/* eslint-disable no-sequences */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-use-before-define */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable no-throw-literal */
/* eslint-disable react/jsx-filename-extension */
import React, { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Icon from 'react-native-vector-icons/MaterialIcons';
import ContactScreen from '../components/contact';
import FindFriends from '../components/findFriends';
import ProfileStack from '../stack/profileStack';
import ChatStack from '../stack/chatStack';

const Tab = createBottomTabNavigator();

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
        <Tab.Screen name="Profile" component={ProfileStack} options={{ headerShown: false }} />
      </Tab.Navigator>
    );
  }
}
