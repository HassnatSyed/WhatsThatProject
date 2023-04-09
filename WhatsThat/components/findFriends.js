import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, FlatList  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {searchAllUsers} from '../api/getRequests/getRequests';

export default class FindFriends extends Component {

    constructor(props){
        super(props);
    
        this.state = {
            searchResults :[],
            isLoading: true,
            search: ""
            
        };
    
        // this._onPressButton = this._onPressButton.bind(this)
    }
    
      componentDidMount() {
          this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
           
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

      findUsers = async () => {
        try {
          const userToken = await AsyncStorage.getItem('userToken');
          const id = await AsyncStorage.getItem('userID');
          console.log(userToken, id);
          // Do something with userToken and id
          //alert("running")
          searchAllUsers(userToken, this.state.search, (searchResults)=>{
            console.log(searchResults);
            this.setState({ searchResults, isLoading: false });
            
        })
        } 
        catch (error) {
          console.log(error);
        }
    };
    
    renderSearchResult(item) {
        return (
            <View style={styles.searchResult}>
                <Text style={styles.userItem}>{item.given_name} {item.family_name}</Text>
                <Text style={styles.userItem}>{item.email}</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => this.handleButtonClick(item)}>
                        <Text style={styles.buttonText}>Button 1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.handleButtonClick(item)}>
                        <Text style={styles.buttonText}>Button 2</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    handleButtonClick(user) {
        console.log('Button clicked for user:', user);
        // do something with the user object
    }


    render(){

        return(
            <View>
                <View style={styles.password}>
                <Text>Search Users:</Text>
                <TextInput
                    style={{height: 40, borderWidth: 1, width: "100%"}}
                    placeholder="Search Users"
                    onChangeText={search => this.setState({search})}
                    defaultValue={this.state.search}
                    
                />

                </View>

                <View>
                    <TouchableOpacity  style={styles.searchButton} onPress={() => this.findUsers()}>
                        <View style={styles.button}>
                            <Text style={styles.searchButtonText}>Search</Text>
                        </View>
                    </TouchableOpacity>
                </View>


                {this.state.searchResults.length > 0 ?
                    <FlatList
                        data={this.state.searchResults}
                        renderItem={({item}) => this.renderSearchResult(item)}
                        keyExtractor={(item, index) => index.toString()}
                    />
                    :
                    <Text>No results found</Text>
                }


            </View>

            
            
        )
        
        
        
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
      marginBottom: 10,
      marginLeft: 16,
     justifyContent: "center",
      marginRight: 16,
    },
    loginbtn:{
  
    },
    signup:{
      justifyContent: "center",
      textDecorationLine: "underline",
      paddingTop: 0,
    },
    button: {
      marginBottom: 5,
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
    },

    
        search: {
            padding: 16,
            marginBottom: 3,
            borderRadius: 5,
            backgroundColor: "#fff",
        },
        searchButton: {
            marginLeft: 16,
            marginBottom: 16,
            marginRight: 16,
            backgroundColor: '#2196F3'
        },
       
       
        searchResult: {
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#ccc'
        },
        searchResultText: {
            fontSize: 16,
            fontWeight: '500'
        },
    
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
        },
        userItem: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 10,
            padding: 10,
            borderRadius: 5,
            backgroundColor: '#fff',
           // width: '100%',
        },
        userName: {
            fontWeight: 'bold',
            fontSize: 18,
            color: '#333',
        },
        buttonContainer: {
            flexDirection: 'row',
        },
        searchButtonText: {
            padding: 5,
            color: '#fff',
            backgroundColor: '#2196F3',
            borderRadius: 5,
           
            textAlign: 'center',
            
            color: 'white',
            fontSize: 16,
            fontWeight: '500',
        },
    
        searchResult: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#ccc',
          },
          userItem: {
            flex: 1,
            fontSize: 16,
            fontWeight: 'bold',
          },
          buttonContainer: {
            flexDirection: 'row',
            alignItems: 'center',
          },
          buttonText: {
            paddingHorizontal: 10,
            paddingVertical: 5,
            backgroundColor: '#ccc',
            borderRadius: 5,
            marginHorizontal: 5,
          },
    
  });