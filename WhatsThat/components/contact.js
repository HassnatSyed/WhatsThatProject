/* eslint-disable linebreak-style */
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
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, FlatList, Image, ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getBlockedUsers, getUserContacts, getUserImage } from '../api/getRequests/getRequests';
import { addFriend, blockUser } from '../api/postRequests/postRequests';
import { removeFriend, unblockUser } from '../api/deleteRequests/deleteRequest';

export default class ContactScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contactData: [],
      isLoading: true,
      blockList: [],
      newlyBlocked: [],
      imageUri: null,
      newFriends: [],
    };

    this._onPressButton = this._onPressButton.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
      this.retrieveData();
      this.getBlockLists();
      this.setState({ newlyBlocked: [] });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  // eslint-disable-next-line react/sort-comp
  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('userToken');
    if (value == null) {
      this.props.navigation.navigate('LoginScreen');
    }
  };

  retrieveData = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const id = await AsyncStorage.getItem('userID');
      console.log(userToken, id);
      // Do something with userToken and id
      // alert("running")
      getUserContacts(userToken, (contactData) => {
        console.log(contactData);
        this.setState({ contactData, isLoading: false });
      });
    } catch (error) {
      console.log(error);
    }
  };

  getContacts() {
    getUserContacts(userToken, (contactData) => {
      console.log(contactData);
    });
  }

  isBlocked(item) {
    console.log('runrunrunblock');
    return this.state.blockList.some((blockedUser) => blockedUser.user_id === item.user_id);
  }

  isNewlyBlocked = (item) => this.state.newlyBlocked.some((newBlocked) => newBlocked.user_id === item.user_id);

  getBlockLists = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const id = await AsyncStorage.getItem('userID');
      this.currentID = await AsyncStorage.getItem('userID');
      console.log(userToken, id);
      // Do something with userToken and id
      // alert("running")
      getBlockedUsers(userToken, (blockList) => {
        console.log(blockList, 'blocccccccck');
        this.setState({ blockList, isLoading: false });
      });
    } catch (error) {
      console.log(error);
    }
  };

  addToBlockList = async (item) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      // const id = await AsyncStorage.getItem('userID');
      // console.log(userToken, id);
      // Do something with userToken and id
      // alert("running")
      blockUser(userToken, item.user_id, () => {
        console.log(item.user_id, 'the user id');
        this.setState({ isLoading: false });
        // update contactData state with the new friend
        this.setState((prevState) => ({
          // contactData: [...prevState.contactData, item],
          newlyBlocked: [...prevState.newlyBlocked, item], // add the new friend to the newFriends array
        }));
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

  removeFromBlockList = async (item) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      // const id = await AsyncStorage.getItem('userID');
      // console.log(userToken, id);
      // Do something with userToken and id
      // alert("running")
      unblockUser(userToken, item.user_id, () => {
        console.log(item.user_id, 'the user id');
        this.setState({ isLoading: false });
        // update newlyBlocked state by  unblocking user
        this.setState((prevState) => ({
          // contactData: [...prevState.contactData, item],
          newlyBlocked: prevState.newlyBlocked.filter((blockedUser) => blockedUser.user_id !== item.user_id), // remove the item from the newlyBlocked array
        }));
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

  _onPressButton() {
    console.log('direct to chat or user profile');
  }

  getImage = async (item) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      getUserImage(userToken, item.user_id, (imageUri) => {
        // console.log(item.user_id, 'the user id');
        // update the contactData state with the new imageUri for the current contact
        const updatedContactData = this.state.contactData.map((contact) => {
          if (contact.user_id === item.user_id) {
            return { ...contact, imageUri };
          }
          return contact;
        });
        this.setState({ contactData: updatedContactData });
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

  isFriend(item) {
    return this.state.contactData.some((contact) => contact.user_id === item.user_id);
  }

  isNewFriend = (item) => this.state.newFriends.some((friend) => friend.user_id === item.user_id);

  addAsFriend = async (item) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const id = await AsyncStorage.getItem('userID');
      console.log(userToken, id);
      // Do something with userToken and id
      // alert("running")
      addFriend(userToken, item.user_id, () => {
        console.log(item.user_id, 'the user id');
        this.setState({ isLoading: false });
        // update newFriends state with the new friend
        this.setState((prevState) => ({
          // contactData: [...prevState.contactData, item],
          newFriends: [...prevState.newFriends, item], // add the new friend to the newFriends array
        }));
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

  removeFromFriend = async (item) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const id = await AsyncStorage.getItem('userID');
      console.log(userToken, id);
      // Do something with userToken and id
      // alert("running")
      removeFriend(userToken, item.user_id, () => {
        console.log(item.user_id, 'the user id');
        this.setState({ isLoading: false });
        // update newFriends state by  removing friend
        this.setState((prevState) => ({
          // contactData: [...prevState.contactData, item],
          newFriends: prevState.newFriends.filter((friend) => friend.user_id !== item.user_id), // remove the item from the newFriends array
        }));
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

  renderContacts(item) {
    if (item.imageUri == null) {
    // if the imageUri is not available in the state, call getImage function to get the image for the current contact
      this.getImage(item);
    }
    return (
      <View style={styles.searchResult}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.imageUri }} style={styles.contactImage} />
        </View>
        <Text style={styles.userItem}>
          {item.first_name}
          {' '}
          {item.last_name}
        </Text>
        <View style={styles.buttonContainer}>
          <View style={styles.blockContainer}>
            {this.isNewlyBlocked(item) ? (
              <TouchableOpacity onPress={() => this.removeFromBlockList(item)}>
                <Text style={styles.buttonText}>Unblock</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => this.addToBlockList(item)}>
                <Text style={styles.buttonText}>Block</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.friendContainer}>

            <TouchableOpacity onPress={() => this.removeFromFriend(item)}>
              <Text style={styles.buttonText}>Unfriend</Text>
            </TouchableOpacity>

          </View>
        </View>
      </View>
    );
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Contacts</Text>
        </View>
        {this.state.contactData.length > 0 ? (
          <ScrollView>
            <FlatList
              data={this.state.contactData}
              renderItem={({ item }) => this.renderContacts(item)}
              keyExtractor={(item, index) => index.toString()}
            />
          </ScrollView>
        ) : (
          <Text>You have no Contacts</Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    padding: 10,
  },
  imageContainer: {
    marginRight: 10,
  },
  contactImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerContainer: {
    marginBottom: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#43464B',
  },
  searchResult: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userItem: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#43464B',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  blockContainer: {
    backgroundColor: '#ff4d4d',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  friendContainer: {
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  buttonText: {
    color: '#fff',
  },

  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
