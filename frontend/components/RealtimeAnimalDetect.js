import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';

const RealTimePrediction = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    let interval;
    if (cameraRef) {
      interval = setInterval(() => {
        captureFrame();
      }, 1000); // Capture frame every 1 second
    }
    return () => clearInterval(interval);
  }, [cameraRef]);

  const captureFrame = async () => {
    if (cameraRef) {
      try {
        setLoading(true);

        const photo = await cameraRef.takePictureAsync({
          base64: true,
          quality: 0.5, // Adjust quality for performance
        });

        // Convert the captured image to form data for Flask API
        const formData = new FormData();
        formData.append('image', {
          uri: photo.uri,
          type: 'image/jpeg',
          name: 'frame.jpg',
        });

        // Send frame to the Flask server
        const response = await axios.post('http://your-flask-server-ip:5006/predict_frame', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const { predicted_class, confidence } = response.data;
        setPrediction(predicted_class);
        setConfidence(confidence);
      } catch (error) {
        console.error('Error sending frame:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={(ref) => setCameraRef(ref)}
        style={styles.camera}
        ratio="16:9"
        type={Camera.Constants.Type.back}
      />
      <View style={styles.overlay}>
        {loading && <ActivityIndicator size="large" color="#fff" />}
        {prediction ? (
          <Text style={styles.predictionText}>
            Animal: {prediction} - Confidence: {(confidence * 100).toFixed(2)}%
          </Text>
        ) : (
          <Text style={styles.predictionText}>Awaiting Prediction...</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: '100%',
    padding: 20,
    alignItems: 'center',
  },
  predictionText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default RealTimePrediction;
