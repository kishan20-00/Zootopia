import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView, RefreshControl, Image } from 'react-native';
import axios from 'axios';
import firebase from '../firebaseConfig'; // Adjust the path as needed
import { MaterialIcons } from '@expo/vector-icons'; // For icons

const PredictionForm = () => {
  const [animalName, setAnimalName] = useState('');
  const [animalGroup, setAnimalGroup] = useState('');
  const [dielActivity, setDielActivity] = useState('');
  const [meanBodyTemperature, setMeanBodyTemperature] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [predictions, setPredictions] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  const fetchFirebaseData = async () => {
    try {
      const snapshot = await firebase.database().ref('/device/stream').once('value');

      if (snapshot.exists()) {
        const data = snapshot.val();
        const keys = Object.keys(data);
        const maxKey = Math.max(...keys.map(Number));
        const latestData = data[maxKey];

        if (latestData) {
          setHeartRate(latestData.bpm ? latestData.bpm.toString() : '');
          setMeanBodyTemperature(latestData.temp ? latestData.temp.toString() : '');
        }
      } else {
        console.log("No data available");
      }
    } catch (error) {
      console.error("Error fetching data from Firebase:", error);
      Alert.alert("Error", "Could not fetch data from Firebase.");
    }
  };

  useEffect(() => {
    fetchFirebaseData();
  }, []);

  const handleSubmit = () => {
    const inputData = {
      AnimalName: animalName,
      AnimalGroup: animalGroup,
      DielActivity: dielActivity,
      MeanBodyTemperature: meanBodyTemperature,
    };

    axios.post('http://192.168.1.100:5007/predict', inputData)
      .then((response) => {
        const result = response.data;
        setPredictions(result);
      })
      .catch((error) => {
        console.error("There was an error making the prediction:", error);
        Alert.alert("Error", "Could not make the prediction. Try again.");
      });
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchFirebaseData().finally(() => setRefreshing(false));
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.title}>Animal Danger Prediction</Text>

      <Image source={require('../assets/image3.jpg')} style={styles.headerImage} />

      <Text style={styles.description}>
        Provide details about the animal to predict its danger level.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Animal Name"
        value={animalName}
        onChangeText={setAnimalName}
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
        placeholder="Temperature (from Firebase)"
        value={meanBodyTemperature}
        onChangeText={setMeanBodyTemperature}
        placeholderTextColor="#9e9e9e"
        editable={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Heart Rate (from Firebase)"
        value={heartRate}
        placeholderTextColor="#9e9e9e"
        editable={false}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Predict</Text>
        <MaterialIcons name="autorenew" size={24} color="white" />
      </TouchableOpacity>

      {Object.keys(predictions).length > 0 && (
        <View style={styles.resultContainer}>
          {Object.entries(predictions).map(([key, value]) => (
            <Text key={key} style={styles.result}>
              {key}: {value}
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#e8f5e9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#2b7a0b',
  },
  headerImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#555',
    paddingHorizontal: 10,
  },
  input: {
    height: 50,
    borderColor: '#4CAF50',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 25,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 30,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f0f4c3',
    borderRadius: 10,
  },
  result: {
    fontSize: 18,
    textAlign: 'left',
    color: '#2b7a0b',
    fontWeight: 'bold',
  },
});

export default PredictionForm;
