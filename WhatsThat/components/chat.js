/* eslint-disable linebreak-style */
/* eslint-disable react/jsx-no-useless-fragment */
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
  View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
// eslint-disable-next-line import/no-extraneous-dependencies
import { format, isSameDay } from 'date-fns';
import { getChatData } from '../api/getRequests/getRequests';
import { sendMessage } from '../api/postRequests/postRequests';
import { patchMessage } from '../api/patchRequests/patchRequests';
import { deleteMessage } from '../api/deleteRequests/deleteRequest';

export default class ChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatID: this.props.route.params.chat_id,
      text: '',
      chat: [],
      submitted: false,
      editingMessage: '',
      editingMessageId: null,
      showModal: false,
      modalMessage: '',
      userID: '',

    };
    // this.lastAuthorId = null;
    // eslint-disable-next-line react/no-unused-class-component-methods
    // this.headerWidth = 0;
    this.lastDisplayedDate = null;
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
      this.getChatDetails();
      this.getUserID();
      this.retrieveDraft();
      this.intervalId = setInterval(() => {
        this.getChatDetails();
      }, 7000);
    });
    this.blurListener = this.props.navigation.addListener('blur', () => {
      clearInterval(this.intervalId);
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.chat !== this.state.chat) {
      this.flatListRef.scrollToEnd({ animated: true });
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.blurListener();
    clearInterval(this.intervalId);
  }

  async getUserID() {
    try {
      const userID = await AsyncStorage.getItem('userID');
      this.setState({ userID });
    } catch (error) {
      this.showModalWithMessage(error);
    }
  }

  toggleModal = () => {
    this.setState((prevState) => ({
      showModal: !prevState.showModal,
    }));
  };

  onModalDismiss = () => {
    this.setState({
      modalMessage: '',
    });
  };

  showModalWithMessage = (message) => {
    this.setState({
      modalMessage: message,
      showModal: true,
    });

    setTimeout(() => {
      this.onModalDismiss();
      this.toggleModal();
    }, 2000);
  };

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('userToken');
    if (value == null) {
      this.props.navigation.navigate('LoginScreen');
    }
  };

  getChatDetails = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    // eslint-disable-next-line no-unused-vars
    const id = await AsyncStorage.getItem('userID');

    getChatData(userToken, this.state.chatID, (chat) => {
      // eslint-disable-next-line react/no-unused-state
      this.setState({ chat, isLoading: false }, () => {
        this.flatListRef.scrollToEnd({ animated: true });
      });
    }), (error) => {
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
    };
  };

  postMessage = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    // eslint-disable-next-line no-unused-vars
    const id = await AsyncStorage.getItem('userID');

    sendMessage(userToken, this.state.chatID, this.state.text, () => {
      this.setState({ text: '' });
      this.setState({ submitted: false });
      this.getChatDetails();
      this.deleteDraft();
      this.forceUpdate();
      this.flatListRef.scrollToEnd({ animated: true });
    }), (error) => {
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
    };
  };

  handleSend = () => {
    this.setState({ submitted: true });

    if (this.state.text) {
      this.postMessage();
    }
  };

  renderMessage = ({ item, index }) => {
    // eslint-disable-next-line eqeqeq
    const isCurrentUser = item.author.user_id == this.state.userID;
    // eslint-disable-next-line max-len
    const isFirstInSeries = index === 0 || item.author.user_id !== this.state.chat.messages[this.state.chat.messages.length - index].author.user_id;
    const messageStyle = isCurrentUser ? styles.rightMessage : styles.leftMessage;
    const authorName = isFirstInSeries ? item.author.first_name : null;

    const timestamp = new Date(item.timestamp); // Convert timestamp to milliseconds
    const timeString = format(timestamp, 'p'); // Display the time in the format 'hh:mm AM/PM'
    const dateString = format(timestamp, 'eeee, MMMM do, yyyy'); // Display the date in the format 'Day, Month dd, yyyy'

    let displayDate = false;
    if (!this.lastDisplayedDate || !isSameDay(this.lastDisplayedDate, timestamp)) {
      displayDate = true;
      this.lastDisplayedDate = timestamp;
    }
    if (isCurrentUser && item.message_id === this.state.editingMessageId) {
      return (
        <View style={[styles.messageContainer, messageStyle, {
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: 300,
        }]}
        >
          <TouchableOpacity
            style={{
              backgroundColor: '#ff4d4d', marginRight: 8, padding: 10, borderRadius: 20,
            }}
            onPress={this.deleteThisMessage}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>Delete</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <TextInput
              style={[styles.textInput, {
                height: 'auto', maxHeight: 150, paddingVertical: 8, paddingHorizontal: 12,
              }]}
              value={this.state.editingMessage}
              onChangeText={(editingMessage) => this.setState({ editingMessage })}
              multiline
              placeholder="Type your message here"
            />
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: '#4CAF50', marginLeft: 8, padding: 10, borderRadius: 20,
            }}
            onPress={this.updateMessage}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>✓</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View>
        {displayDate
              && (
              <Text style={{
                ...styles.date,
                textAlign: 'center',
                marginTop: 10, // Adjust the values as per your requirement
                marginBottom: 10,
              }}
              >
                {dateString}
              </Text>
              )}
        <View style={[styles.messageContainer, messageStyle]}>
          {authorName && <Text style={styles.author}>{authorName}</Text>}
          <TouchableOpacity onLongPress={
            () => this.setState({ editingMessageId: item.message_id, editingMessage: item.message })
          }
          >
            <Text>{item.message}</Text>
            <Text style={styles.time}>{timeString}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  updateMessage = async () => {
    try {
      if (!this.state.editingMessage) {
        this.showModalWithMessage('Cannot update to an empty Message');
        return;
      }
      const userToken = await AsyncStorage.getItem('userToken');
      // const id = await AsyncStorage.getItem('userID');

      patchMessage(this.state.editingMessage, this.state.editingMessageId, userToken, this.state.chatID, () => {
        this.setState({ editingMessageId: null, editingMessage: null }); // Reset editing state
        this.getChatDetails(); // Refresh chat data after editing
        this.showModalWithMessage('Message Updated'); // Show the modal
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

  deleteThisMessage = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      // const id = await AsyncStorage.getItem('userID');

      deleteMessage(this.state.editingMessageId, userToken, this.state.chatID, () => {
        this.setState({ editingMessageId: null, editingMessage: null }); // Reset editing state
        this.getChatDetails(); // Refresh chat data after editing
        this.showModalWithMessage('Message Deleted');
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

  retrieveDraft = async () => {
    try {
      const draftMessage = await AsyncStorage.getItem('draftMessage');
      if (draftMessage !== null) {
        this.setState({ text: draftMessage });
      }
    } catch (error) {
      this.showModalWithMessage('Error retrieving draft');
    }
  };

  deleteDraft = async () => {
    try {
      await AsyncStorage.removeItem('draftMessage');
    } catch (error) {
      this.showModalWithMessage('Error deleting draft');
    }
  };

  saveDraft = async () => {
    if (this.state.text) {
      try {
        await AsyncStorage.setItem('draftMessage', this.state.text);
        this.showModalWithMessage('Draft saved successfully');
      } catch (error) {
        this.showModalWithMessage('Error saving draft');
      }
    }
  };

  render() {
    const { chat, text } = this.state;

    if (!chat.name || !chat.messages) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    return (
      <View style={styles.container}>

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.leftHeaderButton}
            onPress={() => this.props.navigation.navigate('ChatList')}
          >
            <Text style={styles.leftHeaderButtonText}>Back</Text>
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('ChatInfoScreen', { chat_id: this.state.chatID })}>
              <Text style={styles.headerText} numberOfLines={1} ellipsizeMode="tail">
                {chat.name}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Modal visible={this.state.showModal} animationType="slide" onDismiss={this.onModalDismiss} transparent>
          <View style={{
            flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
          >
            <View style={{ backgroundColor: '#FFFFFF', padding: 20, borderRadius: 8 }}>
              <Text>{this.state.modalMessage}</Text>

            </View>
          </View>
        </Modal>
        <View style={{ flex: 1, paddingLeft: 10, paddingRight: 10 }}>
          <FlatList
            ref={(ref) => { this.flatListRef = ref; }}
            data={chat.messages.slice().reverse()}
            extraData={this.state}
            renderItem={this.renderMessage}
            keyExtractor={(item) => item.message_id.toString()}
            onContentSizeChange={() => this.flatListRef.scrollToEnd({ animated: true })}
          />
        </View>
        <View style={styles.footer}>
          <TextInput
            style={styles.textInput}
            placeholder="Type your message here"
            value={text}
            // eslint-disable-next-line no-shadow
            onChangeText={(text) => this.setState({ text })}
            multiline
          />
          <>
            {this.state.submitted && !this.state.text
                && <Text style={styles.error}>*Enter a message</Text>}
          </>
          <TouchableOpacity style={styles.sendButton} onPress={() => this.handleSend()}>
            <Icon name="send" style={styles.sendButtonText} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendButton} onPress={() => this.saveDraft()}>
            <Icon name="save" style={styles.sendButtonText} />

          </TouchableOpacity>
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
    marginBottom: 10,

  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 10,
  },
  leftHeaderButton: {
    backgroundColor: '#2196F3',
    borderRadius: 25,
    paddingLeft: 15,
    paddingRight: 15,
    justifyContent: 'center',
    marginRight: 3,
    // width:10
  },
  leftHeaderButtonText: {
    color: '#fff',
    fontSize: 16,
    paddingBottom: 3,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  messageList: {
    flex: 1,
  },
  messageContainer: {
    padding: 10,
  },
  rightMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    borderRadius: 5,
    marginBottom: 5,
    paddingLeft: 5,
    paddingRight: 5,
    marginLeft: 20,
  },
  leftMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECECEC',
    borderRadius: 5,
    marginBottom: 5,
    paddingLeft: 5,
    paddingRight: 5,
    marginRight: 20,
  },
  author: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  footer: {
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
    padding: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingLeft: 15,
    paddingRight: 15,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#2196F3',
    borderRadius: 25,
    paddingLeft: 15,
    paddingRight: 15,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 20,
  },
  error: {
    color: 'red',
    fontWeight: '900',
  },
  date: {

    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
});
