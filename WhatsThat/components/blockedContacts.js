import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet,ActivityIndicator,Image ,Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getBlockedUsers, getUserImage } from '../api/getRequests/getRequests';
import { blockUser } from '../api/postRequests/postRequests';
import { unblockUser } from '../api/deleteRequests/deleteRequest';
//import { getBlockedUsers, blockUser, unblockUser } from '../api/getRequests/getRequests";

export default class BlockedContacts extends Component {

    constructor(props){
        super(props);
    
        this.state = {
            contactData :[],
            isLoading: true,
            blockList:[],
            newlyUnlocked:[],
            imageUri:null,
            
        };
    }
    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener("focus", () => {
          this.checkLoggedIn();
          this.getBlockLists();
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

   

    getImage = async (item) => {
        try {
            const userToken = await AsyncStorage.getItem("userToken");
            getUserImage(userToken, item.user_id, (imageUri)=>{
              console.log(item.user_id, "the user id");
              // update the contactData state with the new imageUri for the current contact
              const updatedBlockList = this.state.blockList.map(blockedContact => {
                if (blockedContact.user_id === item.user_id) {
                  return {...blockedContact, imageUri};
                } else {
                  return blockedContact;
                }
              });
              this.setState({blockList: updatedBlockList});
            },(error)=> {
              console.log(error);
              if (error.message == "400"){
                console.log("error 400")
              } else {
                console.log("try again")
              }
            })
          }
      
          catch (error) {
            console.log(error);
          }
      }
    
    isBlocked(item) {
      console.log("runrunrunblock");
      return this.state.blockList.some(blockedUser => blockedUser.user_id === item.user_id);
    }
    isnewlyUnlocked = (item) => {
      console.log(this.state.newlyUnlocked);
        return !this.state.newlyUnlocked.some((newBlocked) => newBlocked.user_id === item.user_id);
    
    
    }
      
    getBlockLists = async () => {
    try {
        const userToken = await AsyncStorage.getItem("userToken");
        const id = await AsyncStorage.getItem("userID");
        this.currentID = await AsyncStorage.getItem("userID");
        console.log(userToken, id);
        // Do something with userToken and id
        //alert("running")
        getBlockedUsers(userToken, (blockList)=>{
            console.log(blockList,"blocccccccck");
            this.setState({ blockList, isLoading: false });
            
    })
    } 
    catch (error) {
        console.log(error);
    }
    };
    
    addToBlockList = async (item) => {
        try {
            const userToken = await AsyncStorage.getItem("userToken");
           // const id = await AsyncStorage.getItem("userID");
            //console.log(userToken, id);
            // Do something with userToken and id
            //alert("running")
            blockUser(userToken, item.user_id, ()=>{
              console.log(item.user_id, "the user id");
              this.setState({ isLoading: false });
              // update newlyUnlocked state with the new blocked contact
              this.setState(prevState => ({
                //newlyUnlocked: [...prevState.contactData, item], 
                 
                newlyUnlocked: prevState.newlyUnlocked.filter(blockedUser => blockedUser.user_id !== item.user_id)// remove the item from the newlyUnlocked array
              }));
              
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
    
    removeFromBlockList = async (item) => {
        try {
            const userToken = await AsyncStorage.getItem("userToken");
            //const id = await AsyncStorage.getItem("userID");
            //console.log(userToken, id);
            // Do something with userToken and id
            //alert("running")
            unblockUser(userToken, item.user_id, ()=>{
              console.log(item.user_id, "the user id");
              
              this.setState({ isLoading: false });
              // update newlyUnlocked state by  unblocking user
              this.setState(prevState => ({
                //contactData: [...prevState.contactData, item],
                newlyUnlocked: [...prevState.newlyUnlocked, item]// add the  newlyUnlocked to the newFriends array
              }));
              
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

    renderBlockList(item) {
        if (item.imageUri == null) {
          // if the imageUri is not available in the state, call getImage function to get the image for the current contact
          this.getImage(item);
        }
        return (
          <View style={styles.searchResult}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.imageUri }} style={styles.contactImage} />
            </View>
            <Text style={styles.userItem}>{item.first_name} {item.last_name}</Text>
            <View style={styles.buttonContainer}>
              {this.isnewlyUnlocked(item) ? (
                <TouchableOpacity onPress={() => this.removeFromBlockList(item)}>
                  <Text style={styles.buttonText}>Unblock</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => this.addToBlockList(item)}>
                  <Text style={styles.buttonText}>Block</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        );
      }

    render() {
        if (this.state.isLoading) {
          return (
            <View>
              <ActivityIndicator />
            </View>
          );
        }
      
        return (
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <View style={styles.header}>
                <Text style={styles.headerText}>Blocklist</Text>
              </View>
              <TouchableOpacity onPress={() => this.props.navigation.navigate("UserProfile")} style={styles.button} >
                <Text style={styles.buttonText}>Go Back</Text>
              </TouchableOpacity>
            </View>
            {this.state.blockList.length > 0 ? (
              <FlatList
                data={this.state.blockList}
                renderItem={({ item }) => this.renderBlockList(item)}
                keyExtractor={(item, index) => index.toString()}
              />
            ) : (
              <Text>You have no Contacts</Text>
            )}
          </View>
        );
    }
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FB",
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    //marginBottom: 10,
  },
  header: {
    flex: 1,
  },
  headerText: {
    
    fontSize: 26,
    fontWeight: "bold",
    color: "#43464B",
  },
  button: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
  },
  searchResult: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userItem: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#43464B",
  },
  buttonContainer: {
    backgroundColor: "#ff4d4d",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});