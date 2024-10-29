import { Camera, CameraType } from 'expo-camera/legacy';
import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function RealTimePrediction() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [prediction, setPrediction] = useState(null);
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
        // Append the base64 image as a file
        formData.append('image', {
            uri: `data:image/jpeg;base64,${photo.base64}`,
            type: 'image/jpeg', // Adjust the type if necessary
            name: 'photo.jpg', // Name it something
        });

        try {
            const response = await fetch("http://192.168.1.100:5006/predict_frame", {
                method: "POST",
                body: formData,
            });

            // Check if the response is ok (status in the range 200-299)
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            // Read response as JSON
            const data = await response.json();
            setPrediction(data); // Update the prediction display

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
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
      <Button title={isStreaming ? "Stop Streaming" : "Start Streaming"} onPress={toggleStreaming} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    bottom: 30,
    left: 10,
    right: 10,
    alignItems: 'center',
  },
  predictionContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 10,
  },
  predictionText: {
    color: 'white',
    fontSize: 18,
  },
});
