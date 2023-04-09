import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import LoginScreen from './login';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class ProfileScreen extends Component {

    async logout () {
        console.log("Logout")
        
        return fetch("http://localhost:3333/api/1.0.0/logout", {
      
        method: "POST",
        headers: {
            "X-Authorization": await AsyncStorage.getItem("userToken")
        }
        })
        .then(async (response) => {
        
        
        if(response.status === 200) {
            await AsyncStorage.removeItem("userToken")
            await AsyncStorage.removeItem("userID")
            this.props.navigation.navigate("LoginScreen")
        }
        else if(response.status === 401) {
            console.log("Unauthorised")
        
      
            await AsyncStorage.removeItem("userToken")
            await AsyncStorage.removeItem("userID")
        }
        else{
            this.props.navigation.navigate("LoginScreen")
            throw "Something went wrong"
        }
    })
        .catch((error) => {
            this.setState({"error": error})
            this.setState({"submitted": false});
        })
    }


        
        
    render(){

        return(
            <View>
                <TouchableOpacity  style={styles.loginbtn} onPress={() => this.logout()}>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Logout</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
        
    }
       
    
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f5f5f5",
      //width: "100%",
      //alignItems: "stretch",
      //justifyContent: "center",
      
      
      padding:16
    },
    header: {
      fontSize:24,
      fontWeight: "Bold",
      MarginBotton: 16,
      color: "#333"
    },
    contact:{
      padding:16,
      marginBottom: 3,
      borderRadius:5,
      backgroundColor: "#fff",
      // shadowColor:"#000",
      // shadowOffset:{
      //   width: 0,
      //   height: 1,
      // },
      // shadowOpacity: 0.25,
      // shadowRadius:3.5,
      elevation: 5
  
    },
    contactName:{
      marginBottom: 10,
      fontSize:18,
      marginBotton: 8,
      color: "#333",
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
  
    