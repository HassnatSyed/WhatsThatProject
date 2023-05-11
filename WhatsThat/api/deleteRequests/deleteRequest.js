
async function removeFriend(sessionID, contactID, success, failure) {
    console.log("logging id passed", contactID);
    
     fetch(
        `http://localhost:3333/api/1.0.0/user/${contactID}/contact`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "X-Authorization": sessionID,
          },
        })
      .then(async(response) => {
      if (response.status === 200) {
        success();
      } 
      else if(response.status === 400) {
        console.log("Cannot remove yourself as friend", response);
        failure(new Error("400"));
      }
      else if (response.status === 401) {
        console.log("Unauthorized! Please Login ", response);
        failure(new Error("401"));
      } 
      else if (response.status === 404) {
        console.log("Friend Not Found ", response);
        failure(new Error("404"));
      } 
      else if (response.status === 500) {
        console.log("Server Error ", response);
        failure(new Error("500"));
      }
    }) 
    .catch ((error) => {
      console.log("Error removing friend: ", error);
      failure(error);
    })
  }

  async function unblockUser(sessionID, contactID, success, failure) {
    console.log("logging id passed", contactID);
     fetch(
        `http://localhost:3333/api/1.0.0/user/${contactID}/block`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "X-Authorization": sessionID,
          },
        })
      .then(async(response) =>{
      if (response.status === 200) {
        success();
      } 
      else if(response.status === 400) {
        console.log("Cannot unblock yourself", response);
        failure(new Error("400"));
      }
      else if (response.status === 401) {
        console.log("Unauthorized! Please Login ", response);
        failure(new Error("401"));
      } 
      else if (response.status === 404) {
        console.log("User Not Found ", response);
        failure(new Error("404"));
      } 
      else if (response.status === 500) {
        console.log("Server Error ", response);
        failure(new Error("500"));
      }
    })
     .catch ((error) => {
      console.log("Error Unblocking User: ", error);
      failure(error);
    });
  }

  async function removeMember(sessionID, chatID, userID, success, failure) {
    console.log("logging id passed", userID)
  

    
      fetch("http://localhost:3333/api/1.0.0/chat/" +chatID + "/user/"+ userID, {
        method: "DELETE",
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


    async function deleteMessage(messageID, sessionID, chatID, success, failure) {
      
      // Remove any keys with null values from the object
     
      
      console.log(sessionID, "from patchapi");
      fetch(`http://localhost:3333/api/1.0.0/chat/${chatID}/message/${messageID}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": sessionID,
        },
        
      })
      .then(async (response) => {
        if (response.status === 200) {
          console.log("Message Deleted: ", response);
          success();
        } else if (response.status === 400) {
          console.log("Not Found ", response);
          failure(new Error("400"));
        }
      })
      .catch((error) => {
        console.log(error);
      });
    }
export{
    removeFriend,
    unblockUser,
    removeMember,
    deleteMessage
}  