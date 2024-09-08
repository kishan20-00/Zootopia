import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

const Prescription = () => {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Function to pick image from the gallery
  const pickImage = async () => {
    // Request permission to access the image library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'You need to grant permission to access the image library.');
      return;
    }
  
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      // Check if the user didn't cancel the image picker
      if (!result.canceled) {
        // Check if URI is available
        if (result.assets && result.assets.length > 0) {
          const uri = result.assets[0].uri;
          setImage({ uri });
          console.log('Selected Image URI:', uri);
        } else {
          Alert.alert('No Image Selected', 'Image URI is not available.');
        }
      } else {
        Alert.alert('Image Selection Cancelled', 'You did not select any image.');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image.');
    }
  };
  
  const uploadImage = async () => {
    if (!image) {
      Alert.alert("No Image Selected", "Please select an image first.");
      return;
    }
  
    setUploading(true);
  
    const formData = new FormData();
    formData.append('image', {
      uri: image.uri,
      name: 'image.jpg',
      type: 'image/jpeg',
    });
  
    try {
      const response = await axios.post('http://192.168.1.101:5005/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          accept: 'application/json',
        },
      });
  
      setPrediction(response.data);
      Alert.alert("Prediction received");
    } catch (error) {
      console.error('Error:', error.message);
      Alert.alert("Upload Failed", "Failed to upload image or receive prediction. Check console for details.");
    } finally {
      setUploading(false);
    }
  };
  
  

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Pick Image</Text>
      </TouchableOpacity>
      {image && (
        <Image source={{ uri: image.uri }} style={styles.image} />
      )}
      <TouchableOpacity style={styles.button} onPress={uploadImage} disabled={uploading}>
        <Text style={styles.buttonText}>{uploading ? 'Uploading...' : 'Upload Image'}</Text>
      </TouchableOpacity>
      {prediction && (
        <View style={styles.predictionContainer}>
          <Text style={styles.predictionText}>
            Predicted Class: {prediction.predicted_class}
          </Text>
          <Text style={styles.predictionText}>
            Confidence: {(prediction.confidence * 100).toFixed(2)}%
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#FF9DD2',
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: 300,
    height: 300,
    margin: 10,
  },
  predictionContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  predictionText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Prescription;
