import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as EmailValidator from 'email-validator';
import { loginAPI } from '../api/postRequests/postRequests';


// 

export default class LoginScreen extends Component {

    constructor(props){
        super(props);

        this.state = {
            email: "",
            password: "",
            error: "", 
            submitted: false
        };

         this._onPressButton = this._onPressButton.bind(this)
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
      if(value != null){
        this.props.navigation.navigate("HomeScreen")
      }
    }

    login = () => {
        loginAPI(this.state.email, this.state.password, ()=>{
            console.log("navigate to homescreen");
            this.props.navigation.navigate("HomeScreen");
        },(error)=> {
            console.log(error);
            if (error.message == "400"){
                console.log("error 400")
            }
            else {
                console.log("try again")
            }
        })
    }

    /*login = () => {
        // Validation here...
        let toSend = {
            email: this.state.email,
            password: this.state.password
        };
        
        fetch("http://localhost:3333/api/1.0.0/login", {
            method: "post",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(toSend),
        })
        .then((response) => {
            if (response.status === 200) {
            console.log("User logged in: ", response);
            alert("Login successful!");
            // Save user token or other relevant data
            // Navigate to dashboard or home screen
            } else {
            console.log("Login failed: ", response);
            alert("Invalid email or password");
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }*/

    // async componentDidMount() {
    //     try {
    //       const response = await fetch("http://localhost:3333/api/1.0.0/user", {
    //         method: "get",
    //         headers: {
    //           "Content-Type": "application/json",
    //           Authorization: `Bearer ${token}`, // Include user token in headers for authentication
    //         },
    //       });
    //       const data = await response.json();
    //       console.log("User data retrieved: ", data);
    //       // Set user data in state or do other operations with it
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   }


    _onPressButton(){
        this.setState({submitted: true})
        this.setState({error: ""})

        if(!(this.state.email && this.state.password)){
            this.setState({error: "Must enter email and password"})
            return;
        }

        if(!EmailValidator.validate(this.state.email)){
            this.setState({error: "Must enter valid email"})
            return;
        }

        const PASSWORD_REGEX = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")
        if(!PASSWORD_REGEX.test(this.state.password)){
            this.setState({error: "Password isn't strong enough (One upper, one lower, one special, one number, at least 8 characters long)"})
            return;
        }


        console.log("Button clicked: " + this.state.email + " " + this.state.password)
        console.log("Validated and ready to send to the API")

    }

    loginProcess(){
        this._onPressButton()
        this.login();
            //this.props.navigation.navigate('ChatScreen');
        
    }
    

    render(){
        const navigation = this.props.navigation;
        return (
            <View style={styles.container}>

                <View style={styles.formContainer}>
                    <View style={styles.email}>
                        <Text>Email:</Text>
                        <TextInput
                            style={{height: 40, borderWidth: 1, width: "100%"}}
                            placeholder="Enter email"
                            onChangeText={email => this.setState({email})}
                            defaultValue={this.state.email}
                        />

                        <>
                            {this.state.submitted && !this.state.email &&
                                <Text style={styles.error}>*Email is required</Text>
                            }
                        </>
                    </View>
            
                    <View style={styles.password}>
                        <Text>Password:</Text>
                        <TextInput
                            style={{height: 40, borderWidth: 1, width: "100%"}}
                            placeholder="Enter password"
                            onChangeText={password => this.setState({password})}
                            defaultValue={this.state.password}
                            secureTextEntry
                        />

                        <>
                            {this.state.submitted && !this.state.password &&
                                <Text style={styles.error}>*Password is required</Text>
                            }
                        </>
                    </View>
            
                    <View>
                        <TouchableOpacity  style={styles.loginbtn} onPress={() => this.loginProcess()}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>Login</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <>
                        {this.state.error &&
                            <Text style={styles.error}>{this.state.error}</Text>
                        }
                    </>
            
                    <View  >
                        <TouchableOpacity 
                        onPress={() => this.props.navigation.navigate('SignupScreen')}>
                            
                        <Text style={styles.signup}>Need an account?</Text>
                        
                        </TouchableOpacity>
                    </View>
                    
                </View>
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