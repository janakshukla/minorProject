import { View, Text, Alert, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import axios from 'axios';
import * as Location from 'expo-location';
import { useUserStore } from '../store/userstore';
import { startBackgroundLocationTracking } from '@/lib/locationtracking';

export default function ChildHome() {
  const { user } = useUserStore(); // Extract user object from the store

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
      await axios.post('https://minorproject-40ef.onrender.com/api/childdata/sosalert', {
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

  useEffect(() => {
    startBackgroundLocationTracking();
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-2xl font-bold text-gray-800 mb-6">Child Home</Text>

      <TouchableOpacity
        onPress={handleSOS}
        className="bg-red-600 px-6 py-3 rounded-xl shadow-lg active:opacity-80"
      >
        <Text className="text-white font-semibold text-lg">🚨 Send SOS</Text>
      </TouchableOpacity>
    </View>
  );
}
