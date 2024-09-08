import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
import { Camera } from 'expo-camera'; // Import Camera from expo-camera

const CameraCapture = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef) {
      setIsLoading(true);
      try {
        const photo = await cameraRef.takePictureAsync({
          quality: 1,
          base64: true,
        });
        setPhoto(photo);
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const retakePicture = () => {
    setPhoto(null);
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {photo ? (
        <View style={styles.photoContainer}>
          <Image source={{ uri: photo.uri }} style={styles.photo} />
          <TouchableOpacity style={styles.button} onPress={retakePicture}>
            <Text style={styles.buttonText}>Retake Picture</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Camera style={styles.camera} ref={(ref) => setCameraRef(ref)}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <Text style={styles.captureButtonText}>📸</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      )}
      {isLoading && <ActivityIndicator size="large" color="#4CAF50" />}
    </View>
  );
};

// Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f5e9', // Light green background
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  captureButton: {
    backgroundColor: '#4CAF50', // Green color for button
    borderRadius: 50,
    padding: 20,
  },
  captureButtonText: {
    color: '#fff',
    fontSize: 24,
  },
  photoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  photo: {
    width: 300,
    height: 400,
    marginBottom: 20,
    borderRadius: 10,
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  button: {
    backgroundColor: '#4CAF50', // Green color for button
    padding: 15,
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CameraCapture;
