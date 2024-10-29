import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import icons

const PredictionForm = () => {
  // States for form fields
  const [animalName, setAnimalName] = useState('');
  const [animalGroup, setAnimalGroup] = useState('');
  const [dielActivity, setDielActivity] = useState('');
  const [meanBodyTemperature, setMeanBodyTemperature] = useState('');
  const [predictions, setPredictions] = useState({});

  // Function to handle form submission
  const handleSubmit = () => {
    const inputData = {
      AnimalName: animalName,
      AnimalGroup: animalGroup,
      DielActivity: dielActivity,
      MeanBodyTemperature: parseFloat(meanBodyTemperature), // Ensure this is a float
    };

    // Send a POST request to the Flask backend using Axios
    axios.post('http://192.168.1.100:5007/predict', inputData)
      .then((response) => {
        // Handle success, showing the predictions
        setPredictions(response.data);
        Alert.alert("Predictions", JSON.stringify(response.data, null, 2));
      })
      .catch((error) => {
        // Handle error
        console.error("There was an error making the prediction:", error);
        Alert.alert("Error", "Could not make the prediction. Try again.");
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Animal Danger Prediction</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Animal Name"
        value={animalName}
        onChangeText={setAnimalName}
        placeholderTextColor="#9e9e9e" // Placeholder text color
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Animal Group"
        value={animalGroup}
        onChangeText={setAnimalGroup}
        placeholderTextColor="#9e9e9e"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Diel Activity"
        value={dielActivity}
        onChangeText={setDielActivity}
        placeholderTextColor="#9e9e9e"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Mean Body Temperature"
        value={meanBodyTemperature}
        onChangeText={setMeanBodyTemperature}
        placeholderTextColor="#9e9e9e"
        keyboardType="numeric" // Show numeric keyboard for temperature input
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Icon name="analytics" size={24} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>Predict</Text>
      </TouchableOpacity>

      {Object.keys(predictions).length > 0 && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Predictions:</Text>
          {Object.entries(predictions).map(([key, value]) => (
            <Text key={key} style={styles.result}>
              {key}: {value}
            </Text>
          ))}
        </View>
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#2b7a0b', // Dark green color for title
  },
  input: {
    height: 50,
    borderColor: '#4CAF50', // Green border color
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 25, // Rounded corners
    backgroundColor: '#fff', // White background for inputs
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // Elevation for Android shadow
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
  resultContainer: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f0f8ff', // Light background for results
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  result: {
    fontSize: 16,
    textAlign: 'center',
  },
  icon: {
    marginRight: 10,
  },
});

export default PredictionForm;
