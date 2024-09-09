import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { Video } from 'expo-av'; // Import Video component
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import icons

const BehaviorDetection = () => {
  const [video, setVideo] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickVideo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });

    if (!result.cancelled) {
      setVideo(result);
      console.log(result);
    }
  };

  const uploadVideo = async () => {
    if (!video) {
      alert('Please select a video first');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('video', {
      uri: video.uri,
      name: 'upload.mp4',
      type: 'video/mp4',
    });

    try {
      const response = await axios.post('http://192.168.1.100:5008/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const predictedClass = response.data.prediction;
      setPrediction(predictedClass);
      setIsLoading(false);
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Failed to upload video. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload a Video for Prediction</Text>

      <TouchableOpacity style={styles.button} onPress={pickVideo}>
        <Icon name="videocam" size={24} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>Pick a Video</Text>
      </TouchableOpacity>

      {video && video.uri ? (
        <>
          <Text style={styles.videoText}>
            Video Selected: {video.uri.split('/').pop()}
          </Text>
          {/* Display the video */}
          <Video
            source={{ uri: video.uri }}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="contain"
            shouldPlay
            style={styles.video}
          />
        </>
      ) : (
        <Text style={styles.videoText}>No video selected</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={uploadVideo}>
        <Icon name="cloud-upload" size={24} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>Upload Video</Text>
      </TouchableOpacity>

      {isLoading && <ActivityIndicator size="large" color="#4CAF50" />}

      {prediction && (
        <Text style={styles.predictionText}>Prediction: {prediction}</Text>
      )}
    </View>
  );
};

// Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#e8f5e9', // Light green background
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2b7a0b', // Dark green color for title
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50', // Green color for button
    padding: 15,
    borderRadius: 30,
    marginTop: 20,
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
  icon: {
    marginRight: 10,
  },
  video: {
    width: '100%',
    height: 300,
    marginTop: 20,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Elevation for Android shadow
  },
  videoText: {
    marginTop: 15,
    fontSize: 16,
    textAlign: 'center',
    color: '#2b7a0b', // Dark green color for text
  },
  predictionText: {
    marginTop: 20,
    fontSize: 20,
    color: '#2b7a0b', // Dark green color for result text
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default BehaviorDetection;
