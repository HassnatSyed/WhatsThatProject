/* eslint-disable linebreak-style */
/* eslint-disable camelcase */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/prefer-stateless-function */
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
  StyleSheet, Text, View, TouchableOpacity, FlatList, ScrollView, Modal, TextInput, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getChatList } from '../api/getRequests/getRequests';
import { newChat } from '../api/postRequests/postRequests';

export default class ChatList extends Component {
  constructor(props) {
    super(props);
    this.state = {

      chatList: [],
      isLoading: true,
      newChatName: '',
      isModalVisible: false,
      showModal: false,
      // eslint-disable-next-line react/no-unused-state
      modalMessage: '',
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
      this.getUserChatList();
    });
  }

  openModal = () => {
    this.setState({ isModalVisible: true });
  };

  closeModal = () => {
    this.setState({ isModalVisible: false });
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

  componentWillUnmount() {
    this.unsubscribe();
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('userToken');
    if (value == null) {
      this.props.navigation.navigate('LoginScreen');
    }
  };

  getUserChatList = async () => {
    const userToken = await AsyncStorage.getItem('userToken');

    getChatList(userToken, (chatList) => {
      this.setState({ chatList, isLoading: false });
    }), (error) => {
      if (error.message == '400') {
        this.showModalWithMessage('Bad Request 400');
      } else {
        this.showModalWithMessage('Something went wrong, try again');
      }
    };
  };

  handleChatPress = (chat) => {
    this.props.navigation.navigate('ChatScreen', { chat_id: chat.chat_id });
  };

  renderChatItem = ({ item }) => {
    const { name, last_message } = item;

    let senderName = '';
    let truncatedMessage = '';
    if (last_message) {
      truncatedMessage = last_message.message || '';
      if (last_message.author) {
        senderName = `${last_message.author.first_name} ${last_message.author.last_name}`;
      }
    }
    if (truncatedMessage.length > 35) {
      truncatedMessage = `${truncatedMessage.substring(0, 35)}...`;
    }
    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => this.handleChatPress(item)}
      >
        <Text style={styles.chatTitle}>{name}</Text>
        <Text style={styles.chatLastMessage}>{`${senderName} : ${truncatedMessage}`}</Text>
      </TouchableOpacity>
    );
  };

  createNewChat = async () => {
    const userToken = await AsyncStorage.getItem('userToken');

    newChat(userToken, this.state.newChatName, () => {
      this.setState({ newChatName: '' });
      this.closeModal();
      this.getUserChatList();
    }), (error) => {
      if (error.message == '400') {
        this.showModalWithMessage('error 400');
      } else {
        this.showModalWithMessage('try again');
      }
    };
  };

  render() {
    const { chatList, newChatName } = this.state;
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
        <View style={styles.header}>
          <Text style={styles.headerText}>Chats</Text>
          <TouchableOpacity style={styles.headerButton} onPress={this.openModal}>
            <View style={styles.iconContainer}>
              <Icon name="chat" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.headerButtonText}>New Chat</Text>

          </TouchableOpacity>
        </View>
        <Modal visible={this.state.isModalVisible} transparent>
          <View style={styles.modalContainer}>
            <View style={styles.overlay} />
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={this.closeModal}>
                <Icon name="close" size={20} color="#FFFFFF" style={styles.closeIcon} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Enter Chat Name</Text>
              <TextInput
                style={styles.textInput}
                value={newChatName}
                placeholder="Type your Chat name here"
                // eslint-disable-next-line no-shadow
                onChangeText={(newChatName) => this.setState({ newChatName })}
              />
              <TouchableOpacity style={styles.confirmButton} onPress={this.createNewChat}>
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <ScrollView>
          <FlatList
            data={chatList}
            renderItem={this.renderChatItem}
            keyExtractor={(item) => item.chat_id.toString()}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    alignItems: 'stretch',
    justifyContent: 'center',
    width: '100%',

  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    width: '100%',
  },
  headerText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#43464B',
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    borderRadius: 25,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 2,
    // justifyContent: 'center',
    marginRight: 3,
    height: 30,
  },
  iconContainer: {
    width: 24,
    height: 24,
    marginRight: 4,
    marginTop: 2,
  },
  headerButtonText: {
    color: '#fff',
    fontSize: 16,
    paddingBottom: 3,
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#007bff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatItem: {
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    borderRadius: 5,
    backgroundImage: 'linear-gradient(to left, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 100%)',
    width: '100%',
    justifyContent: 'space-between',
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  lastMessage: {
    fontSize: 14,
    color: '#555',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background for the entire screen
  },
  modalContent: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    zIndex: 1, // Ensure the modal content appears above the overlay
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#ff4d4d',
    padding: 5,
    borderRadius: 5,
  },
  closeIcon: {
    fontWeight: 'bold',
  },
});
