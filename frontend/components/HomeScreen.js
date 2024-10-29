import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient'; // Make sure to install expo-linear-gradient
import firebase from '../firebaseConfig';

const HomeScreen = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const user = firebase.auth().currentUser;
    if (user) {
      setUserEmail(user.email);
      const namePart = user.email.split('@')[0]; // Get first part of email as name
      setUserName(namePart.charAt(0).toUpperCase() + namePart.slice(1)); // Capitalize first letter
    }
  }, []);

  const handleLogout = () => {
    firebase.auth().signOut()
      .then(() => navigation.navigate('Login'))
      .catch(error => alert(error.message));
  };

  const renderButton = (icon, text, description, onPress, backgroundImage) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <ImageBackground source={backgroundImage} style={styles.buttonBackground} imageStyle={{ borderRadius: 20 }}>
        <LinearGradient
          colors={['rgba(128, 128, 0, 0.7)', 'rgba(85, 107, 47, 0.7)']}
          style={styles.gradientOverlay}
        >
          <Icon name={icon} size={24} color="#D3D3D3" style={styles.icon} />
          <View style={styles.textContainer}>
            <Text style={styles.buttonText}>{text}</Text>
            <Text style={styles.buttonDescription}>{description}</Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Zootopia Home Section */}
      <View style={styles.TitleContainer}>
      <Text style={styles.zootopiaTitle}>Zootopia Home</Text>
      <Icon name="home" size={20} color="#000" style={styles.Titleicon} />
    </View>
      <ImageBackground source={require('../assets/zootopia_main.png')} style={styles.mainImage} imageStyle={{ borderRadius: 20 }}>
        <View style={styles.overlay}>
          <Text style={styles.mainDescription}>Welcome to Zootopia, your go-to app for all animal-related insights, detection, and analysis. Dive in to explore the world of animal behaviors, diseases, and much more!</Text>
        </View>
      </ImageBackground>

      {/* User Info with Icon */}
      <View style={styles.userContainer}>
        <Icon name="account-circle" size={24} color="rgb(46, 113, 48)" style={styles.userIcon} />
        <Text style={styles.userName}>Hello, {userName}!</Text>
      </View>

      {/* Animal Classifier Section */}
      <Text style={styles.sectionTitle}>Animal Classifier</Text>
      <Text style={styles.userText}>Logged in as: {userEmail}</Text>

      {renderButton("pets", "Animal Detect", "Identify animals from images", 
        () => navigation.navigate('animaldetect'), require('../assets/images1.jpg'))}
      {renderButton("camera-alt", "Real-Time Animal Detect", "Instant detection using live camera", 
        () => navigation.navigate('realtimeanimaldetect'), require('../assets/image2.jpg'))}
      {renderButton("healing", "Disease Detect", "Analyze for common animal diseases", 
        () => navigation.navigate('diseasedetect'), require('../assets/image3.jpg'))}
      {renderButton("psychology", "Behavior Detect", "Understand animal behavior traits", 
        () => navigation.navigate('behaviordetect'), require('../assets/image4.jpg'))}
      {renderButton("psychology", "Real-Time Behavior Detect", "Live behavior monitoring", 
        () => navigation.navigate('realtimebehaviordetect'), require('../assets/image5.jpg'))}

      {/* Logout button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="exit-to-app" size={24} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
    backgroundColor: '#f0faf4',
    paddingHorizontal: 20,
  },
  TitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  zootopiaTitle: {
    fontSize: 28,
    color: '#2a652e',
    fontWeight: 'bold',
    marginBottom: 10,
    marginRight: 8,
  },
  Titleicon: {
    fontSize: 28,
    color: '#2a652c',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  mainImage: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 20,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 15,
    borderRadius: 20,
  },
  mainDescription: {
    fontSize: 16,
    color: '#f0faf4',
    textAlign: 'center',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  userIcon: {
    marginRight: 8,
  },
  userName: {
    fontSize: 20,
    color: 'rgb(46, 113, 48)',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 24,
    color: '#555',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userText: {
    fontSize: 14,
    color: '#777',
    marginBottom: 20,
  },
  button: {
    marginBottom: 15,
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
  },
  buttonBackground: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  gradientOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 20,
    width: 300,
  },
  textContainer: {
    marginLeft: 15,
  },
  icon: {
    color: '#fff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonDescription: {
    color: '#fff',
    fontSize: 12,
    marginTop: 3,
  },
  logoutButton: {
    backgroundColor: '#f44336',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 30,
    width: '80%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default HomeScreen;
