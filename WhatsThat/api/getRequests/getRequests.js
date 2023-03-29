import AsyncStorage from '@react-native-async-storage/async-storage';

async function getUserContacts(sessionID, success) {
  console.log(sessionID);
    fetch("http://localhost:3333/api/1.0.0/contacts", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        'X-Authorization': sessionID,
      },
    })
      .then(async(response) => {
        if (response.status === 200) {
          const charData = await response.json();
          success(charData);
          console.log(charData);
        } 
        else {
          console.log("Error fetching user details: ", response);
        }
      })
      .catch((error) => {
        console.log("Error fetching user details: ", error);
      });
  }
  export {
    getUserContacts
  }