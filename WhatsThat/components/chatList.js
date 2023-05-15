import React ,{ Component }from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList,ScrollView , Modal,TextInput} from 'react-native';
import { getChatList } from '../api/getRequests/getRequests';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { newChat } from '../api/postRequests/postRequests';


export default class ChatList extends Component {
  
constructor(props){
    super(props);
    this.state = {
   
        chatList:[],
        isLoading: true,
        newChatName: "",
        isModalVisible: false
    }
}

componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
     // this.checkLoggedIn();
      this.getUserChatList();
     
    })
}
openModal = () => {
  this.setState({ isModalVisible: true });
};

closeModal = () => {
  this.setState({ isModalVisible: false });
};

handleConfirm = () => {
  // Perform API call or further processing with this.state.newChatName
  // ...

  // Close the modal
  this.closeModal();
};
  
componentWillUnmount(){
  this.unsubscribe()
}
checkLoggedIn = async () => {
  const value = await AsyncStorage.getItem("userToken")
  if(value == null ){
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

    let senderName = '';
    let truncatedMessage = '';
    if (last_message) {
        truncatedMessage = last_message.message || '';
        if (last_message.author) {
            senderName = `${last_message.author.first_name} ${last_message.author.last_name}`;
        }
    }
    if (truncatedMessage.length > 35) {
        truncatedMessage = truncatedMessage.substring(0, 35) + '...';
    }
    return (
        <TouchableOpacity
            style={styles.chatItem}
            onPress={() => this.handleChatPress(item)}
        >
            <Text style={styles.chatTitle}>{name}</Text>
            <Text style={styles.chatLastMessage}>{senderName + " : " + truncatedMessage}</Text>
        </TouchableOpacity>
    );
}

  createNewChat = async () => {
    
    const userToken = await AsyncStorage.getItem('userToken');
    const id = await AsyncStorage.getItem('userID');
    console.log(userToken, id);
    // Do something with userToken and id
    //alert("running")
    newChat(userToken,this.state.newChatName, ()=>{
      this.closeModal();
      //this.getUserChatList();
      
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

  render() {
    const { chatList, newChatName  } = this.state;
    return (
      <View style={styles.container}>
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
    headerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#2196F3',
      borderRadius: 25,
      paddingLeft: 15,
      paddingRight: 15,
      paddingTop:2,
      //justifyContent: 'center',
      marginRight: 3, 
      height: 30
    },
    iconContainer: {
      width: 24,
      height: 24,
      marginRight: 4,
      marginTop:2,
    },
    headerButtonText: {
      color: '#fff',
      fontSize: 16,
      paddingBottom:3,
      justifyContent:'center',
      fontWeight: "bold"
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
      borderRadius:5
    },
    closeIcon: {
      fontWeight: 'bold',
    },
  });
  