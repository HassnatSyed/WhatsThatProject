import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

import LoginScreen from './components/login';
import SignupScreen from './components/signup';
import HomeScreen from './tab/homeScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import ProfileScreen from './components/profile';
import BlockedContacts from './components/blockedContacts';

const Stack = createNativeStackNavigator();
//const Tab = createBottomTabNavigator();

export default class App extends Component {

  render(){
  
    return (

      <NavigationContainer initialRouteName = "Login" independent={true} >
        <Stack.Navigator  screenOptions={{ headerShown: false }}>
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="SignupScreen" component={SignupScreen} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
          {/* <Stack.Screen name="BlockedContacts" component={BlockedContacts} /> */}
          
         
        </Stack.Navigator>

     

      </NavigationContainer>



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