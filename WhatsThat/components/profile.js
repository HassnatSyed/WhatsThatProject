// import React, { Component } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// import LoginScreen from './login';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export default class ProfileScreen extends Component {

    // async logout () {
    //     console.log("Logout")
        
    //     return fetch("http://localhost:3333/api/1.0.0/logout", {
      
    //     method: "POST",
    //     headers: {
    //         "X-Authorization": await AsyncStorage.getItem("userToken")
    //     }
    //     })
    //     .then(async (response) => {
        
        
    //     if(response.status === 200) {
    //         await AsyncStorage.removeItem("userToken")
    //         await AsyncStorage.removeItem("userID")
    //         this.props.navigation.navigate("LoginScreen")
    //     }
    //     else if(response.status === 401) {
    //         console.log("Unauthorised")
        
      
    //         await AsyncStorage.removeItem("userToken")
    //         await AsyncStorage.removeItem("userID")
    //     }
    //     else{
    //         this.props.navigation.navigate("LoginScreen")
    //         throw "Something went wrong"
    //     }
    // })
    //     .catch((error) => {
    //         this.setState({"error": error})
    //         this.setState({"submitted": false});
    //     })
    // }


        
        
//     render(){

//         return(
//             <View>
//                 <TouchableOpacity  style={styles.loginbtn} onPress={() => this.logout()}>
//                     <View style={styles.button}>
//                         <Text style={styles.buttonText}>Logout</Text>
//                     </View>
//                 </TouchableOpacity>
//             </View>
//         )
        
//     }
       
    
// }
// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: "#f5f5f5",
//       //width: "100%",
//       //alignItems: "stretch",
//       //justifyContent: "center",
      
      
//       padding:16
//     },
//     header: {
//       fontSize:24,
//       fontWeight: "Bold",
//       MarginBotton: 16,
//       color: "#333"
//     },
//     contact:{
//       padding:16,
//       marginBottom: 3,
//       borderRadius:5,
//       backgroundColor: "#fff",
//       // shadowColor:"#000",
//       // shadowOffset:{
//       //   width: 0,
//       //   height: 1,
//       // },
//       // shadowOpacity: 0.25,
//       // shadowRadius:3.5,
//       elevation: 5
  
//     },
//     contactName:{
//       marginBottom: 10,
//       fontSize:18,
//       marginBotton: 8,
//       color: "#333",
//     },
//     loginbtn:{
  
//     },
//     signup:{
//       justifyContent: "center",
//       textDecorationLine: "underline",
//       paddingTop: 0,
//     },
//     button: {
//         marginTop: 100,
//       marginBottom: 30,
//       backgroundColor: '#2196F3'
//     },
//     buttonText: {
//       textAlign: 'center',
//       padding: 20,
//       color: 'white'
//     },
//     error: {
//         color: "red",
//         fontWeight: '900'
//     }
//   });
  
import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserImage } from '../api/getRequests/getRequests';

export default class ProfileScreen extends Component {
   
    constructor(props){
        super(props);

        this.state = {
        userData: {},
        imageUri: null
        }
    }

    componentDidMount() {
        this.getUserData();
        this.getImage();
    }

    getUserData = async () => {
        const userToken = await AsyncStorage.getItem('userToken');
        const id = await AsyncStorage.getItem('userID');
        const response = await fetch(`http://localhost:3333/api/1.0.0/user/${id}`, {
           method:"get",
            headers: {
                "Content-Type": "application/json",
                'X-Authorization': userToken,
            }
        });
        const json = await response.json();
        this.setState({ userData: json });
    }

    // getUserImage = async () => {
    //     const userToken = await AsyncStorage.getItem('userToken');
    //     const id = await AsyncStorage.getItem('userID');
    //     const response = await fetch(`http://localhost:3333/api/1.0.0/user/${id}/photo`, {
    //         method: "get",
    //         headers: {
    //             "Content-Type": "image/png",
    //             'X-Authorization': userToken,
    //         }
    //     });
    //     const json = await response.json();
    //     this.setState({ imageUri: json.uri });
    // }
    getImage = async (item) => {
        try {
            const userToken = await AsyncStorage.getItem('userToken');
            const id = await AsyncStorage.getItem('userID');
            console.log(userToken, id);
            // Do something with userToken and id
            //alert("running")
            getUserImage(userToken, id, (imageUri)=>{
              console.log(id, "the user id");
              this.setState({ isLoading: false });
              // update newFriends state with the new friend
              this.setState({imageUri // add the new friend to the newFriends array
              });
              
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
    

    async logout () {
        console.log("Logout")
        
        return fetch("http://localhost:3333/api/1.0.0/logout", {
      
        method: "POST",
        headers: {
            "X-Authorization": await AsyncStorage.getItem("userToken")
        }
        })
        .then(async (response) => {
        
        
        if(response.status === 200) {
            await AsyncStorage.removeItem("userToken")
            await AsyncStorage.removeItem("userID")
            this.props.navigation.navigate("LoginScreen")
        }
        else if(response.status === 401) {
            console.log("Unauthorised")
        
      
            await AsyncStorage.removeItem("userToken")
            await AsyncStorage.removeItem("userID")
        }
        else{
            this.props.navigation.navigate("LoginScreen")
            throw "Something went wrong"
        }
    })
        .catch((error) => {
            this.setState({"error": error})
            this.setState({"submitted": false});
        })
    }

    render() {
        const { userData, imageUri } = this.state;
        return (
            <View style={styles.container}>
                {imageUri && (
                    <Image source={{ uri: this.state.imageUri }} style={styles.profileImage} />
                )}
                <Text style={styles.name}>{userData.first_name} {userData.last_name}</Text>
                <Text style={styles.email}>{userData.email}</Text>
                <TouchableOpacity style={styles.editButton}>
                    <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>
                <View style={styles.bottomButtons}>
                    <TouchableOpacity style={styles.bottomButton} onPress={() => Alert.alert('Function 1')}>
                        <Text style={styles.bottomButtonText}>Blocked Contacts</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.bottomButton} onPress={() => Alert.alert('Function 2')}>
                        <Text style={styles.bottomButtonText}>Function 2</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.logoutButton} onPress={this.logout}>
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      padding: 20,
      backgroundColor: '#fff',
    },
    profileImage: {
      width: 250,
      height: 250,
      borderRadius: 75,
      marginBottom: 20,
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    email: {
      fontSize: 18,
      marginBottom: 30,
    },
    editButton: {
      backgroundColor: '#4CAF50',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      marginBottom: 20,
    },
    editButtonText: {
      color: '#fff',
      fontSize: 18,
    },
    bottomButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      paddingHorizontal: 40,
      marginBottom: 30,
    },
    bottomButton: {
      backgroundColor: '#2196F3',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      width: '45%',
    },
    bottomButtonText: {
      color: '#fff',
      fontSize: 18,
      textAlign: 'center',
    },
    logoutButton: {
      backgroundColor: '#FF0000',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      marginTop: 'auto',
    },
    logoutButtonText: {
      color: '#fff',
      fontSize: 18,
    },
  
})
