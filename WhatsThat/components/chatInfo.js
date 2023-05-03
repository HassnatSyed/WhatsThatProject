import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, FlatList, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { patchChatDetails } from '../api/patchRequests/patchRequests';
import { getChatData } from '../api/getRequests/getRequests';

export default class ChatInfoScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatID: this.props.route.params.chat_id,
      chat: [],
      isLoading: true,
      newName: ""
    };
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
  getChatDetails = async () => {
    
    const userToken = await AsyncStorage.getItem('userToken');
    const id = await AsyncStorage.getItem('userID');
    console.log(userToken, id);
    console.log("chatid",this.state.chatID);
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

  updateChatName  = async () => {
       
    try{
         const userToken = await AsyncStorage.getItem("userToken");
         const id = await AsyncStorage.getItem("userID");
         console.log("new name", this.state.newName)
         patchChatDetails(this.state.newName, userToken,this.state.chatID, ()=>{
             console.log("Updated Chat Name");
             this.forceUpdate()
         },(error)=> {
             console.log(error);
             if (error.message == "400"){
                 console.log("error 400")
             }
             else {
                 console.log("try again")
             }
         })
     }
     catch (error) {
         console.log(error);
     }
 }

  handleAddContact = () => {
    // Do something with the entered contact
    console.log('Add contact:', this.state.contactInput);

    // Add the contact to the contacts array
    this.setState(prevState => ({
      contacts: [
        ...prevState.contacts,
        {
          user_id: prevState.contacts.length + 1,
          first_name: prevState.contactInput.split(' ')[0],
          last_name: prevState.contactInput.split(' ')[1],
          email: 'example@example.com',
        },
      ],
    }));
  };

  renderContact = ({ item }) => (
    <Text>
      {item.first_name} {item.last_name}
    </Text>
  );

  render() {
    const { chat, newName, contactInput, contacts } = this.state;

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
          <TouchableOpacity style={styles.headerButton} onPress={() => this.props.navigation.navigate("ChatScreen")}>
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
              onChangeText={text => this.setState({ newName: text })}
            />
            <TouchableOpacity style={styles.button} onPress={this.updateChatName}>
              <Text style={styles.buttonText}> Save  </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>Add/Remove Contacts:</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter contact name"
              onChangeText={text => this.setState({ contactInput: text })}
            />
            <TouchableOpacity style={styles.button} onPress={this.handleAddContact}>
              <Text style={styles.buttonText}>Search</Text>
            </TouchableOpacity>
          </View>
          <ScrollView>
            <FlatList
              data={contacts}
              renderItem={this.renderContact}
              keyExtractor={(item, index) => index.toString()}
            />
          </ScrollView>
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
    paddingLeft:5,
  },
  leftHeaderButtonText: {
    color: '#fff',
    fontSize: 16,
    //marginRight: 5,
    paddingBottom:3,
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
    backgroundColor:'#fff'
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
    marginRight:10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
