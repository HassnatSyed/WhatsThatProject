/* eslint-disable linebreak-style */
/* eslint-disable prefer-regex-literals */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable eqeqeq */
/* eslint-disable max-len */
/* eslint-disable no-sequences */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-use-before-define */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable no-throw-literal */
/* eslint-disable react/jsx-filename-extension */

async function patchUserDetails(firstname, lastname, email, password, sessionID, userID, success, failure) {
  const toSend = {
    first_name: firstname,
    last_name: lastname,
    email,
    password,
  };

  // Remove any keys with null values from the object
  const filteredToSend = Object.fromEntries(
    Object.entries(toSend).filter(([key, value]) => value),
  );

  console.log(filteredToSend);
  console.log(sessionID, 'from patchapi');
  fetch(`http://localhost:3333/api/1.0.0/user/${userID}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': sessionID,
    },
    body: JSON.stringify(filteredToSend),
  })
    .then(async (response) => {
      if (response.status === 200) {
        console.log('User Details Updated: ', response);
        success();
      } else if (response.status === 400) {
        console.log('Details Not Updated ', response);
        failure(new Error('400'));
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

async function patchChatDetails(chatName, sessionID, chatID, success, failure) {
  const toSend = {
    name: chatName,
  };

  // Remove any keys with null values from the object

  console.log(toSend);
  console.log(sessionID, 'from patchapi');
  fetch(`http://localhost:3333/api/1.0.0/chat/${chatID}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': sessionID,
    },
    body: JSON.stringify(toSend),
  })
    .then(async (response) => {
      if (response.status === 200) {
        console.log('Chat Details Updated: ', response);
        success();
      } else if (response.status === 400) {
        console.log('Details Not Updated ', response);
        failure(new Error('400'));
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

async function patchMessage(messagetxt, messageID, sessionID, chatID, success, failure) {
  const toSend = {
    message: messagetxt,
  };

  // Remove any keys with null values from the object

  console.log(toSend);
  console.log(sessionID, 'from patchapi');
  fetch(`http://localhost:3333/api/1.0.0/chat/${chatID}/message/${messageID}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': sessionID,
    },
    body: JSON.stringify(toSend),
  })
    .then(async (response) => {
      if (response.status === 200) {
        console.log('Message Updated: ', response);
        success();
      } else if (response.status === 400) {
        console.log('Details Not Updated ', response);
        failure(new Error('400'));
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

export {
  patchUserDetails,
  patchChatDetails,
  patchMessage,
};
