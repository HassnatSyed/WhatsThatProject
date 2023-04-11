import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

import * as EmailValidator from 'email-validator';
import { signUpAPI } from '../api/postRequests/postRequests';

export default class SignupScreen extends Component {

    constructor(props){
        super(props);

        this.state = {
            email: "",
            password: "",
            //confirmPassword: "",
            error: "", 
            submitted: false,
            firstname: "",
            lastname: "",
            
        }

        this._onPressButton = this._onPressButton.bind(this)
    }

     signup = () => {
        signUpAPI(this.state.firstname,this.state.lastname,this.state.email, this.state.password, ()=>{
            console.log("navigate to homescreen");
            this.props.navigation.navigate("LoginScreen");
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
//     signup = () =>{
//   // Validation here...
//     let toSend = {
//         first_name: this.state.firstname,
//         last_name: this.state.lastname,
//         email: this.state.email,
//         password: this.state.password
       
//     };

//     fetch("http://localhost:3333/api/1.0.0/user", {
//       method: "post",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(toSend),
//     })
     
//       .then((response) => {
//         console.log("User created with ID: ", response);
//        // this.getData();
//         alert("User added!");
//         this.props.navigation.navigate("LoginScreen");
//       })
//       .catch((error) => {
//         console.log(error);
//       });}


  

//   componentDidMount() {
//     this.getData();
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
        
        // if(!PASSWORD_REGEX.test(this.state.confirmPassword)){
        //     this.setState({error: "Password isn't strong enough (One upper, one lower, one special, one number, at least 8 characters long)"})
        //     return;
        // }
        
        // if(confirmPassword != password){
        //     this.setState({error: "Password do not match"})
        //     return;
        // }


        console.log("Button clicked: " + this.state.email + " " + this.state.password)
        console.log("Validated and ready to send to the API")

    }

    signupPorcess(){
        this._onPressButton();
        this.signup();
        
        
    }
    render(){
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

                    {/* <View style = {styles.password}>
                        <Text>Confirm Password</Text>
                        <TextInput
                            style={{height: 40, borderWidth: 1, width: "100%"}}
                            placeholder="Confirm password"
                            onChangeText={confirmPassword => this.setState({confirmPassword})}
                            defaultValue={this.state.confirmPassword}
                            secureTextEntry
                        />

                        <>
                            {this.state.submitted && !this.state.password &&
                                <Text style={styles.error}>*Password confirmation is required</Text>
                            }
                        </>
                    </View> */}

                    <View style = {styles.password}>
                        <Text>Firstname</Text>
                        <TextInput
                            style={{height: 40, borderWidth: 1, width: "100%"}}
                            placeholder="Enter First Name"
                            onChangeText={firstname => this.setState({firstname})}
                            defaultValue={this.state.firstname}
                            
                        />

                        <>
                            {this.state.submitted && !this.state.firstname &&
                                <Text style={styles.error}>Firstname is required</Text>
                            }
                        </>
                    </View>

                    <View style = {styles.password}>
                        <Text>Lastname</Text>
                        <TextInput
                            style={{height: 40, borderWidth: 1, width: "100%"}}
                            placeholder="Enter Lastname"
                            onChangeText={lastname => this.setState({lastname})}
                            defaultValue={this.state.lastname}
                            
                        />

                        <>
                            {this.state.submitted && !this.state.lastname &&
                                <Text style={styles.error}>Lastname is required</Text>
                            }
                        </>
                    </View>

                    <View style={styles.registerText}>
                        <TouchableOpacity onPress={() => this.signupPorcess()}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>Register</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <>
                        {this.state.error &&
                            <Text style={styles.error}>{this.state.error}</Text>
                        }
                    </>
            
                    
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
      padding: "10%"
    },
    formContainer: {
  
    },
    email:{
      marginBottom: 5
    },
    password:{
      marginBottom: 5
    },
    registerText:{
  
    },
    signup:{
      justifyContent: "center",
      textDecorationLine: "underline"
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

