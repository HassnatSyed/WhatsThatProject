
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
export{
    removeFriend,
    unblockUser,
}  