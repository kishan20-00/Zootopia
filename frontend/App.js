import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/HomeScreen';
import AnimalDetect from './components/AnimalDetect';
import RealTimePrediction from './components/RealtimeAnimalDetect';
import PredictionForm from './components/DiseaseDetect';
import BehaviorDetection from './components/BehaviourDetection';
import CamaraCapture from './components/CameraCapture';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import RealTimeBehaviorPrediction from './components/RealtimeBehaviorDetect';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Register' }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
        <Stack.Screen name="animaldetect" component={AnimalDetect} options={{ title: 'Animal Detection' }} />
        <Stack.Screen name="realtimeanimaldetect" component={RealTimePrediction} options={{ title: 'Real-Time Animal Detection' }} />
        <Stack.Screen name="diseasedetect" component={PredictionForm} options={{ title: 'Disease Detection' }} />
        <Stack.Screen name="behaviordetect" component={BehaviorDetection} options={{ title: 'Behavior Detection' }} />
        <Stack.Screen name="realtimebehaviordetect" component={RealTimeBehaviorPrediction} options={{ title: 'Real-Time Behavior Detection' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
