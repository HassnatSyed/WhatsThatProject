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
import AsyncStorage from '@react-native-async-storage/async-storage';

async function loginAPI(email, password, success, failure) {
  const toSend = {
    email,
    password,
  };

  fetch('http://localhost:3333/api/1.0.0/login', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(toSend),
  })
    .then(async (response) => {
      if (response.status === 200) {
        // alert("Login successful!");

        // converting response to JSON
        const responseJson = await response.json();
        const sessionID = responseJson.token;
        const { id } = responseJson;
        // stores the session token and user id
        AsyncStorage.setItem('userID', id);
        AsyncStorage.setItem('userToken', sessionID);

        success();

        // Save user token or other relevant data
        // Navigate to dashboard or home screen
      } else if (response.status === 400) {
        failure(new Error('400'));
      } else if (response.status === 500) {
        failure(new Error('500'));
      }
    })
    .catch((error) => {
      failure(error);
    });
}
async function signUpAPI(firstname, lastname, email, password, success, failure) {
  // Validation here...
  const toSend = {
    // email: this.state.email,
    // password: this.state.password
    first_name: firstname,
    last_name: lastname,
    email,
    password,
  };

  fetch('http://localhost:3333/api/1.0.0/user', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(toSend),
  })
    .then(async (response) => {
      if (response.status === 201) {
        // converting response to JSON

        success();
      } else if (response.status === 400) {
        failure(new Error('400'));
      }
    })
    .catch((error) => {
      failure(error);
    });
}

async function addFriend(sessionID, contactID, success, failure) {
  fetch(`http://localhost:3333/api/1.0.0/user/${contactID}/contact`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': sessionID,
    },
  })
    .then(async (response) => {
      if (response.status === 200) {
        success();
      } else if (response.status === 401) {
        failure(new Error('401'));
      } else if (response.status === 400) {
        failure(new Error('400'));
      } else if (response.status === 404) {
        failure(new Error('404'));
      } else if (response.status === 500) {
        failure(new Error('500'));
      }
    })
    .catch((error) => {
      failure(error);
    });
}

async function blockUser(sessionID, contactID, success, failure) {
  fetch(`http://localhost:3333/api/1.0.0/user/${contactID}/block`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': sessionID,
    },
  })
    .then(async (response) => {
      if (response.status === 200) {
        success();
      } else if (response.status === 401) {
        failure(new Error('401'));
      } else if (response.status === 400) {
        failure(new Error('400'));
      } else if (response.status === 404) {
        failure(new Error('404'));
      } else if (response.status === 500) {
        failure(new Error('500'));
      }
    })
    .catch((error) => {
      failure(error);
    });
}

async function sendMessage(sessionID, chatId, message, success, failure) {
  const toSend = {

    message,

  };

  fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/message`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': sessionID,
    },
    body: JSON.stringify(toSend),
  })
    .then(async (response) => {
      if (response.status === 200) {
        success();
      } else if (response.status === 401) {
        failure(new Error('401'));
      } else if (response.status === 400) {
        failure(new Error('400'));
      } else if (response.status === 404) {
        failure(new Error('404'));
      } else if (response.status === 500) {
        failure(new Error('500'));
      }
    })
    .catch((error) => {
      failure(error);
    });
}

async function addMember(sessionID, chatID, userID, success, failure) {
  fetch(`http://localhost:3333/api/1.0.0/chat/${chatID}/user/${userID}`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': sessionID,
    },
  })
    .then(async (response) => {
      if (response.status === 200) {
        success();
      } else if (response.status === 401) {
        failure(new Error('401'));
      } else if (response.status === 400) {
        failure(new Error('400'));
      } else if (response.status === 404) {
        failure(new Error('404'));
      } else if (response.status === 500) {
        failure(new Error('500'));
      }
    })
    .catch((error) => {
      failure(error);
    });
}
async function newChat(sessionID, chatName, success, failure) {
  const toSend = {

    name: chatName,

  };

  fetch('http://localhost:3333/api/1.0.0/chat', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': sessionID,
    },
    body: JSON.stringify(toSend),
  })
    .then(async (response) => {
      if (response.status === 201) {
        success();
      } else if (response.status === 401) {
        failure(new Error('401'));
      } else if (response.status === 400) {
        failure(new Error('400'));
      } else if (response.status === 500) {
        failure(new Error('500'));
      }
    })
    .catch((error) => {
      failure(error);
    });
}

async function logoutAPI(sessionID, success, failure) {
  fetch('http://localhost:3333/api/1.0.0/logout', {

    method: 'POST',
    headers: {
      'X-Authorization': sessionID,
    },
  })
    .then(async (response) => {
      if (response.status === 200) {
        AsyncStorage.removeItem('userToken');
        AsyncStorage.removeItem('userID');

        success();
      } else if (response.status === 401) {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userID');
        failure(new Error('400'));
      } else if (response.status === 500) {
        failure(new Error('500'));
      }
    })
    .catch((error) => {
      failure(error);
    });
}

export {
  loginAPI,
  signUpAPI,
  addFriend,
  blockUser,
  sendMessage,
  addMember,
  newChat,
  logoutAPI,
};
