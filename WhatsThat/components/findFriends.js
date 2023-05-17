/* eslint-disable linebreak-style */
/* eslint-disable react/sort-comp */
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
  View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getBlockedUsers, searchAllUsers, getUserContacts } from '../api/getRequests/getRequests';
import { addFriend } from '../api/postRequests/postRequests';

import { removeFriend } from '../api/deleteRequests/deleteRequest';

export default class FindFriends extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      isLoading: true,
      search: '',
      contactData: [],
      // eslint-disable-next-line react/no-unused-state
      currentID: '',

      newFriends: [],
      blockList: [],
      offset: 0,
      showModal: false,
      // eslint-disable-next-line react/no-unused-state
      modalMessage: '',
      scope: 'all',
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
      this.userContacts();
      this.getBlockLists();
      // this.setState({ firstView: true });
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

  isFriend(item) {
    return this.state.contactData.some((contact) => contact.user_id === item.user_id);
  }

  isNewFriend = (item) => this.state.newFriends.some((friend) => friend.user_id === item.user_id);

  isBlocked(item) {
    return this.state.blockList.some((blockedUser) => blockedUser.user_id === item.user_id);
  }

  findUsers = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      // eslint-disable-next-line no-unused-vars
      const id = await AsyncStorage.getItem('userID');
      searchAllUsers(userToken, this.state.search, this.state.scope, 12, this.state.offset, (searchResults) => {
        this.setState((prevState) => ({
          searchResults: [...prevState.searchResults, ...searchResults],
          isLoading: false,
        }));
      }, (error) => {
        if (error.message == '400') {
          this.showModalWithMessage('400: Bad request');
        } else if (error.message == '401') {
          this.showModalWithMessage('401: Login Again ');
        } else if (error.message == '404') {
          this.showModalWithMessage('404: Not Found ');
        } else if (error.message == '403') {
          this.showModalWithMessage('403: Forbidden: You do not have access ');
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

  fetchMoreUsers = async () => {
    const limit = 12;
    const userToken = await AsyncStorage.getItem('userToken');
    this.setState((prevState) => ({ offset: prevState.offset + limit }), () => {
      searchAllUsers(userToken, this.state.search, this.state.scope, limit, this.state.offset, (newResults) => {
        this.setState((prevState) => ({ searchResults: [...prevState.searchResults, ...newResults] }));
      });
    });
  };

  addAsFriend = async (item) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      // eslint-disable-next-line no-unused-vars
      const id = await AsyncStorage.getItem('userID');
      addFriend(userToken, item.user_id, () => {
        this.setState({ isLoading: false });
        // update newFriends state with the new friend
        this.setState((prevState) => ({
          // contactData: [...prevState.contactData, item],
          newFriends: [...prevState.newFriends, item], // add the new friend to the newFriends array
        }));
      }, (error) => {
        if (error.message == '400') {
          this.showModalWithMessage('400: You can add yourself friend - BAD REQUEST');
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

  removeFromFriend = async (item) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      // eslint-disable-next-line no-unused-vars
      const id = await AsyncStorage.getItem('userID');
      removeFriend(userToken, item.user_id, () => {
        this.setState({ isLoading: false });
        // update newFriends state by  removing friend
        this.setState((prevState) => ({
          newFriends: prevState.newFriends.filter((friend) => friend.user_id !== item.user_id), // remove the item from the newFriends array
        }));
      }, (error) => {
        if (error.message == '400') {
          this.showModalWithMessage('400: You can not unfriend yourself, Bad request');
        } else if (error.message == '404') {
          this.showModalWithMessage('404: Not Found ');
        } else if (error.message == '403') {
          this.showModalWithMessage('403: Forbidden ');
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

  // getting the current contact list
  userContacts = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      // eslint-disable-next-line no-unused-vars
      const id = await AsyncStorage.getItem('userID');
      this.currentID = await AsyncStorage.getItem('userID');
      // Do something with userToken and id
      // alert("running")
      getUserContacts(userToken, (contactData) => {
        this.setState({ contactData, isLoading: false });
      }, (error) => {
        if (error.message == '400') {
          this.showModalWithMessage('400: Bad request');
        } else if (error.message == '401') {
          this.showModalWithMessage('401: Login Again ');
        } else if (error.message == '403') {
          this.showModalWithMessage('403: You do not have access ');
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

  // getting the current block list
  getBlockLists = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      // eslint-disable-next-line no-unused-vars
      const id = await AsyncStorage.getItem('userID');
      this.currentID = await AsyncStorage.getItem('userID');
      getBlockedUsers(userToken, (blockList) => {
        this.setState({ blockList, isLoading: false });
      }, (error) => {
        if (error.message == '400') {
          this.showModalWithMessage('400: Bad request');
        } else if (error.message == '401') {
          this.showModalWithMessage('401: Login Again ');
        } else if (error.message == '403') {
          this.showModalWithMessage('403: You do not have access ');
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

  renderSearchResult(item) {
    if (this.isFriend(item) || this.currentID == item.user_id || this.isBlocked(item)) {
      return null; // Do not render the search result
    }
    return (
      <View style={styles.searchResult}>
        <Text style={styles.userItem}>
          {item.given_name}
          {' '}
          {item.family_name}
        </Text>
        <View style={this.isNewFriend(item) ? styles.unfriendButton : styles.buttonContainer}>
          {this.isNewFriend(item) ? (
            <TouchableOpacity onPress={() => this.removeFromFriend(item)}>
              <Text style={styles.buttonText}> Unfriend</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => this.addAsFriend(item)}>
              <Text style={styles.buttonText}>Add Friend</Text>
            </TouchableOpacity>
          )}

        </View>
      </View>
    );
  }

  render() {
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
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Find Friends</Text>
        </View>
        <View style={styles.password}>
          <Text>Search Users:</Text>
          <TextInput
            style={{
              height: 40, borderWidth: 1, width: '100%', backgroundColor: '#fff',
            }}
            placeholder=" Search Users"
            onChangeText={(search) => this.setState({ search })}
            defaultValue={this.state.search}
          />

        </View>

        <View>
          <TouchableOpacity style={styles.searchButton} onPress={() => this.findUsers()}>
            <View style={styles.button}>
              <Text style={styles.searchButtonText}>Search</Text>
            </View>
          </TouchableOpacity>
        </View>

        {this.state.searchResults.length > 0
          ? (
            <FlatList
              data={this.state.searchResults}
              renderItem={({ item }) => this.renderSearchResult(item)}
              keyExtractor={(item, index) => index.toString()}
              onEndReached={this.fetchMoreUsers}
              onEndReachedThreshold={0.5}
            />
          )
          : <Text>No results found</Text>}

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
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  unfriendButton: {
    backgroundColor: '#ff4d4d',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  buttonContainerRemoveFriend: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  searchButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  searchButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  noResultsText: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 18,
    color: '#666666',
  },
});
