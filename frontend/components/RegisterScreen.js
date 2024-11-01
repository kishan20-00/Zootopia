import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firebase from '../firebaseConfig';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = () => {
    setErrorMessage(''); // Reset error message
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please try again.");
      return;
    }

    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(() => navigation.navigate('Login'))
      .catch(error => setErrorMessage("Registration failed. Please check your details and try again."));
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.appName}>ZOOTOPIA</Text>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        placeholder="Your Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholderTextColor="#8c8c8c"
      />
      <TextInput
        placeholder="Your Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#8c8c8c"
      />
      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#8c8c8c"
      />

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Icon name="person-add" size={24} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
        Already have an account? Login
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0faf4',
    paddingHorizontal: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 15,
  },
  appName: {
    fontSize: 26,
    color: '#2b7a0b',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  title: {
    fontSize: 22,
    color: '#4CAF50',
    marginTop: 5,
    marginBottom: 30,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    color: '#000',
    fontSize: 16,
  },
  errorText: {
    color: '#f44336',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 20,
    color: '#2b7a0b',
    fontSize: 16,
  },
});

export default RegisterScreen;
