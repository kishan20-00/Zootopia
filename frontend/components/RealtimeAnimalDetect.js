import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import axios from 'axios';

export default function RealTimePrediction() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions(); // Correct destructuring
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraRef, setCameraRef] = useState(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  // Toggle camera between front and back
  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  // Predict the frame from the camera
  const predictFrame = async (photo) => {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: photo.uri,
        name: 'frame.jpg',
        type: 'image/jpeg',
      });

      const response = await axios.post('http://192.168.1.101:5006/predict_frame', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setPrediction(response.data);
    } catch (error) {
      console.error('Prediction error:', error.message);
    }
  };

  // Capture a frame and make a prediction
  const startRealTimePrediction = async () => {
    if (cameraRef) {
      setLoading(true);
      const photo = await cameraRef.takePictureAsync({ quality: 0.5 });
      await predictFrame(photo);
      setLoading(false);
    }
  };

  // Automatically capture a frame every second
  useEffect(() => {
    const interval = setInterval(() => {
      startRealTimePrediction();
    }, 1000); // Adjust this interval as needed

    return () => clearInterval(interval);
  }, [cameraRef]);

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={(ref) => setCameraRef(ref)} // Capture the reference for CameraView
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>

      {loading && <ActivityIndicator size="large" color="#00ff00" />}
      {prediction && (
        <View style={styles.predictionContainer}>
          <Text style={styles.predictionText}>Predicted Class: {prediction.predicted_class}</Text>
          <Text style={styles.predictionText}>
            Confidence: {(prediction.confidence * 100).toFixed(2)}%
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  predictionContainer: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
  predictionText: {
    color: 'white',
    fontSize: 18,
  },
});
