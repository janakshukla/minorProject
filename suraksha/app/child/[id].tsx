import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import axios from "axios";
import { useRouter, useLocalSearchParams } from "expo-router";

export interface Location {
  id: string;
  childId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

export default function ChildLocation() {
  const router = useRouter();
  const { childId } = useLocalSearchParams();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const fetchChildLocation = async () => {
    try {
      const response = await axios.get(
        `https://your-backend-url.com/api/child/getlocation/${childId}`
      );
      setLocations(response.data);
    } catch (error) {
      console.error("Error fetching child location:", error);
      Alert.alert("Error", "Failed to fetch child location.");
    } finally {
      setLoading(false);
    }
  };

  const sendNotification = async () => {
    if (!title || !body) {
      Alert.alert("Error", "Please enter both title and body.");
      return;
    }

    try {
      const response = await axios.post(
        `https://your-backend-url.com/api/child/sendnotification`,
        {
          childId,
          title,
          body,
        }
      );
      Alert.alert("Success", "Notification sent successfully!");
    } catch (error) {
      console.error("Error sending notification:", error);
      Alert.alert("Error", "Failed to send notification.");
    }
  };

  useEffect(() => {
    fetchChildLocation();
  }, [childId]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (locations.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500 text-base">No location data available for this child.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: locations[0]?.latitude || 0,
          longitude: locations[0]?.longitude || 0,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {locations.map((location: Location, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title={`Location ${index + 1}`}
            description={`Timestamp: ${new Date(
              location.timestamp
            ).toLocaleString()}`}
          />
        ))}
      </MapView>

      {/* Notification Form */}
      <View className="p-4 bg-gray-100 rounded-t-2xl shadow-lg">
        <TextInput
          placeholder="Enter Notification Title"
          value={title}
          onChangeText={setTitle}
          className="border border-gray-300 rounded-lg px-4 py-2 mb-3 bg-white text-base"
        />
        <TextInput
          placeholder="Enter Notification Body"
          value={body}
          onChangeText={setBody}
          className="border border-gray-300 rounded-lg px-4 py-2 mb-3 bg-white text-base"
        />
        <TouchableOpacity
          onPress={sendNotification}
          className="bg-blue-600 rounded-lg py-3 items-center"
        >
          <Text className="text-white font-semibold text-base">Send Notification</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
