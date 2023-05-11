import React ,{ Component }from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList,ScrollView } from 'react-native';
import { getChatList } from '../api/getRequests/getRequests';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default class ChatList extends Component {
  
constructor(props){
    super(props);
    this.state = {
   
        chatList:[],
        isLoading: true,
    }
}

componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
     // this.checkLoggedIn();
      this.getUserChatList();
     
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

getUserChatList = async () => {
    
      const userToken = await AsyncStorage.getItem('userToken');
      const id = await AsyncStorage.getItem('userID');
      console.log(userToken, id);
      // Do something with userToken and id
      //alert("running")
      getChatList(userToken, (chatList)=>{
        console.log(chatList);
        this.setState({ chatList, isLoading: false });
        
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

  handleHeaderPress = () => {
    console.log('Header button pressed');
  }

  handleChatPress = (chat) => {
    console.log(`Chat ${chat.chat_id} pressed`);
    this.props.navigation.navigate('ChatScreen', { chat_id: chat.chat_id });
    
  }

  renderChatItem = ({ item }) => {
    const { name, last_message } = item;
    let truncatedMessage = last_message.message;
    let senderName = `${last_message.author.first_name} ${last_message.author.last_name}`;
    if (truncatedMessage.length > 35) {
      truncatedMessage = truncatedMessage.substring(0, 35) + '...';
    }
    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => this.handleChatPress(item)}
      >
        <Text style={styles.chatTitle}>{name}</Text>
        <Text style={styles.chatLastMessage}>{senderName +" : " + truncatedMessage}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    const { chatList } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Chats</Text>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={this.handleHeaderPress}
          >
            <Text style={styles.headerButtonText}>New Chat</Text>
          </TouchableOpacity>
        </View>
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
      alignItems: "center",
      justifyContent: "center",
      
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 10,
      borderBottomColor: "#ccc",
      borderBottomWidth: 1,
      width: "100%",
    },
    headerText: {
      fontSize: 26,
      fontWeight: "bold",
      color:"#43464B"
    },
    button: {
      backgroundColor: "#007bff",
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 5,
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    chatItem: {
        padding: 10,
        backgroundColor: "#FFFFFF",
        borderBottomColor: "#ccc",
        borderBottomWidth: 1,
        borderRadius: 5,
        backgroundImage: 'linear-gradient(to left, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 100%)',
        width:"100%",
        justifyContent: 'space-between'
      },
    chatTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 5,
    },
    lastMessage: {
      fontSize: 14,
      color: "#555",
    },
  });
  