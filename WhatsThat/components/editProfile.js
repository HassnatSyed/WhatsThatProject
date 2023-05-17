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
      showModal: false,
      // eslint-disable-next-line react/no-unused-state
      modalMessage: '',

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
      }
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

  updateDetails = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const id = await AsyncStorage.getItem('userID');
      patchUserDetails(this.state.firstname, this.state.lastname, this.state.email, this.state.password, userToken, id, () => {
        this.showModalWithMessage('Details updated. Taking you back...');
        setTimeout(() => {
          this.props.navigation.navigate('UserProfile');
        }, 2000);
      }, (error) => {
        if (error.message == '400') {
          this.showModalWithMessage('400, Error updating Details');
        } else if (error.message == '403') {
          this.showModalWithMessage('403: You do not have access ');
        } else if (error.message == '401') {
          this.showModalWithMessage('401: Login Again ');
        } else {
          this.showModalWithMessage('Something went wrong, try later!');
        }
      });
    } catch (error) {
      this.showModalWithMessage('Something Unexpected occured, try later!');
    }
  };

  signupPorcess() {
    this.onPressButton();
    this.updateDetails();
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
