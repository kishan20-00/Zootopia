import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/HomeScreen';
import AnimalDetect from './components/AnimalDetect';
import RealTimePrediction from './components/RealtimeAnimalDetect';
import PredictionForm from './components/DiseaseDetect';
import BehaviorDetection from './components/BehaviourDetection';
import CamaraCapture from './components/CameraCapture';

// Stack Navigator setup
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="animaldetect" component={AnimalDetect} />
        <Stack.Screen name="realtimeanimaldetect" component={RealTimePrediction} />
        <Stack.Screen name="diseasedetect" component={PredictionForm} />
        <Stack.Screen name="behaviordetect" component={BehaviorDetection} />
        <Stack.Screen name="camaracapture" component={CamaraCapture} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
