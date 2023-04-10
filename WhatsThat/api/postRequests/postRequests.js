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

   async function addFriend(sessionID, contactID, success, failure) {
    console.log("logging id passed", contactID)
    let toSend = {
        // email: this.state.email,
        // password: this.state.password
        contactID,
    };

    
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
                console.log("Cannot block yourself", response);
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


   export{
    loginAPI,
    addFriend,
    blockUser,
   }
