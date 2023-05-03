import AsyncStorage from '@react-native-async-storage/async-storage';

async function patchUserDetails(firstname, lastname, email, password, sessionID, userID, success, failure) {
  let toSend = {
    first_name: firstname,
    last_name: lastname,
    email: email,
    password: password
  };

  // Remove any keys with null values from the object
  const filteredToSend = Object.fromEntries(
    Object.entries(toSend).filter(([key, value]) => value)
  );

  console.log(filteredToSend);
  console.log(sessionID, "from patchapi");
  fetch(`http://localhost:3333/api/1.0.0/user/${userID}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-Authorization": sessionID,
    },
    body: JSON.stringify(filteredToSend),
  })
  .then(async (response) => {
    if (response.status === 200) {
      console.log("User Details Updated: ", response);
      success();
    } else if (response.status === 400) {
      console.log("Details Not Updated ", response);
      failure(new Error("400"));
    }
  })
  .catch((error) => {
    console.log(error);
  });
}



async function patchChatDetails(chatName, sessionID, chatID, success, failure) {
  let toSend = {
    name: chatName
  };

  // Remove any keys with null values from the object
 
  console.log(toSend);
  console.log(sessionID, "from patchapi");
  fetch(`http://localhost:3333/api/1.0.0/chat/${chatID}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-Authorization": sessionID,
    },
    body: JSON.stringify(toSend),
  })
  .then(async (response) => {
    if (response.status === 200) {
      console.log("Chat Details Updated: ", response);
      success();
    } else if (response.status === 400) {
      console.log("Details Not Updated ", response);
      failure(new Error("400"));
    }
  })
  .catch((error) => {
    console.log(error);
  });
}

export {
  patchUserDetails,
  patchChatDetails,
}
