import React, { Component } from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, FlatList,ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getChatData, getUserContacts } from '../api/getRequests/getRequests';

export default class ChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatID: this.props.route.params.chat_id,
      text: '',
      chat:[],
      //chatID: 1,
      // chat: {
      //   "name": "The Rod Stewart Appreciation Society",
      //   "creator": {
      //       "user_id": 1,
      //       "first_name": "Ashley",
      //       "last_name": "Williams",
      //       "email": "ashley.williams1@mmu.ac.uk"
      //   },
      //   "members": [
      //       {
      //           "user_id": 1,
      //           "first_name": "Ashley",
      //           "last_name": "Williams",
      //           "email": "ashley.williams1@mmu.ac.uk"
      //       },
      //       {
      //           "user_id": 6,
      //           "first_name": "Bill",
      //           "last_name": "Gates",
      //           "email": "bill.gates@gmail.com"
      //       }
      //   ],
      //   "messages": [
      //       {
      //           "message_id": 4,
      //           "timestamp": 1681320524861,
      //           "message": "I have questions. Why whatsapp?",
      //           "author": {
      //               "user_id": 6,
      //               "first_name": "Bill",
      //               "last_name": "Gates",
      //               "email": "bill.gates@gmail.com"
      //           }
      //       },
      //       {
      //           "message_id": 3,
      //           "timestamp": 1681319824451,
      //           "message": "We will be making a whatsapp like app. Any questions?",
      //           "author": {
      //               "user_id": 1,
      //               "first_name": "Ashley",
      //               "last_name": "Williams",
      //               "email": "ashley.williams1@mmu.ac.uk"
      //           }
      //       },
      //       {
      //           "message_id": 1,
      //           "timestamp": 1681087218237,
      //           "message": "Welcome to all our new members",
      //           "author": {
      //               "user_id": 1,
      //               "first_name": "Ashley",
      //               "last_name": "Williams",
      //               "email": "ashley.williams1@mmu.ac.uk"
      //           }
      //       }
      //   ]
    //}
    };
    this.lastAuthorId = null;
    this.headerWidth = 0;
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
     // this.checkLoggedIn();
     console.log(this.state.chatID)
      this.getChatDetails();
     // console.log(chat);
     
    })
}
  
componentWillUnmount(){
  this.unsubscribe()
}
checkLoggedIn = async () => {
  const value = await AsyncStorage.getItem("userToken")
  if(value == null){
    this.props.navigation.navigate("LoginScreen")
  }
}

getChatDetails = async () => {
    
      const userToken = await AsyncStorage.getItem('userToken');
      const id = await AsyncStorage.getItem('userID');
      console.log(userToken, id);
      // Do something with userToken and id
      //alert("running")
      getChatData(userToken,this.state.chatID ,(chat)=>{
        console.log(chat);
        this.setState({ chat, isLoading: false });
        
    }),(error)=> {
        console.log(error);
        if (error.message == "400"){
            console.log("error 400")
        }
        else {
            console.log("try again")
        }
    } 
    
};
  handleSend = () => {
    // Do something with this.state.text
    this.setState({ text: '' });
  };

  renderMessage = ({ item }) => {
    const isCurrentUser = item.author.user_id === this.state.chat.creator.user_id;
    const isFirstInSeries = item.author.user_id !== this.lastAuthorId;
    const messageStyle = isCurrentUser ? styles.rightMessage : styles.leftMessage;
    const authorName = isFirstInSeries ? item.author.first_name : null;

    this.lastAuthorId = item.author.user_id;

    return (
      <View style={[styles.messageContainer, messageStyle]}>
        {authorName && <Text style={styles.author}>{authorName}</Text>}
        <Text>{item.message}</Text>
      </View>
    );
  };

  onHeaderLayout = (event) => {
    this.headerWidth = event.nativeEvent.layout.width;
    this.forceUpdate();
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
  console.log(this.state.chat)
    // Calculate the left header button width and adjust maxNameLength
    // const leftHeaderButtonWidth = 60; // Adjust this value to the total width of the left header button
    // const maxNameLength = this.headerWidth ? this.headerWidth - leftHeaderButtonWidth - 60 : 15; // Increase the subtraction value for more space
    // const truncatedName = chat.name.length > maxNameLength ? `${chat.name.substring(0, maxNameLength - 3)}...` : chat.name;
  
    return (
      <View style={styles.container}>
         <View style={styles.header} >
        <TouchableOpacity
          style={styles.leftHeaderButton}
          onPress={() => this.props.navigation.navigate("ChatList")}
        >
          <Text style={styles.leftHeaderButtonText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <TouchableOpacity onPress={() => console.log('Header button pressed')}>
            <Text style={styles.headerText} numberOfLines={1} ellipsizeMode="tail">
              {chat.name}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
        <FlatList
          style={styles.messageList}
          data={chat.messages.slice().reverse()}
          extraData={this.state}
          renderItem={this.renderMessage}
          keyExtractor={(item) => item.message_id.toString()}
        />
        <View style={styles.footer}>
          <TextInput
            style={styles.textInput}
            placeholder="Type your message here"
            value={text}
            onChangeText={(text) => this.setState({ text })}
          />
          <TouchableOpacity style={styles.sendButton} onPress={this.handleSend}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft:10,
    paddingRight:10,
    backgroundColor: '#F5F5F5'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 10,
    paddingLeft:5
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
    marginRight: 5, // Add some margin to separate the button and title
    //width:10
  },
  leftHeaderButtonText: {
    color: '#fff',
    fontSize: 16,
    paddingBottom:3
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
  },
  leftMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECECEC',
    borderRadius: 5,
    marginBottom: 5,
    paddingLeft: 5,
    paddingRight: 5,
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
    fontSize: 16,
  },
});
