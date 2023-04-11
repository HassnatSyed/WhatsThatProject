import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';


import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import ProfileScreen from '../components/profile';
import BlockedContacts from '../components/blockedContacts';
// import ProfileScreen from './components/profile';
// import BlockedContacts from './components/blockedContacts';

const Stack = createNativeStackNavigator();
//const Tab = createBottomTabNavigator();

export default class ProfileStack extends Component {

  render(){
  
    return (

        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="UserProfile" component={ProfileScreen}/>
            <Stack.Screen name="BlockedContacts" component={BlockedContacts} />
        </Stack.Navigator>



     /* <View style={styles.container}>
        <LoginScreen />
      </View>*/
      //<FlatListDemo />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});