import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

const PredictionForm = () => {
  // States for form fields
  const [animalName, setAnimalName] = useState('');
  const [symptom1, setSymptom1] = useState('');
  const [symptom2, setSymptom2] = useState('');
  const [symptom3, setSymptom3] = useState('');
  const [symptom4, setSymptom4] = useState('');
  const [symptom5, setSymptom5] = useState('');
  const [prediction, setPrediction] = useState(null);

  // Function to handle form submission
  const handleSubmit = () => {
    const inputData = {
      AnimalName: animalName,
      symptoms1: symptom1,
      symptoms2: symptom2,
      symptoms3: symptom3,
      symptoms4: symptom4,
      symptoms5: symptom5
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
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Symptom 1"
        value={symptom1}
        onChangeText={setSymptom1}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Symptom 2"
        value={symptom2}
        onChangeText={setSymptom2}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Symptom 3"
        value={symptom3}
        onChangeText={setSymptom3}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Symptom 4"
        value={symptom4}
        onChangeText={setSymptom4}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Symptom 5"
        value={symptom5}
        onChangeText={setSymptom5}
      />
      <Button title="Predict" onPress={handleSubmit} />

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
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  result: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center',
    color: 'green',
  },
});

export default PredictionForm;
