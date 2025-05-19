import { View, Text, Button, Alert } from 'react-native';
import React, { useEffect } from 'react';
import axios from 'axios';
import * as Location from 'expo-location';
import { useUserStore } from '../store/userstore';
import { startBackgroundLocationTracking } from '@/lib/locationtracking';

export default function ChildHome() {
  const { user } = useUserStore(); // Extract user object from the store

  // Function to handle SOS button press
  const handleSOS = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    try {
      await axios.post('https://your-endpoint.com/sos', {
        latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      timestamp: new Date().toISOString(),
      });
      Alert.alert('SOS Sent', 'Your SOS alert has been sent successfully.');
    } catch (error) {
      console.error('Error sending SOS:', error);
      Alert.alert('Error', 'Failed to send SOS alert.');
    }
  };

  // Start background location tracking
  useEffect(() => {
    startBackgroundLocationTracking();
  }, []);

  return (
    <View>
      <Text>Child Home</Text>
      <Button title="SOS" onPress={handleSOS} />
    </View>
  );
}