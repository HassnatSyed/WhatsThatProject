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
async function removeFriend(sessionID, contactID, success, failure) {
  fetch(
    `http://localhost:3333/api/1.0.0/user/${contactID}/contact`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': sessionID,
      },
    },
  )
    .then(async (response) => {
      if (response.status === 200) {
        success();
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
      }
    })
    .catch((error) => {
      failure(error);
    });
}

async function unblockUser(sessionID, contactID, success, failure) {
  fetch(
    `http://localhost:3333/api/1.0.0/user/${contactID}/block`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': sessionID,
      },
    },
  )
    .then(async (response) => {
      if (response.status === 200) {
        success();
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
      }
    })
    .catch((error) => {
      failure(error);
    });
}

async function removeMember(sessionID, chatID, userID, success, failure) {
  fetch(`http://localhost:3333/api/1.0.0/chat/${chatID}/user/${userID}`, {
    method: 'DELETE',
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
      } else if (response.status === 403) {
        failure(new Error('403'));
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

async function deleteMessage(messageID, sessionID, chatID, success, failure) {
  // Remove any keys with null values from the object

  fetch(`http://localhost:3333/api/1.0.0/chat/${chatID}/message/${messageID}`, {
    method: 'DELETE',
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
      } else if (response.status === 403) {
        failure(new Error('403'));
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
export {
  removeFriend,
  unblockUser,
  removeMember,
  deleteMessage,
};
