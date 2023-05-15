/* eslint-disable react/sort-comp */
/* eslint-disable eqeqeq */
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
  View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
      currentID: '',
      firstView: true,
      newFriends: [],
      blockList: [],
      newlyBlocked: [],
    };

    // this._onPressButton = this._onPressButton.bind(this)
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
      this.userContacts();
      this.getBlockLists();
      this.setState({ firstView: true });
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

  //   isNotSelf = async(item) => {
  //     try {
  //     const id = await AsyncStorage.getItem('userID');
  //     if(id!=item.user_id)

  //     }
  //     catch(error){}
  //   }
  isFriend(item) {
    return this.state.contactData.some((contact) => contact.user_id === item.user_id);
  }

  isNewFriend = (item) => this.state.newFriends.some((friend) => friend.user_id === item.user_id);

  isBlocked(item) {
    console.log('runrunrunblock');
    return this.state.blockList.some((blockedUser) => blockedUser.user_id === item.user_id);
  }

  // isNewlyBlocked = (item) => this.state.newlyBlocked.some((newBlocked) => newBlocked.user_id === item.user_id);

  findUsers = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const id = await AsyncStorage.getItem('userID');
      console.log(userToken, id);
      // Do something with userToken and id
      // alert("running")
      searchAllUsers(userToken, this.state.search, (searchResults) => {
        console.log(searchResults);
        this.setState({ searchResults, isLoading: false });
      });
    } catch (error) {
      console.log(error);
    }
  };

  // renderSearchResult(item) {

  //     if (this.isFriend(item) || this.currentID == item.user_id ) {
  //         console.log(item),"testing";
  //         return null; // Do not render the search result

  //     }
  //     return (
  //         <View style={styles.searchResult}>
  //             <Text style={styles.userItem}>{item.given_name} {item.family_name}</Text>
  //             {/* <Text style={styles.userItem}>{item.email}</Text> */}
  //             <View style={styles.buttonContainer}>
  //                 <TouchableOpacity onPress={() => this.addAsFriend(item)}>
  //                     <Text style={styles.buttonText}>Add Friend</Text>
  //                 </TouchableOpacity>
  //                 <TouchableOpacity onPress={() => this.handleButtonClick(item)}>
  //                     <Text style={styles.buttonText}>Button 2</Text>
  //                 </TouchableOpacity>
  //             </View>
  //         </View>
  //     );
  // }

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

  // getting the current contact list
  userContacts = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const id = await AsyncStorage.getItem('userID');
      this.currentID = await AsyncStorage.getItem('userID');
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

  // getting the current block list
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

  // addToBlockList = async (item) => {
  //   try {
  //     const userToken = await AsyncStorage.getItem('userToken');
  //     const id = await AsyncStorage.getItem('userID');
  //     console.log(userToken, id);
  //     // Do something with userToken and id
  //     // alert("running")
  //     blockUser(userToken, item.user_id, () => {
  //       console.log(item.user_id, 'the user id');
  //       this.setState({ isLoading: false });
  //       // update contactData state with the new friend
  //       this.setState((prevState) => ({
  //         // contactData: [...prevState.contactData, item],
  //         newlyBlocked: [...prevState.newlyBlocked, item], // add the new friend to the newFriends array
  //       }));
  //     }, (error) => {
  //       console.log(error);
  //       if (error.message == '400') {
  //         console.log('error 400');
  //       } else {
  //         console.log('try again');
  //       }
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // removeFromBlockList = async (item) => {
  //   try {
  //     const userToken = await AsyncStorage.getItem('userToken');
  //     const id = await AsyncStorage.getItem('userID');
  //     console.log(userToken, id);
  //     // Do something with userToken and id
  //     // alert("running")
  //     unblockUser(userToken, item.user_id, () => {
  //       console.log(item.user_id, 'the user id');
  //       this.setState({ isLoading: false });
  //       // update newlyBlocked state by  unblocking user
  //       this.setState((prevState) => ({
  //         // contactData: [...prevState.contactData, item],
  //         newlyBlocked: prevState.newlyBlocked.filter((blockedUser) => blockedUser.user_id !== item.user_id), // remove the item from the newFriends array
  //       }));
  //     }, (error) => {
  //       console.log(error);
  //       if (error.message == '400') {
  //         console.log('error 400');
  //       } else {
  //         console.log('try again');
  //       }
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  renderSearchResult(item) {
    // if (this.currentID === item.user_id && !firstView ) {
    //     return null; // Do not render the search result
    // }
    // else
    if (this.isFriend(item) || this.currentID == item.user_id || this.isBlocked(item)) {
      console.log(item), 'testing';
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
  // headerContainer: {
  //   backgroundColor: '#4CAF50',
  //   paddingHorizontal: 20,
  //   paddingVertical: 10,
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  // },
  // header: {
  //   fontSize: 26,
  //   fontWeight: 'bold',
  //   color: '#FFFFFF',
  // },
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
