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
  View, Text, TextInput, TouchableOpacity, StyleSheet, Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as EmailValidator from 'email-validator';
import { loginAPI } from '../api/postRequests/postRequests';

//

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      error: '',
      submitted: false,
      showModal: false,
      // eslint-disable-next-line react/no-unused-state
      modalMessage: '',
    };

    this.onPressButton = this.onPressButton.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onPressButton() {
    this.setState({ submitted: true });
    this.setState({ error: '' });

    if (!(this.state.email && this.state.password)) {
      this.setState({ error: 'Must enter email and password' });
      return;
    }

    if (!EmailValidator.validate(this.state.email)) {
      this.setState({ error: 'Must enter valid email' });
      return;
    }

    const PASSWORD_REGEX = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$');
    if (!PASSWORD_REGEX.test(this.state.password)) {
      this.setState({ error: "Password isn't strong enough (One upper, one lower, one special, one number, at least 8 characters long)" });
    }
  }

  toggleModal = () => {
    this.setState((prevState) => ({
      showModal: !prevState.showModal,
    }));
  };

  onModalDismiss = () => {
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      modalMessage: '',
    });
  };

  showModalWithMessage = (message) => {
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      modalMessage: message,
      showModal: true,
    });

    setTimeout(() => {
      this.onModalDismiss();
      this.toggleModal();
    }, 3000);
  };

  login = () => {
    loginAPI(this.state.email, this.state.password, () => {
      this.props.navigation.navigate('HomeScreen');
    }, (error) => {
      if (error.message == '400') {
        this.showModalWithMessage('Invalid password or Email');
      } else {
        this.showModalWithMessage('Server Error');
      }
    });
  };

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('userToken');
    if (value != null) {
      this.props.navigation.navigate('HomeScreen');
    }
  };

  loginProcess() {
    this.onPressButton();
    this.login();
    // this.props.navigation.navigate('ChatScreen');
  }

  render() {
    return (
      <View style={styles.container}>

        <Modal visible={this.state.showModal} animationType="slide" onDismiss={this.onModalDismiss} transparent>
          <View style={{
            flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
          >
            <View style={{
              backgroundColor: '#FFFFFF', padding: 20, borderRadius: 8, alignItems: 'center',
            }}
            >
              <Text style={{ textAlign: 'center', fontSize: 14 }}>{this.state.modalMessage}</Text>
              <TouchableOpacity
                onPress={this.toggleModal}
                style={{
                  backgroundColor: '#F44336', padding: 10, marginTop: 10, borderRadius: 5,
                }}
              >
                <Icon name="close" size={16} color="#FFFFFF" style={{ fontWeight: 'bold' }} />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View style={styles.formContainer}>

          <Text style={styles.loginTitle}>Hi! Login To Your Account</Text>

          <View style={styles.email}>
            <Text>Email:</Text>
            <TextInput
              style={{ height: 40, borderWidth: 1, width: '100%' }}
              placeholder="Enter email"
              onChangeText={(email) => this.setState({ email })}
              defaultValue={this.state.email}
            />

            <>
              {this.state.submitted && !this.state.email
                                && <Text style={styles.error}>*Email is required</Text>}
            </>
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

            <>
              {this.state.submitted && !this.state.password
                                && <Text style={styles.error}>*Password is required</Text>}
            </>
          </View>

          <View>
            <TouchableOpacity style={styles.loginbtn} onPress={() => this.loginProcess()}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Login</Text>
              </View>
            </TouchableOpacity>
          </View>

          <>
            {this.state.error
                            && <Text style={styles.error}>{this.state.error}</Text>}
          </>

          <View>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('SignupScreen')}
            >

              <Text style={styles.signup}>Need an account? click here</Text>

            </TouchableOpacity>
          </View>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'stretch',
    justifyContent: 'center',

    padding: '10%',
  },
  formContainer: {

  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  email: {
    marginBottom: 5,
  },
  password: {
    marginBottom: 10,
  },
  loginbtn: {

  },
  signup: {
    justifyContent: 'center',
    textDecorationLine: 'underline',
    paddingTop: 0,
    fontSize: 14,
    fontWeight: 'bold',
  },
  button: {
    marginBottom: 15,
    backgroundColor: '#2196F3',
    borderRadius: 10,
  },
  buttonText: {
    textAlign: 'center',
    padding: 20,
    color: 'white',
  },
  error: {
    color: 'red',
    fontWeight: '900',
  },
});
