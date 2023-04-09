import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getUserContacts} from '../api/getRequests/getRequests';


export default class ChatScreen extends Component {


    componentDidMount() {
        this.retrieveData();
    }
    retrieveData = async () => {
        try {
          const userToken = await AsyncStorage.getItem('userToken');
          const id = await AsyncStorage.getItem('userID');
          console.log(userToken, id);
          // Do something with userToken and id
          //alert("running")
          getUserContacts(userToken, ()=>{
            console.log("what do i do");
            
        })
        } catch (error) {
          console.log(error);
        }
    };

    getContacts(){
        getUserContacts(userToken, success)
    }

    render(){
        return(

            <View style={styles.container} >
                <View>
                    <TouchableOpacity  style={styles.loginbtn} onPress={() => this.retrieveData()}>
                        <View style={styles.button}>
                            <Text style={styles.buttonText}>Test</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                
                <View>
                    <TouchableOpacity >
                    
                            
                        <Text >You did it</Text>
                
                    </TouchableOpacity>
                </View>
            
            </View>
        );
       

    }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      alignItems: "stretch",
      justifyContent: "center",
      
      padding:"10%"
    },
    formContainer: {
  
    },
    email:{
      marginBottom: 5
    },
    password:{
      marginBottom: 10
    },
    loginbtn:{
  
    },
    signup:{
      justifyContent: "center",
      textDecorationLine: "underline",
      paddingTop: 0,
    },
    button: {
        marginTop: 100,
      marginBottom: 30,
      backgroundColor: '#2196F3'
    },
    buttonText: {
      textAlign: 'center',
      padding: 20,
      color: 'white'
    },
    error: {
        color: "red",
        fontWeight: '900'
    }
  });