import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import axios from 'axios';

export default function RealTimePrediction() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraRef, setCameraRef] = useState(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionMessage}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" color="#4CAF50" />
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

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

  const startRealTimePrediction = async () => {
    if (cameraRef) {
      setLoading(true);
      const photo = await cameraRef.takePictureAsync({ quality: 0.5 });
      await predictFrame(photo);
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      startRealTimePrediction();
    }, 1000); 

    return () => clearInterval(interval);
  }, [cameraRef]);

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={(ref) => setCameraRef(ref)}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>

      {loading && <ActivityIndicator size="large" color="#4CAF50" />}
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
    backgroundColor: '#e8f5e9', // Light green background
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5', // Light gray background
    padding: 20,
  },
  permissionMessage: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    padding: 20,
  },
  button: {
    backgroundColor: '#4CAF50', // Green color for button
    padding: 15,
    borderRadius: 30,
    elevation: 5, // Elevation for Android shadow
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  predictionContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent background
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  predictionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
