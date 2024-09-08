import React, { useState } from 'react';
import { View, Button, Text, StyleSheet, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { Video } from 'expo-av'; // Import Video component

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

      <Button title="Pick a Video" onPress={pickVideo} />

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
            style={{ width: '100%', height: 300 }}
          />
        </>
      ) : (
        <Text style={styles.videoText}>No video selected</Text>
      )}

      <Button title="Upload Video" onPress={uploadVideo} />

      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}

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
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  videoText: {
    marginTop: 15,
    fontSize: 16,
    textAlign: 'center',
  },
  predictionText: {
    marginTop: 20,
    fontSize: 18,
    color: 'green',
    textAlign: 'center',
  },
});

export default BehaviorDetection;
