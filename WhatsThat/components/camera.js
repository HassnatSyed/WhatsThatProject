import { Camera, CameraType } from 'expo-camera';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function CameraSendToServer() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [camera, setCamera] = useState(null);
  const navigation = useNavigation();


  const navigateToUserProfile = () => {
    navigation.navigate("UserProfile");
  }

  function toggleCameraType() {
    setType((current) => (current === CameraType.back ? CameraType.front : CameraType.back));
    console.log("Camera: ", type);
  }

  async function takePhoto() {
    if (camera) {
      const options = { quality: 0.5, base64: true, onPictureSaved: (data) => sendToServer(data) };
      const data = await camera.takePictureAsync(options);
    }
  }

  async function sendToServer(data, imageType) {
    console.log("HERE", data.uri);

    let res = await fetch(data.base64);
    let blob = await res.blob();
    const sessionID = await AsyncStorage.getItem('userToken');
    const id = await AsyncStorage.getItem('userID');

    let uriParts = data.uri.split('.');
    let fileType = uriParts[uriParts.length - 1];

    // Set the correct Content-Type
    let contentType = fileType === 'png' ? 'image/png' : 'image/jpeg';

    fetch(`http://localhost:3333/api/1.0.0/user/${id}/photo`, {
        method: 'POST',
        headers: {
            'Content-Type': contentType,
            'X-Authorization': sessionID,
        },
        body: blob
    })
    .then((response) => {
       if (response.status === 200) {
        console.log("Image uploaded successfully");
        navigation.navigate("UserProfile"); 
      } else {
        console.log("Image upload failed");
      }
    })
    .catch((error) => {
        console.log("Error posting profile image: ", error);
    });
}


  if (!permission || !permission.granted) {
    return <Text>No access to camera</Text>;
  } else {
    return (
      <View style={styles.container}>
     
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
    borderRadius: 25
    
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
    //width:10
  },
});
