import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import icons

const PredictionForm = () => {
  // States for form fields
  const [animalName, setAnimalName] = useState('');
  const [symptom1, setSymptom1] = useState('');
  const [symptom2, setSymptom2] = useState('');
  const [symptom3, setSymptom3] = useState('');
  const [symptom4, setSymptom4] = useState('');
  const [symptom5, setSymptom5] = useState('');
  const [animalGroup, setAnimalGroup] = useState('');
  const [dielActivity, setDielActivity] = useState('');
  const [meanBodyTemperature, setMeanBodyTemperature] = useState('');
  const [prediction, setPrediction] = useState(null);

  // Function to handle form submission
  const handleSubmit = () => {
    const inputData = {
      AnimalName: animalName,
      Symptoms1: symptom1,
      Symptoms2: symptom2,
      Symptoms3: symptom3,
      Symptoms4: symptom4,
      Symptoms5: symptom5,
      AnimalGroup: animalGroup,
      DielActivity: dielActivity,
      MeanBodyTemperature: meanBodyTemperature,
    };

    // Send a POST request to the Flask backend using Axios
    axios.post('http://192.168.1.100:5007/predict', inputData)
      .then((response) => {
        // Handle success, showing the prediction
        const result = response.data['Is it dangerous'];
        setPrediction(result);
        Alert.alert("Prediction", `Is it dangerous: ${result}`);
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
        placeholder="Enter Symptom 1"
        value={symptom1}
        onChangeText={setSymptom1}
        placeholderTextColor="#9e9e9e"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Symptom 2"
        value={symptom2}
        onChangeText={setSymptom2}
        placeholderTextColor="#9e9e9e"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Symptom 3"
        value={symptom3}
        onChangeText={setSymptom3}
        placeholderTextColor="#9e9e9e"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Symptom 4"
        value={symptom4}
        onChangeText={setSymptom4}
        placeholderTextColor="#9e9e9e"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Symptom 5"
        value={symptom5}
        onChangeText={setSymptom5}
        placeholderTextColor="#9e9e9e"
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
        placeholder="Enter Temperature"
        value={meanBodyTemperature}
        onChangeText={setMeanBodyTemperature}
        placeholderTextColor="#9e9e9e"
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Icon name="analytics" size={24} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>Predict</Text>
      </TouchableOpacity>

      {prediction && (
        <Text style={styles.result}>Prediction: {prediction}</Text>
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
  icon: {
    marginRight: 10,
  },
  result: {
    marginTop: 20,
    fontSize: 20,
    textAlign: 'center',
    color: '#2b7a0b', // Dark green color for result text
    fontWeight: 'bold',
  },
});

export default PredictionForm;
