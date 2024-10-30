import { Camera, CameraType } from 'expo-camera/legacy';
import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Ensure to install this package
import Icon from 'react-native-vector-icons/MaterialIcons'; 

export default function RealTimePrediction() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [prediction, setPrediction] = useState(null);
  const cameraRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    if (permission && permission.granted && isStreaming) {
      startStreaming();
    }
  }, [permission, isStreaming]);

  const startStreaming = () => {
    const id = setInterval(async () => {
      if (!cameraRef.current || !isStreaming) return;

      const photo = await cameraRef.current.takePictureAsync({ base64: true });

      const formData = new FormData();
      formData.append('image', {
        uri: `data:image/jpeg;base64,${photo.base64}`,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });

      try {
        const response = await fetch("http://192.168.1.100:5006/predict_frame", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setPrediction(data);
      } catch (error) {
        console.error("Error during prediction:", error);
      }
    }, 1000);

    setIntervalId(id);
  };

  const toggleStreaming = () => {
    setIsStreaming((prev) => {
      if (prev) {
        clearInterval(intervalId);
      } else {
        startStreaming();
      }
      return !prev;
    });
  };

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Icon name="info-outline" size={20} color="#333" marginLeft={7} marginTop={7} />
      <Text style={styles.infoText}>
        Point the camera at an object to see real-time predictions!
      </Text>
      <Camera style={styles.camera} type={type} ref={cameraRef}>
        <View style={styles.overlay}>
          {prediction && (
            <View style={styles.predictionContainer}>
              <Text style={styles.predictionText}>
                Detected: {prediction.predicted_class} ({(prediction.confidence * 100).toFixed(2)}%)
              </Text>
            </View>
          )}
        </View>
      </Camera>
      <TouchableOpacity 
        style={styles.button} 
        onPress={toggleStreaming}
      >
        <MaterialCommunityIcons 
          name={isStreaming ? "stop" : "play"} 
          size={24} 
          color="white" 
        />
        <Text style={styles.buttonText}>
          {isStreaming ? "Stop Streaming" : "Start Streaming"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#e8f5e997', // Light green background
  },
  camera: {
    flex: 1,
    borderRadius: 10, // Rounded corners for the camera view
    overflow: 'hidden', // Clip overflow
  },
  overlay: {
    position: 'absolute',
    bottom: 30,
    left: 10,
    right: 10,
    alignItems: 'center',
  },
  predictionContainer: {
    backgroundColor: 'rgba(0,0,0,0.7)', // Dark overlay for better readability
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5, // Android shadow effect
  },
  predictionText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  permissionText: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
    color: '#333', // Darker text color
  },
  button: {
    backgroundColor: '#4CAF50', // Custom button color
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10, // Space between icon and text
  },
  infoText: {
    textAlign: 'center',
    fontSize: 17,
    marginBottom: 10,
    color: '#333', // Darker text color
    marginTop: 10,
    fontStyle: 'italic',
  },
});
