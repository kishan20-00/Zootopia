import { Camera, CameraType } from 'expo-camera/legacy';
import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import icons

export default function RealTimeBehaviorPrediction() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const cameraRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [intervalId, setIntervalId] = useState(null); // To store the interval ID

  useEffect(() => {
    if (permission && permission.granted && isStreaming) {
      startStreaming();
    }
  }, [permission, isStreaming]);

  const startStreaming = () => {
    const id = setInterval(async () => {
      if (!cameraRef.current || !isStreaming) return;

      // Capture frame as a base64-encoded image
      const photo = await cameraRef.current.takePictureAsync({ base64: true });

      const formData = new FormData();
      // Append the base64 image as a string
      formData.append('image', photo.base64);

      try {
        const response = await fetch("http://192.168.1.100:5008/predict_frame", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: photo.base64 }), // Send base64 as JSON
        });

        // Check if the response is ok (status in the range 200-299)
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        // Read response as JSON
        const data = await response.json();
        setPrediction(data.predicted_class); // Update the prediction display
        setConfidence(data.confidence); // Update confidence level display

      } catch (error) {
        console.error("Error during prediction:", error);
      }
    }, 1000); // Capture frame every 1000ms (1 second)

    setIntervalId(id); // Save the interval ID
  };

  const toggleStreaming = () => {
    setIsStreaming((prev) => {
      if (prev) {
        // If stopping, clear the interval
        clearInterval(intervalId);
      } else {
        // If starting, start streaming
        startStreaming();
      }
      return !prev; // Toggle streaming state
    });
  };

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={cameraRef}>
        <View style={styles.overlay}>
          {prediction && confidence && (
            <View style={styles.predictionContainer}>
              <Text style={styles.predictionText}>
                Detected Behavior: {prediction}
              </Text>
              <Text style={styles.confidenceText}>
                Confidence: {confidence.toFixed(2)}%
              </Text>
            </View>
          )}
          <View style={styles.infoContainer}>
            <Icon name="info-outline" size={20} color="#fff" />
            <Text style={styles.infoText}>
              This app predicts animal behaviors in real-time. Tap the button below to start streaming!
            </Text>
          </View>
        </View>
      </Camera>
      <TouchableOpacity style={styles.button} onPress={toggleStreaming}>
        <Icon name={isStreaming ? "stop" : "play-arrow"} size={24} color="#fff" />
        <Text style={styles.buttonText}>{isStreaming ? "Stop Streaming" : "Start Streaming"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#e8f5e9', // Light green background
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    bottom: 100,
    left: 10,
    right: 10,
    alignItems: 'center',
  },
  predictionContainer: {
    backgroundColor: 'rgba(0,0,0,0.7)', // Darker background for better readability
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  predictionText: {
    color: 'white',
    fontSize: 18,
  },
  confidenceText: {
    color: 'white',
    fontSize: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  infoText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 5,
  },
  permissionText: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4CAF50', // Green button
    padding: 15,
    borderRadius: 30,
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Elevation for Android shadow
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
