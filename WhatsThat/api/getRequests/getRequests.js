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
          const contactData = await response.json();
          success(contactData);
          console.log(contactData);
          //setIsLoading(false);
        } 
        else {
          console.log("Error fetching user details: ", response);
        }
      })
      .catch((error) => {
        console.log("Error fetching user details: ", error);
      });
  }

  async function searchAllUsers(sessionID, search, success) {
    console.log(sessionID);
      fetch("http://localhost:3333/api/1.0.0/search?q=" +search + "&search_in=all", {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          'X-Authorization': sessionID,
        },
      })
        .then(async(response) => {
          if (response.status === 200) {
            const searchResult = await response.json();
            success(searchResult);
            console.log(searchResult);
            //setIsLoading(false);
          } 
          else {
            console.log("Error fetching users: ", response);
          }
        })
        .catch((error) => {
          console.log("Error fetching users: ", error);
        });
    }

    async function getBlockedUsers(sessionID, success) {
      console.log(sessionID);
        fetch("http://localhost:3333/api/1.0.0/blocked", {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            'X-Authorization': sessionID,
          },
        })
          .then(async(response) => {
            if (response.status === 200) {
              const blockedList = await response.json();
              success(blockedList);
              console.log(blockedList);
              //setIsLoading(false);
            } 
            else {
              console.log("Error fetching blocked List: ", response);
            }
          })
          .catch((error) => {
            console.log("Error fetching blocked List: ", error);
          });
      }
    
  export {
    getUserContacts,
    searchAllUsers,
    getBlockedUsers
  }