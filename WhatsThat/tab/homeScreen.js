import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';


import ChatScreen from '../components/chat';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';


const Tab = createBottomTabNavigator();

export default class HomeScreen extends Component {

    render(){
    
      return (
  
        <NavigationContainer initialRouteName = "Chat" independent={true} >
          <Tab.Navigator  >
            <Tab.Screen name="Chat" component={ChatScreen} />
            {/* <Tab.Screen name="SignupScreen" component={SignupScreen} /> */}
            
           
          </Tab.Navigator>
  
       
  
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