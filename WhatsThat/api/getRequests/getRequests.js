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

async function getUserContacts(sessionID, success, failure) {
  fetch('http://localhost:3333/api/1.0.0/contacts', {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': sessionID,
    },
  })
    .then(async (response) => {
      if (response.status === 200) {
        const contactData = await response.json();
        success(contactData);
      } else if (response.status === 401) {
        failure(new Error('401'));
      } else if (response.status === 500) {
        failure(new Error('500'));
      } else {
        failure(response.status);
      }
    })
    .catch((error) => {
      failure(error);
    });
}

async function searchAllUsers(sessionID, search, limit, offset, success, failure) {
  fetch(`http://localhost:3333/api/1.0.0/search?q=${search}&search_in=all&limit=${limit}&offset=${offset}`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': sessionID,
    },
  })
    .then(async (response) => {
      if (response.status === 200) {
        const searchResult = await response.json();
        success(searchResult);
        // setIsLoading(false);
      } else if (response.status === 401) {
        failure(new Error('401'));
      } else if (response.status === 400) {
        failure(new Error('400'));
      } else if (response.status === 404) {
        failure(new Error('404'));
      } else if (response.status === 403) {
        failure(new Error('403'));
      } else if (response.status === 500) {
        failure(new Error('500'));
      } else {
        failure(response.status);
      }
    })
    .catch((error) => {
      failure(error);
    });
}

async function searchAllUsersChat(sessionID, search, success, failure) {
  fetch(`http://localhost:3333/api/1.0.0/search?q=${search}&search_in=all`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': sessionID,
    },
  })
    .then(async (response) => {
      if (response.status === 200) {
        const searchResult = await response.json();
        success(searchResult);
      } else if (response.status === 401) {
        failure(new Error('401'));
      } else if (response.status === 500) {
        failure(new Error('500'));
      } else {
        failure(response.status);
      }
    })
    .catch((error) => {
      failure(error);
    });
}

async function getBlockedUsers(sessionID, success, failure) {
  fetch('http://localhost:3333/api/1.0.0/blocked', {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': sessionID,
    },
  })
    .then(async (response) => {
      if (response.status === 200) {
        const blockedList = await response.json();
        success(blockedList);
      } else if (response.status === 401) {
        failure(new Error('401'));
      } else if (response.status === 404) {
        failure(new Error('404'));
      } else if (response.status === 500) {
        failure(new Error('500'));
      } else {
        failure(response.status);
      }
    })
    .catch((error) => {
      failure(error);
    });
}
async function getUserData(sessionID, id, success, failure) {
  fetch(`http://localhost:3333/api/1.0.0/user/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': sessionID,
    },
  })
    .then(async (response) => {
      if (response.status === 200) {
        const userData = await response.json();
        success(userData);
        // setIsLoading(false);
      } else if (response.status === 401) {
        failure(new Error('401'));
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

async function getUserImage(sessionID, id, success, failure) {
  fetch(`http://localhost:3333/api/1.0.0/user/${id}/photo`, {
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': sessionID,
    },
  })
    .then(async (response) => {
      if (response.status === 200) {
        const userImage = await response.blob();
        const image = URL.createObjectURL(userImage);
        success(image);
      } else if (response.status === 401) {
        failure(new Error('401'));
      }
    })
    .catch((error) => {
      failure(error);
    });
}
async function getChatList(sessionID, success, failure) {
  fetch('http://localhost:3333/api/1.0.0/chat', {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': sessionID,
    },
  })
    .then(async (response) => {
      if (response.status === 200) {
        const chatList = await response.json();
        success(chatList);
      } else if (response.status === 401) {
        failure(new Error('401'));
      } else if (response.status === 500) {
        failure(new Error('500'));
      } else {
        failure(response.status);
      }
    })
    .catch((error) => {
      failure(error);
    });
}

async function getChatData(sessionID, chatID, success, failure) {
  fetch(`http://localhost:3333/api/1.0.0/chat/${chatID}`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': sessionID,
    },
  })
    .then(async (response) => {
      if (response.status === 200) {
        const chatData = await response.json();
        success(chatData);
      } else if (response.status === 401) {
        failure(new Error('401'));
      } else if (response.status === 404) {
        failure(new Error('404'));
      } else if (response.status === 403) {
        failure(new Error('403'));
      } else if (response.status === 500) {
        failure(new Error('500'));
      } else {
        failure(response.status);
      }
    })
    .catch((error) => {
      failure(error);
    });
}

export {
  getUserContacts,
  searchAllUsers,
  getBlockedUsers,
  getUserData,
  getUserImage,
  getChatList,
  getChatData,
  searchAllUsersChat,
};
