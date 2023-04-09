import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getUserContacts} from '../api/getRequests/getRequests';


export default class ContactScreen extends Component {

  constructor(props){
    super(props);

    this.state = {
        chatData :[],
        isLoading: true
        
    };

     this._onPressButton = this._onPressButton.bind(this)
}

  componentDidMount() {
      this.unsubscribe = this.props.navigation.addListener('focus', () => {
        this.checkLoggedIn();
        this.retrieveData();
      })
  }
    
  componentWillUnmount(){
    this.unsubscribe()
  }
  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem("userToken")
    if(value == null){
      this.props.navigation.navigate("LoginScreen")
    }
  }

  retrieveData = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const id = await AsyncStorage.getItem('userID');
        console.log(userToken, id);
        // Do something with userToken and id
        //alert("running")
        getUserContacts(userToken, (chatData)=>{
          console.log(chatData);
          this.setState({ chatData, isLoading: false });
          
      })
      } 
      catch (error) {
        console.log(error);
      }
  };

  getContacts(){
      getUserContacts(userToken, (chatData)=>{
        console.log(chatData);

      })
  }

  

  _onPressButton(){
    console.log("direct to chat or user profile")
  }
  render(){
      
    if( this.state.isLoading){
      <View >
        <ActivityIndicator />
        
      </View>

    }

    const Contacts = this.state.chatData.map((chat,index) => {
      return( 
        
        <TouchableOpacity key = {index} onPress = {this._onPressButton} style={styles.contact}>
            <Text style = {styles.contactName}>{chat.first_name} {chat.last_name}</Text>
        </TouchableOpacity>)
    })
    return(
      <View style={styles.container}> 
        <Text style = {styles.header}>Contacts</Text>
        {Contacts}
      </View>
    );
      

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

  