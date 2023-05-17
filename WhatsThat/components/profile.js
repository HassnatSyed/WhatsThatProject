/* eslint-disable linebreak-style */
/* eslint-disable eqeqeq */
/* eslint-disable no-use-before-define */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable no-throw-literal */
/* eslint-disable react/jsx-filename-extension */

import React, { Component } from 'react';
import {
  View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getUserData, getUserImage } from '../api/getRequests/getRequests';
import { logoutAPI } from '../api/postRequests/postRequests';

export default class ProfileScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userData: {},
      imageUri: null,
      // eslint-disable-next-line react/no-unused-state
      submitted: false,
      // eslint-disable-next-line react/no-unused-state
      error: '',
      showModal: false,
      // eslint-disable-next-line react/no-unused-state
      modalMessage: '',
    };
  }

  componentDidMount() {
    // eslint-disable-next-line react/destructuring-assignment, react/prop-types
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getUserPersonalData();
      this.getImage();
      this.checkLoggedIn();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('userToken');
    if (value == null) {
      this.props.navigation.navigate('LoginScreen');
    }
  };

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

  getUserPersonalData = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const id = await AsyncStorage.getItem('userID');
      getUserData(userToken, id, (userInfo) => {
        this.setState({ isLoading: false, userData: userInfo });
        // update newFriends state with the new friend
      }, (error) => {
        if (error.message == '400') {
          this.showModalWithMessage('400: BAD REQUEST');
        } else if (error.message == '404') {
          this.showModalWithMessage('404: Not Found ');
        } else if (error.message == '401') {
          this.showModalWithMessage('401: Login Again ');
        } else if (error.message == '500') {
          this.showModalWithMessage('oops! Something went wrong with server');
        } else {
          this.showModalWithMessage('oops! Something went wrong');
        }
      });
    } catch (error) {
      this.showModalWithMessage('oops! Something went wrong');
    }
  };

  getImage = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const id = await AsyncStorage.getItem('userID');
      getUserImage(userToken, id, (imageUri) => {
        this.setState({ isLoading: false });
        // update newFriends state with the new friend
        this.setState({
          imageUri, // add the new friend to the newFriends array
        // eslint-disable-next-line object-curly-newline
        });
      }, (error) => {
        if (error.message == '400') {
          this.showModalWithMessage('400: BAD REQUEST');
        } else if (error.message == '404') {
          this.showModalWithMessage('404: Not Found ');
        } else if (error.message == '401') {
          this.showModalWithMessage('401: Login Again ');
        } else if (error.message == '500') {
          this.showModalWithMessage('oops! Something went wrong with server');
        } else {
          this.showModalWithMessage('oops! Something went wrong');
        }
      });
    } catch (error) {
      this.showModalWithMessage('oops! Something went wrong');
    }
  };

  logout = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      logoutAPI(userToken, () => {
        this.props.navigation.navigate('LoginScreen');
      }, (error) => {
        if (error.message === '400') {
          this.props.navigation.navigate('LoginScreen');
        } else {
          this.props.navigation.navigate('LoginScreen');
          throw 'Something went wrong';
        }
      });
    } catch (error) {
      // eslint-disable-next-line react/no-unused-state
      this.setState({ error });
      this.showModalWithMessage('oops! Something went wrong');
    }
  };

  render() {
    const { userData, imageUri } = this.state;
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
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
        {imageUri && (
        // eslint-disable-next-line react/destructuring-assignment
        <Image source={{ uri: this.state.imageUri }} style={styles.profileImage} />
        )}
        <Text style={styles.name}>
          {userData.first_name}
          {' '}
          {userData.last_name}
        </Text>
        <Text style={styles.email}>{userData.email}</Text>
        <TouchableOpacity style={styles.editButton} onPress={() => this.props.navigation.navigate('EditProfile')}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
        <View style={styles.bottomButtons}>
          <TouchableOpacity style={styles.bottomButton} onPress={() => this.props.navigation.navigate('BlockedContacts')}>
            <Text style={styles.bottomButtonText}>Blocked Contacts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomButton} onPress={() => this.props.navigation.navigate('CameraSendToServer')}>
            <Text style={styles.bottomButtonText}> Update Picture</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={this.logout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bottomButtons: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  bottomButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  bottomButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
