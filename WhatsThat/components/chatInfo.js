import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, FlatList, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { patchChatDetails } from '../api/patchRequests/patchRequests';
import { getChatData, getUserContacts, searchAllUsers } from '../api/getRequests/getRequests';
import { addMember } from '../api/postRequests/postRequests';
import { removeMember } from '../api/deleteRequests/deleteRequest';

export default class ChatInfoScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatID: this.props.route.params.chat_id,
      chat: [],
      isLoading: true,
      newName: "",
      searchResults:[],
      search:"",
      contactData:[]
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
     // this.checkLoggedIn();
     console.log(this.state.chatID)
      this.getChatDetails();
      this.getContacts();
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

 renderMember = (item) => (
  <View style={styles.memberRow}>
    <Text>
      {item.first_name} {item.last_name}
    </Text>
    <TouchableOpacity style={styles.removeButton} onPress={() => this.remMember(item)}>
      <Text style={styles.buttonText}>Remove</Text>
    </TouchableOpacity>
  </View>
);


  findUsers = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const id = await AsyncStorage.getItem('userID');
      console.log(userToken, id);
  
      searchAllUsers(userToken, this.state.search, (searchResults) => {
        console.log(searchResults);
        console.log("contacts", this.state.contactData)
        // Filter out the users who are already members of the chat
        const filteredResults = searchResults.filter(
          (user) => !this.isMember(user) && this.isInContactData(user)
          );
        
  
        this.setState({ searchResults: filteredResults, isLoading: false });
      });
    } catch (error) {
      console.log(error);
    }
  };
  isInContactData(item) {
    return this.state.contactData.some(contact => contact.user_id === item.user_id);
  }

  renderContact = (item) => (
    <View style={styles.contactRow}>
      <Text>
        {item.given_name} {item.family_name}
      </Text>
      <TouchableOpacity style={styles.addButton} onPress={() => this.addContact(item)}>
        <Text style={styles.buttonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );
  
  getContacts = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const id = await AsyncStorage.getItem('userID');
      console.log(userToken, id);
      // Do something with userToken and id
      //alert("running")
      getUserContacts(userToken, (contactData)=>{
        console.log("contactstest",this.state.contactData);
        this.setState({ contactData, isLoading: false });
        
    })
    } 
    catch (error) {
      console.log(error);
    }
};
remMember = async (item) => {
  try {
      const userToken = await AsyncStorage.getItem('userToken');
      const id = await AsyncStorage.getItem('userID');
      console.log(userToken, id);
      // Do something with userToken and id
      //alert("running")
      removeMember(userToken,this.state.chatID ,item.user_id, ()=>{
        console.log(item.user_id, "the user id");
        this.setState({ isLoading: false });
       
        this.getChatDetails() 
        // this.getContacts()
        
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
  addContact = async (item) => {
    try {
        const userToken = await AsyncStorage.getItem('userToken');
        const id = await AsyncStorage.getItem('userID');
        console.log(userToken, id);
        // Do something with userToken and id
        //alert("running")
        addMember(userToken,this.state.chatID ,item.user_id, ()=>{
          console.log(item.user_id, "the user id");
          this.setState({ isLoading: false });
      
         //this.forceUpdate()
          
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

    isMember = (user) => {
      return this.state.chat.members.some(member => member.user_id === user.user_id);
    };
  


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
              onChangeText={text => this.setState({ contactInput: text })}
            />
            <TouchableOpacity style={styles.button} onPress={this.findUsers}>
              <Text style={styles.buttonText}>Search</Text>
            </TouchableOpacity>
          </View>
          {this.state.searchResults.length > 0 ?
            <ScrollView>
             <FlatList
              data={this.state.searchResults}
              renderItem={({ item }) => this.renderContact(item)}
              keyExtractor={(item, index) => index.toString()}
            />
            </ScrollView>
              :
            <Text>No results found</Text>
          }
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
  memberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  memberList: {
    maxHeight: 200,  // Set a max height
    backgroundColor: '#FFFFFF',  // Light gray background
    marginVertical: 10,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#FFFFFF',  // Slightly darker gray background
  },
  addButton: {
    padding: 10,
    backgroundColor: '#4CAF50',  // Change button color to green
    borderRadius: 5,
  },
  removeButton: {
    padding: 10,
    backgroundColor: '#F44336',  // Change button color to red
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',  // Change button text color to white
  },
 
});
