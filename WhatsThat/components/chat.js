import React, { Component } from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, FlatList,ActivityIndicator,ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getChatData, getUserContacts } from '../api/getRequests/getRequests';
import { sendMessage } from '../api/postRequests/postRequests';

export default class ChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatID: this.props.route.params.chat_id,
      text: "",
      chat:[],
      submitted: false,
     
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

postMessage = async () => {
    
  const userToken = await AsyncStorage.getItem('userToken');
  const id = await AsyncStorage.getItem('userID');
  console.log(userToken, id);
  // Do something with userToken and id
  //alert("running")
  console.log(this.state.text)
  sendMessage(userToken,this.state.chatID ,this.state.text,()=>{
    this.setState({ text: '' });
    this.setState({ submitted: false });
    this.getChatDetails();
    this.forceUpdate();
    
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
    this.setState({ submitted: true });
    console.log(this.state.text)
    if (this.state.text){
      this.postMessage();
      console.log("message sent")
      
     // this.forceUpdate();
    }
  };

renderMessage = ({ item, index }) => {
  const isCurrentUser = item.author.user_id === this.state.chat.creator.user_id;
  const isFirstInSeries = index === 0 || item.author.user_id !== this.state.chat.messages[this.state.chat.messages.length - index].author.user_id;
  const messageStyle = isCurrentUser ? styles.rightMessage : styles.leftMessage;
  const authorName = isFirstInSeries ? item.author.first_name : null;

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
          <TouchableOpacity onPress={() => this.props.navigation.navigate("ChatInfoScreen", { chat_id: this.state.chatID })}>
            <Text style={styles.headerText} numberOfLines={1} ellipsizeMode="tail">
              {chat.name}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={{ flex: 1 ,paddingLeft:10, paddingRight:10,}}>
        <FlatList
          data={chat.messages.slice().reverse()}
          extraData={this.state}
          renderItem={this.renderMessage}
          keyExtractor={(item) => item.message_id.toString()}
        />
      </ScrollView>
        <View style={styles.footer}>
          <TextInput
            style={styles.textInput}
            placeholder="Type your message here"
            value={text}
            onChangeText={(text) => this.setState({ text })}
            
          />
          <>
            {this.state.submitted && !this.state.text &&
                <Text style={styles.error}>*Enter a message before sending</Text>
            }
          </>
          <TouchableOpacity style={styles.sendButton} onPress={() =>this.handleSend()}>
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
    
    backgroundColor: '#F5F5F5'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
    paddingLeft:5,
    marginBottom:10
    
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
    marginRight: 3, // Add some margin to separate the button and title
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
    marginLeft:20
  },
  leftMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECECEC',
    borderRadius: 5,
    marginBottom: 5,
    paddingLeft: 5,
    paddingRight: 5,
    marginRight:20
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
  error: {
    color: "red",
    fontWeight: '900'
}
});
