import AsyncStorage from '@react-native-async-storage/async-storage';

async  function loginAPI  (email, password, success, failure)  {
    // Validation here...
    let toSend = {
        // email: this.state.email,
        // password: this.state.password
        email,
        password
    };

    console.log(toSend)
    
    fetch("http://localhost:3333/api/1.0.0/login", {
        method: "post",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(toSend),
    })
    .then(async(response) => {
        if (response.status === 200) {
        console.log("User logged in: ", response);
       // alert("Login successful!");

            //converting response to JSON
        const responseJson = await response.json();
        const sessionID =  responseJson.token;
        const id = responseJson.id;
        //stores the session token and user id
        AsyncStorage.setItem("userID", id)
        AsyncStorage.setItem("userToken", sessionID)
        console.log(sessionID,"from login")
       // console.log(sessionID, id, responseJson);
        success()

        // Save user token or other relevant data
        // Navigate to dashboard or home screen
        } 

        else if (response.status === 400)
        {
        console.log("Login failed: ", response);
        alert("Invalid email or password");
        failure(new Error("400"));
        }
    
    })
    .catch((error) => {
        console.log(error);
    });
   }
   async  function signUpAPI  (firstname, lastname,email, password , success, failure)  {
    // Validation here...
    let toSend = {
        // email: this.state.email,
        // password: this.state.password
        first_name: firstname,
        last_name: lastname,
        email: email,
        password: password
    };

    console.log(toSend)
    
    fetch("http://localhost:3333/api/1.0.0/user", {
        method: "post",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(toSend),
    })
    .then(async(response) => {
        if (response.status === 201) {
        console.log("User Signed Up: ", response);
       // alert("Login successful!");

            //converting response to JSON
        
       // console.log(sessionID, id, responseJson);
        success()

        // Save user token or other relevant data
        // Navigate to dashboard or home screen
        } 

        else if (response.status === 400)
        {
        console.log("SignUp Failed ", response);
        alert("Invalid email or password");
        failure(new Error("400"));
        }
    
    })
    .catch((error) => {
        console.log(error);
    });
   }


   async function addFriend(sessionID, contactID, success, failure) {
    console.log("logging id passed", contactID)
  

    
      fetch("http://localhost:3333/api/1.0.0/user/" +contactID + "/contact", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          'X-Authorization': sessionID,
        },
      })
        .then(async(response) => {
          if (response.status === 200) {
           // const searchResult = await response.json();
            success();
            //console.log(searchResult);
            //setIsLoading(false);
          } 
          else if(response.status === 401) {
            console.log("Unauthorized! Please Login ", response);
            failure(new Error("401"));
          }
          else if(response.status === 400) {
            console.log("Cannot add yourself as a friend", response);
            failure(new Error("400"));
          }
          else if(response.status === 404) {
            console.log("User Not Found ", response);
            failure(new Error("404"));
          }
          else if(response.status === 500) {
            console.log("Server Error ", response);
            failure(new Error("500"));
          }
        })
        .catch((error) => {
          console.log("Error adding user: ", error);
        });
    }

    async function blockUser(sessionID, contactID, success, failure) {
        console.log("logging id passed", contactID)
      
    
        
          fetch("http://localhost:3333/api/1.0.0/user/" +contactID + "/block", {
            method: "post",
            headers: {
              "Content-Type": "application/json",
              'X-Authorization': sessionID,
            },
          })
            .then(async(response) => {
              if (response.status === 200) {
               // const searchResult = await response.json();
                success();
                //console.log(searchResult);
                //setIsLoading(false);
              } 
              else if(response.status === 401) {
                console.log("Unauthorized! Please Login ", response);
                failure(new Error("401"));
              }
              else if(response.status === 400) {
                console.log("Cannot block yourself or users not in your contacts", response);
                failure(new Error("400"));
              }
              else if(response.status === 404) {
                console.log("User Not Found ", response);
                failure(new Error("404"));
              }
              else if(response.status === 500) {
                console.log("Server Error ", response);
                failure(new Error("500"));
              }
            })
            .catch((error) => {
              console.log("Error blocking user: ", error);
            });
        }

        async function sendMessage(sessionID, chatId, message, success, failure) {
            console.log("logging id passed", chatId)
            let toSend = {
                // email: this.state.email,
                // password: this.state.password
                message,
                
            };
        
            
              fetch("http://localhost:3333/api/1.0.0/chat/" +chatId + "/message", {
                method: "post",
                headers: {
                  "Content-Type": "application/json",
                  'X-Authorization': sessionID,
                },
                body: JSON.stringify(toSend),
              })
                .then(async(response) => {
                  if (response.status === 200) {
                   // const searchResult = await response.json();
                    success();
                    //console.log(searchResult);
                    //setIsLoading(false);
                  } 
                  else if(response.status === 401) {
                    console.log("Unauthorized! Please Login ", response);
                    failure(new Error("401"));
                  }
                  else if(response.status === 400) {
                    console.log("Cannot add yourself as a friend", response);
                    failure(new Error("400"));
                  }
                  else if(response.status === 404) {
                    console.log("User Not Found ", response);
                    failure(new Error("404"));
                  }
                  else if(response.status === 500) {
                    console.log("Server Error ", response);
                    failure(new Error("500"));
                  }
                })
                .catch((error) => {
                  console.log("Error adding user: ", error);
                });
        }

        async function addMember(sessionID, chatID, userID, success, failure) {
          console.log("logging id passed", userID)
        
      
          
            fetch("http://localhost:3333/api/1.0.0/chat/" +chatID + "/user/"+ userID, {
              method: "post",
              headers: {
                "Content-Type": "application/json",
                'X-Authorization': sessionID,
              },
            })
              .then(async(response) => {
                if (response.status === 200) {
                 // const searchResult = await response.json();
                  success();
                  //console.log(searchResult);
                  //setIsLoading(false);
                } 
                else if(response.status === 401) {
                  console.log("Unauthorized! Please Login ", response);
                  failure(new Error("401"));
                }
                else if(response.status === 400) {
                  console.log("If user not already a member, Add user as friend", response);
                  failure(new Error("400"));
                }
                else if(response.status === 401) {
                  console.log("Not Authorized", response);
                  failure(new Error("400"));
                }
                else if(response.status === 404) {
                  console.log("User Not Found ", response);
                  failure(new Error("404"));
                }
                else if(response.status === 500) {
                  console.log("Server Error ", response);
                  failure(new Error("500"));
                }
              })
              .catch((error) => {
                console.log("Error adding user: ", error);
              });
          }

   export{
    loginAPI,
    signUpAPI,
    addFriend,
    blockUser,
    sendMessage,
    addMember
   }
