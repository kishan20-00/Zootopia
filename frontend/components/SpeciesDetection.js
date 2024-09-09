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
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import icons

const Prescription = () => {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
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
  
      if (!result.canceled) {
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
      const response = await axios.post('http://192.168.1.100:5009/predict', formData, {
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
        <Icon name="photo-library" size={24} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>Pick Image</Text>
      </TouchableOpacity>

      {image && (
        <Image source={{ uri: image.uri }} style={styles.image} />
      )}

      <TouchableOpacity style={styles.button} onPress={uploadImage} disabled={uploading}>
        <Icon name={uploading ? "upload" : "cloud-upload"} size={24} color="#fff" style={styles.icon} />
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
    backgroundColor: '#e8f5e9', // Light green background
    padding: 20,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50', // Green color for buttons
    padding: 15,
    borderRadius: 25,
    marginVertical: 10,
    width: '100%',
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
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginVertical: 20,
  },
  predictionContainer: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: '#f1f8e9', // Slightly lighter green for the prediction box
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  predictionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2b7a0b', // Dark green for prediction text
  },
});

export default Prescription;
