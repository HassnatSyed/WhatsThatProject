/* eslint-disable linebreak-style */
/* eslint-disable react/jsx-no-bind */
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
/* eslint-disable no-unused-vars */
import { Camera, CameraType } from 'expo-camera';
import React, { useState } from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View, Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function CameraSendToServer() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [camera, setCamera] = useState(null);
  const navigation = useNavigation();

  const navigateToUserProfile = () => {
    navigation.navigate('UserProfile');
  };

  function toggleCameraType() {
    setType((current) => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  async function takePhoto() {
    if (camera) {
      const options = { quality: 0.5, base64: true, onPictureSaved: (data) => sendToServer(data) };
      const data = await camera.takePictureAsync(options);
    }
  }

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const onModalDismiss = () => {
    setModalMessage('');
  };

  const showModalWithMessage = (message) => {
    setModalMessage(message);
    setShowModal(true);

    setTimeout(() => {
      onModalDismiss();
      toggleModal();
    }, 3000);
  };

  async function sendToServer(data, imageType) {
    const res = await fetch(data.base64);
    const blob = await res.blob();
    const sessionID = await AsyncStorage.getItem('userToken');
    const id = await AsyncStorage.getItem('userID');

    const uriParts = data.uri.split('.');
    const fileType = uriParts[uriParts.length - 1];

    // Set the correct Content-Type
    const contentType = fileType === 'png' ? 'image/png' : 'image/jpeg';

    fetch(`http://localhost:3333/api/1.0.0/user/${id}/photo`, {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
        'X-Authorization': sessionID,
      },
      body: blob,
    })
      .then((response) => {
        if (response.status === 200) {
          showModalWithMessage('Image uploaded successfully');
          setTimeout(() => {
            navigation.navigate('UserProfile');
          }, 3000);
        } else {
          showModalWithMessage('Image upload failed');
        }
      })
      .catch((error) => {
        showModalWithMessage('Error posting Image', error);
      });
  }

  if (!permission || !permission.granted) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      <Modal visible={showModal} animationType="slide" onDismiss={onModalDismiss} transparent>
        <View style={{
          flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
        >
          <View style={{
            backgroundColor: '#FFFFFF', padding: 20, borderRadius: 8, alignItems: 'center',
          }}
          >
            <Text style={{ textAlign: 'center', fontSize: 14 }}>{modalMessage}</Text>
          </View>
        </View>
      </Modal>
      <Camera style={styles.camera} type={type} ref={(ref) => setCamera(ref)}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Text style={styles.text}>Take Photo</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={navigateToUserProfile}>
            <Text style={styles.text}> Go Back </Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    alignSelf: 'flex-end',
    padding: 8,
    margin: 5,
    backgroundColor: '#2196F3',
    borderRadius: 25,

  },
  button: {
    width: '100%',
    height: '100%',

  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ddd',
  },
  topLeftButtonContainer: {
    position: 'absolute',
    backgroundColor: '#2196F3',
    borderRadius: 25,
    paddingLeft: 15,
    paddingRight: 15,
    justifyContent: 'center',
    marginRight: 50, // Add some margin to separate the button and title
    // width:10
  },
});
