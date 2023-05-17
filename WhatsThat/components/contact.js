/* eslint-disable linebreak-style */
/* eslint-disable react/no-access-state-in-setstate */
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
  View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, Image, ScrollView, Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getBlockedUsers, getUserContacts, getUserImage } from '../api/getRequests/getRequests';
import { blockUser } from '../api/postRequests/postRequests';
import { removeFriend, unblockUser } from '../api/deleteRequests/deleteRequest';

export default class ContactScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contactData: [],
      isLoading: true,
      // eslint-disable-next-line react/no-unused-state
      blockList: [],
      newlyBlocked: [],
      // eslint-disable-next-line react/no-unused-state
      imageUri: null,
      showModal: false,
      // eslint-disable-next-line react/no-unused-state
      modalMessage: '',
    };

    // this.onPressButton = this.onPressButton.bind(this);
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

      // Do something with userToken and id
      // alert("running")
      getUserContacts(userToken, (contactData) => {
        this.setState({ contactData, isLoading: false });
      }, (error) => {
        if (error.message == '400') {
          this.showModalWithMessage('400: You can not block yourself');
        } else if (error.message == '404') {
          this.showModalWithMessage('404: Not Found ');
        } else if (error.message == '403') {
          this.showModalWithMessage('403: You do not have access ');
        } else if (error.message == '401') {
          this.showModalWithMessage('401: Login Again ');
        } else {
          this.showModalWithMessage('oops! Something went wrong');
        }
      });
    } catch (error) {
      this.showModalWithMessage('oops! Something went wrong');
    }
  };

  isNewlyBlocked = (item) => this.state.newlyBlocked.some((newBlocked) => newBlocked.user_id === item.user_id);

  getBlockLists = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');

      getBlockedUsers(userToken, (blockList) => {
        // eslint-disable-next-line react/no-unused-state
        this.setState({ blockList, isLoading: false });
      }, (error) => {
        if (error.message == '400') {
          this.showModalWithMessage('400: You can not block yourself');
        } else if (error.message == '404') {
          this.showModalWithMessage('404: Not Found ');
        } else if (error.message == '403') {
          this.showModalWithMessage('403: You do not have access ');
        } else if (error.message === '401') {
          this.showModalWithMessage('401: Login Again ');
        } else {
          this.showModalWithMessage('oops! Something went wrong');
        }
      });
    } catch (error) {
      this.showModalWithMessage('oops! Something went wrong');
    }
  };

  addToBlockList = async (item) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');

      blockUser(userToken, item.user_id, () => {
        this.setState({ isLoading: false });

        this.setState((prevState) => ({

          newlyBlocked: [...prevState.newlyBlocked, item],
        }));
      }, (error) => {
        if (error.message == '400') {
          this.showModalWithMessage('400: You can not block yourself');
        } else if (error.message == '404') {
          this.showModalWithMessage('404: Not Found ');
        } else if (error.message == '403') {
          this.showModalWithMessage('403: You do not have access ');
        } else if (error.message == '401') {
          this.showModalWithMessage('401: Login Again ');
        } else {
          this.showModalWithMessage('oops! Something went wrong');
        }
      });
    } catch (error) {
      this.showModalWithMessage('oops! Something went wrong');
    }
  };

  removeFromBlockList = async (item) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');

      unblockUser(userToken, item.user_id, () => {
        this.setState({ isLoading: false });
        // update newlyBlocked state by  unblocking user
        this.setState((prevState) => ({

          newlyBlocked: prevState.newlyBlocked.filter((blockedUser) => blockedUser.user_id !== item.user_id), // remove the item from the newlyBlocked array
        }));
      }, (error) => {
        if (error.message == '400') {
          this.showModalWithMessage('400: You can not block yourself ');
        } else if (error.message == '404') {
          this.showModalWithMessage('404: Not Found ');
        } else if (error.message == '403') {
          this.showModalWithMessage('403: You do not have access ');
        } else if (error.message == '401') {
          this.showModalWithMessage('401: Login Again ');
        } else if (error.message == '500') {
          this.showModalWithMessage('500: oops! Something went wrong');
        }
      });
    } catch (error) {
      this.showModalWithMessage('oops! Something went wrong');
    }
  };

  getImage = async (item) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      getUserImage(userToken, item.user_id, (imageUri) => {
        // update the contactData state with the new imageUri for the current contact
        const updatedContactData = this.state.contactData.map((contact) => {
          if (contact.user_id === item.user_id) {
            return { ...contact, imageUri };
          }
          return contact;
        });
        this.setState({ contactData: updatedContactData });
      }, (error) => {
        if (error.message == '404') {
          this.showModalWithMessage('404: Not Found ');
        } else if (error.message == '401') {
          this.showModalWithMessage('401: Login Again ');
        } else if (error.message == '403') {
          this.showModalWithMessage('403: You do not have access ');
        } else if (error.message == '400') {
          this.showModalWithMessage('404: Bad Request ');
        } else if (error.message == '500') {
          this.showModalWithMessage('500: oops! Something went wrong');
        }
      });
    } catch (error) {
      this.showModalWithMessage('oops! Something went wrong');
    }
  };

  removeFromFriend = async (item) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      removeFriend(userToken, item.user_id, () => {
        this.setState({ isLoading: false });
        this.retrieveData();
      }, (error) => {
        if (error.message == '400') {
          this.showModalWithMessage('400: You can not block yourself ');
        } else if (error.message == '404') {
          this.showModalWithMessage('404: Not Found ');
        } else if (error.message == '401') {
          this.showModalWithMessage('401: Login Again ');
        } else if (error.message == '403') {
          this.showModalWithMessage('403: You do not have access ');
        } else if (error.message == '500') {
          this.showModalWithMessage('500: oops! Something went wrong');
        }
      });
    } catch (error) {
      this.showModalWithMessage('oops! Something went wrong');
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
  // buttonText: {
  //   color: '#fff',
  // },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
