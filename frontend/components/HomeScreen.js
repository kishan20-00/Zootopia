import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import icons

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Animal Classifier</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('animaldetect')}
      >
        <Icon name="pets" size={24} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>Animal Detect</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('realtimeanimaldetect')}
      >
        <Icon name="camera-alt" size={24} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>Real-Time Animal Detect</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('diseasedetect')}
      >
        <Icon name="healing" size={24} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>Disease Detect</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('behaviordetect')}
      >
        <Icon name="psychology" size={24} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>Behavior Detect</Text>
      </TouchableOpacity>

      {/* camara capture */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('camaracapture')}
      >
        <Icon name="camera-alt" size={24} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>Camara Capture</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e6f7e6', // Light green background
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    color: '#2b7a0b', // Dark green for title
    fontWeight: 'bold',
    marginBottom: 40,
  },
  button: {
    flexDirection: 'row', // Row layout for button with icon and text
    backgroundColor: '#4CAF50', // Green color for buttons
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4, // Elevation for Android shadow
  },
  icon: {
    marginRight: 10, // Space between icon and text
  },
  buttonText: {
    color: '#fff', // White text color
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
