import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Animal Classifier</Text>
      <Button
        title="Animal Detect"
        onPress={() => navigation.navigate('animaldetect')}
      />
      <Button
        title="Real Time Animal Detect"
        onPress={() => navigation.navigate('realtimeanimaldetect')}
      />
      <Button
        title="Disease Detect"
        onPress={() => navigation.navigate('diseasedetect')}
      />
      <Button
        title="Behavior Detect"
        onPress={() => navigation.navigate('behaviordetect')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default HomeScreen;
