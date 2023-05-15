/* eslint-disable linebreak-style */
/* eslint-disable no-use-before-define */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable no-throw-literal */
/* eslint-disable react/jsx-filename-extension */

import React, { Component } from 'react';
import {
  View, Text, Image, TouchableOpacity, StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserImage } from '../api/getRequests/getRequests';
import { logoutAPI } from '../api/postRequests/postRequests';

export default class ProfileScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userData: {},
      imageUri: null,
      submitted: false,
      error: '',
    };
  }

  componentDidMount() {
    // eslint-disable-next-line react/destructuring-assignment, react/prop-types
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getUserData();
      this.getImage();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getUserData = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    const id = await AsyncStorage.getItem('userID');
    const response = await fetch(`http://localhost:3333/api/1.0.0/user/${id}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': userToken,
      },
    });
    const json = await response.json();
    this.setState({ userData: json });
  };

  // getUserImage = async () => {
  //     const userToken = await AsyncStorage.getItem('userToken');
  //     const id = await AsyncStorage.getItem('userID');
  //     const response = await fetch(`http://localhost:3333/api/1.0.0/user/${id}/photo`, {
  //         method: "get",
  //         headers: {
  //             "Content-Type": "image/png",
  //             'X-Authorization': userToken,
  //         }
  //     });
  //     const json = await response.json();
  //     this.setState({ imageUri: json.uri });
  // }
  getImage = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const id = await AsyncStorage.getItem('userID');
      getUserImage(userToken, id, (imageUri) => {
        this.setState({ isLoading: false });
        // update newFriends state with the new friend
        this.setState({ imageUri, // add the new friend to the newFriends array
        });
      }, (error) => {
        console.log(error);
        if (error.message === '400') {
          console.log('error 400');
        } else {
          console.log('try again');
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  logout = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      logoutAPI(userToken, () => {
        this.props.navigation.navigate('LoginScreen');
      }, (error) => {
        if (error.message === '400') {
          console.log('error 400');
          this.props.navigation.navigate('LoginScreen');
        } else {
          this.props.navigation.navigate('LoginScreen');
          throw 'Something went wrong';
        }
      });
    } catch (error) {
      this.setState({ error });
      this.setState({ submitted: false });
    }
  };

  render() {
    const { userData, imageUri } = this.state;
    return (
      <View style={styles.container}>
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
