import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';


import ContactScreen from '../components/contact'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import FindFriends from '../components/findFriends';
import ProfileScreen from '../components/profile';

const Tab = createBottomTabNavigator();

export default class HomeScreen extends Component {

    render(){
    
      return (
  
        
          <Tab.Navigator  >
            <Tab.Screen name="Contacts" component={ContactScreen} />
            <Tab.Screen name="Find Friends" component={FindFriends} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
            
           
          </Tab.Navigator>
  
       
  
       
  
  
  
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