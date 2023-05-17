/* eslint-disable linebreak-style */
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
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, FlatList, ActivityIndicator, Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { patchChatDetails } from '../api/patchRequests/patchRequests';
import { getChatData, getUserContacts, searchAllUsersChat } from '../api/getRequests/getRequests';
import { addMember } from '../api/postRequests/postRequests';
import { removeMember } from '../api/deleteRequests/deleteRequest';

export default class ChatInfoScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatID: this.props.route.params.chat_id,
      chat: [],
      isLoading: true,
      newName: '',
      searchResults: [],
      search: '',
      contactData: [],
      showModal: false,
      // eslint-disable-next-line react/no-unused-state
      modalMessage: '',
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();

      this.getChatDetails();
      this.getContacts();
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

  getChatDetails = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    // eslint-disable-next-line no-unused-vars
    const id = await AsyncStorage.getItem('userID');

    getChatData(userToken, this.state.chatID, (chat) => {
      this.setState({ chat, isLoading: false });
    }), (error) => {
      if (error.message == '400') {
        this.showModalWithMessage(error, ' Unauthorised');
      } else if (error.message == '404') {
        this.showModalWithMessage(error, ' You Left the Chat');
        this.props.navigation.navigate('ChatList');
      } else if (error.message == '403') {
        this.showModalWithMessage(error, ' You Left the Chat');
        this.props.navigation.navigate('ChatList');
      } else if (error.message == '401') {
        this.showModalWithMessage('401:Login Again ');
      } else {
        this.showModalWithMessage('try again');
      }
    };
  };

  updateChatName = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      patchChatDetails(this.state.newName, userToken, this.state.chatID, () => {
        this.forceUpdate();
      }, (error) => {
        if (error.message == '404') {
          this.showModalWithMessage('404: Not Found ');
        } else if (error.message == '401') {
          this.showModalWithMessage('401: Login Again ');
        } else if (error.message == '403') {
          this.showModalWithMessage('403: Forbidden! ');
        } else if (error.message == '400') {
          this.showModalWithMessage('400: Cannot Update - Bad request ');
        } else if (error.message == '500') {
          this.showModalWithMessage('500: oops! Something went wrong');
        }
      });
    } catch (error) {
      this.showModalWithMessage('oops! Something went wrong');
    }
  };

  renderMember = (item) => (
    <View style={styles.memberRow}>
      <Text>
        {item.first_name}
        {' '}
        {item.last_name}
      </Text>
      <TouchableOpacity style={styles.removeButton} onPress={() => this.remMember(item)}>
        <Text style={styles.buttonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  findUsers = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      // eslint-disable-next-line no-unused-vars
      const id = await AsyncStorage.getItem('userID');

      searchAllUsersChat(userToken, this.state.search, (searchResults) => {
        // Filter out the users who are already members of the chat
        const filteredResults = searchResults.filter(
          (user) => !this.isMember(user) && this.isInContactData(user),
        );

        this.setState({ searchResults: filteredResults, isLoading: false });
      }, (error) => {
        if (error.message == '404') {
          this.showModalWithMessage('404: Not Found ');
        } else if (error.message == '401') {
          this.showModalWithMessage('401: Login Again ');
        } else if (error.message == '403') {
          this.showModalWithMessage('403: Forbidden! ');
        } else if (error.message == '400') {
          this.showModalWithMessage('400: Cannot block yourself ');
        } else if (error.message == '500') {
          this.showModalWithMessage('500: oops! Something went wrong');
        }
      });
    } catch (error) {
      this.showModalWithMessage('oops! Something went wrong');
    }
  };

  renderContact = (item) => (
    <View style={styles.contactRow}>
      <Text>
        {item.given_name}
        {' '}
        {item.family_name}
      </Text>
      <TouchableOpacity style={styles.addButton} onPress={() => this.addContact(item)}>
        <Text style={styles.buttonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );

  getContacts = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      // eslint-disable-next-line no-unused-vars
      const id = await AsyncStorage.getItem('userID');

      getUserContacts(userToken, (contactData) => {
        this.setState({ contactData, isLoading: false });
      }, (error) => {
        if (error.message == '404') {
          this.showModalWithMessage('404: Not Found ');
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

  remMember = async (item) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const id = await AsyncStorage.getItem('userID');

      removeMember(userToken, this.state.chatID, item.user_id, () => {
        this.setState({ isLoading: false });

        if (item.user_id != id) {
          this.getChatDetails();
        } else {
          this.showModalWithMessage(' You Left the Chat');
          setTimeout(() => {
            this.props.navigation.navigate('ChatList');
          }, 3000);
        }

        // this.getContacts()
      }, (error) => {
        if (error.message == '400') {
          this.showModalWithMessage(error, ' Unauthorised');
        } else if (error.message == '403') {
          this.showModalWithMessage(error, ' You Left the Chat');
          this.props.navigation.navigate('ChatList');
        } else {
          this.showModalWithMessage('try again');
        }
      });
    } catch (error) {
      this.showModalWithMessage('Oops! try again');
    }
  };

  addContact = async (item) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      // eslint-disable-next-line no-unused-vars
      const id = await AsyncStorage.getItem('userID');

      addMember(userToken, this.state.chatID, item.user_id, () => {
        this.setState({ isLoading: false });
        this.getChatDetails();
        // this.forceUpdate()
      }, (error) => {
        if (error.message == '404') {
          this.showModalWithMessage('404: Not Found ');
        } else if (error.message == '401') {
          this.showModalWithMessage('401: Login Again ');
        } else if (error.message == '403') {
          this.showModalWithMessage('403: Forbidden! ');
        } else if (error.message == '400') {
          this.showModalWithMessage('400: Already a member ');
        } else if (error.message == '500') {
          this.showModalWithMessage('500: oops! Something went wrong');
        }
      });
    } catch (error) {
      this.showModalWithMessage('oops! Something went wrong');
    }
  };

  isMember = (user) => this.state.chat.members.some((member) => member.user_id === user.user_id);

  isInContactData(item) {
    return this.state.contactData.some((contact) => contact.user_id === item.user_id);
  }

  render() {
    const {
      chat,
    } = this.state;

    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={() => this.props.navigation.navigate('ChatScreen')}>
            <Text style={styles.leftHeaderButtonText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>Chat Info</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.subtitle}>Chat name:</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              defaultValue={chat.name}
              onChangeText={(text) => this.setState({ newName: text })}
            />
            <TouchableOpacity style={styles.button} onPress={this.updateChatName}>
              <Text style={styles.buttonText}> Save  </Text>
            </TouchableOpacity>
          </View>
          <Modal visible={this.state.showModal} animationType="slide" onDismiss={this.onModalDismiss} transparent>
            <View style={{
              flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
            >
              <View style={{ backgroundColor: '#FFFFFF', padding: 20, borderRadius: 8 }}>
                <Text>{this.state.modalMessage}</Text>
                <TouchableOpacity onPress={this.toggleModal}>
                  <Text>Close </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <Text style={styles.subtitle}>Members:</Text>
          <ScrollView style={styles.memberList}>
            <FlatList
              data={chat.members}
              renderItem={({ item }) => this.renderMember(item)}
              keyExtractor={(item, index) => index.toString()}
            />
          </ScrollView>
          <Text style={styles.subtitle}>Add/Remove Members:</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter contact name"
              // eslint-disable-next-line react/no-unused-state
              onChangeText={(text) => this.setState({ contactInput: text })}
            />
            <TouchableOpacity style={styles.button} onPress={this.findUsers}>
              <Text style={styles.buttonText}>Search</Text>
            </TouchableOpacity>
          </View>
          {this.state.searchResults.length > 0
            ? (
              <ScrollView style={styles.searchList}>
                <FlatList
                  data={this.state.searchResults}
                  renderItem={({ item }) => this.renderContact(item)}
                  keyExtractor={(item, index) => index.toString()}
                />
              </ScrollView>
            )
            : <Text>No results found</Text>}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
    paddingLeft: 5,
  },
  leftHeaderButtonText: {
    color: '#fff',
    fontSize: 16,
    // marginRight: 5,
    paddingBottom: 3,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    padding: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  textInput: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 4,
  },
  headerButton: {
    backgroundColor: '#2196F3',
    borderRadius: 25,
    paddingLeft: 15,
    paddingRight: 15,
    justifyContent: 'center',
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  memberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  memberList: {
    maxHeight: 200,
    backgroundColor: '#FFFFFF',
    marginVertical: 10,
  },
  searchList: {
    maxHeight: 350,
    backgroundColor: '#FFFFFF',
    marginVertical: 10,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#FFFFFF',
  },
  addButton: {
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  removeButton: {
    padding: 10,
    backgroundColor: '#F44336',
    borderRadius: 5,
  },

});
