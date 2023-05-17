/* eslint-disable linebreak-style */
/* eslint-disable camelcase */
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
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../components/profile';
import BlockedContacts from '../components/blockedContacts';
import EditProfile from '../components/editProfile';
import CameraSendToServer from '../components/camera';
// import ProfileScreen from './components/profile';
// import BlockedContacts from './components/blockedContacts';

const Stack = createNativeStackNavigator();

export default class ProfileStack extends Component {
  render() {
    return (

      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="UserProfile" component={ProfileScreen} />
        <Stack.Screen name="BlockedContacts" component={BlockedContacts} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="CameraSendToServer" component={CameraSendToServer} />
      </Stack.Navigator>

    );
  }
}
