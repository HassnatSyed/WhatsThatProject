/* eslint-disable linebreak-style */
/* eslint-disable prefer-regex-literals */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable eqeqeq */
/* eslint-disable max-len */
/* eslint-disable no-sequences */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-use-before-define */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable no-throw-literal */
/* eslint-disable react/jsx-filename-extension */
import React, { Component } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as EmailValidator from 'email-validator';
import { patchUserDetails } from '../api/patchRequests/patchRequests';

export default class EditProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      // confirmPassword: "",
      error: '',
      firstname: '',
      lastname: '',

    };

    this.onPressButton = this.onPressButton.bind(this);
  }

  //   componentDidMount() {
  //     this.getData();
  //   }

  onPressButton() {
    this.setState({ error: '' });

    // if(!(this.state.email && this.state.password)){
    //     this.setState({error: "Must enter email and password"})
    //     return;
    // }
    if (this.state.email != '') {
      if (!EmailValidator.validate(this.state.email)) {
        this.setState({ error: 'Must enter valid email' });
        return;
      }
    }

    const PASSWORD_REGEX = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$');
    if (this.state.password != '') {
      if (!PASSWORD_REGEX.test(this.state.password)) {
        this.setState({ error: "Password isn't strong enough (One upper, one lower, one special, one number, at least 8 characters long)" });
        return;
      }
    }

    // if(!PASSWORD_REGEX.test(this.state.confirmPassword)){
    //     this.setState({error: "Password isn't strong enough (One upper, one lower, one special, one number, at least 8 characters long)"})
    //     return;
    // }

    // if(confirmPassword != password){
    //     this.setState({error: "Password do not match"})
    //     return;
    // }

    console.log(`Button clicked: ${this.state.email} ${this.state.password}`);
    console.log('Validated and ready to send to the API');
  }

  updateDetails = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      console.log(userToken, 'from edit profile');
      const id = await AsyncStorage.getItem('userID');
      patchUserDetails(this.state.firstname, this.state.lastname, this.state.email, this.state.password, userToken, id, () => {
        console.log('navigate to profile');
        this.props.navigation.navigate('UserProfile');
      }, (error) => {
        console.log(error);
        if (error.message == '400') {
          console.log('error 400');
        } else {
          console.log('try again');
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  signupPorcess() {
    this.onPressButton();
    this.updateDetails();

    // this.signup();
  }

  render() {
    return (

      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Update Your Details</Text>
          </View>

        </View>
        <View style={styles.formContainer}>
          <View style={styles.email}>
            <Text>Email:</Text>
            <TextInput
              style={{ height: 40, borderWidth: 1, width: '100%' }}
              placeholder="Enter email"
              onChangeText={(email) => this.setState({ email })}
              defaultValue={this.state.email}
            />

          </View>

          <View style={styles.password}>
            <Text>Password:</Text>
            <TextInput
              style={{ height: 40, borderWidth: 1, width: '100%' }}
              placeholder="Enter password"
              onChangeText={(password) => this.setState({ password })}
              defaultValue={this.state.password}
              secureTextEntry
            />

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

          <View style={styles.password}>
            <Text>Firstname</Text>
            <TextInput
              style={{ height: 40, borderWidth: 1, width: '100%' }}
              placeholder="Enter First Name"
              onChangeText={(firstname) => this.setState({ firstname })}
              defaultValue={this.state.firstname}
            />

          </View>

          <View style={styles.password}>
            <Text>Lastname</Text>
            <TextInput
              style={{ height: 40, borderWidth: 1, width: '100%' }}
              placeholder="Enter Lastname"
              onChangeText={(lastname) => this.setState({ lastname })}
              defaultValue={this.state.lastname}
            />

          </View>

          <View style={styles.registerText}>
            <TouchableOpacity onPress={() => this.signupPorcess()}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Update Details</Text>
              </View>
            </TouchableOpacity>
          </View>

          <>
            {this.state.error
                            && <Text style={styles.error}>{this.state.error}</Text>}
          </>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('UserProfile')} style={styles.button}>
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // width: "100%",
    // alignItems: "stretch",
    // justifyContent: "center",
    padding: '10%',
  },
  formContainer: {

  },
  headerContainer: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginBottom: 10,
  },
  header: {
    flex: 1,

    alignItems: 'center',
  },
  headerText: {

    fontSize: 26,
    fontWeight: 'bold',
    color: '#43464B',

  },
  email: {
    marginBottom: 5,
  },
  password: {
    marginBottom: 5,
  },
  registerText: {

  },
  signup: {
    justifyContent: 'center',
    textDecorationLine: 'underline',
  },
  button: {
    // marginBottom: 30,
    marginTop: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
    padding: 10,
  },
  buttonText: {
    textAlign: 'center',
    padding: 5,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  error: {
    color: 'red',
    fontWeight: '900',
  },
});
