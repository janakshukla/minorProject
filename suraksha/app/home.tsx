import { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  Button,
  Alert,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import { User, useUserStore } from "@/store/userstore";

export default function Home() {
  const { user } = useUserStore((state) => state);
  const [childEmail, setChildEmail] = useState("");
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAddChild = async () => {
    if (!childEmail) {
      Alert.alert("Error", "Please enter the child's email.");
      return;
    }

    try {
      const response = await axios.post("https://minorproject-40ef.onrender.com/api/child/addchild", {
        email: childEmail,
        parentId: user?.id,
      });

      if (response.status === 200) {
        Alert.alert("Success", "Child added successfully!");
        setChildEmail("");
        fetchChildren();
      } else {
        Alert.alert("Error", "Failed to add child. Please try again.");
      }
    } catch (error) {
      console.error("Error adding child:", error);
      Alert.alert("Error", "An error occurred while adding the child.");
    }
  };

  const fetchChildren = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://minorproject-40ef.onrender.com/api/child/getallchild/${user?.id}`);
      setChildren(response.data);
    } catch (error) {
      console.error("Error fetching children:", error);
      Alert.alert("Error", "Failed to fetch children.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  const handleChildClick = (childId: string) => {
    router.push({
      pathname: "./child/[childId]",
      params: { childId: childId },
    });
  };

  return (
    <View className="flex-1 bg-white px-6 py-4">
      <Text className="text-xl font-semibold text-gray-800 mb-4">
        Welcome, Mr. {user?.name} ({user?.role})
      </Text>

      {/* Add Child Section */}
      <View className="mb-8">
        <Text className="text-base text-gray-700 mb-2">Add a Child by Email:</Text>
        <TextInput
          placeholder="Enter child's email"
          value={childEmail}
          onChangeText={setChildEmail}
          className="border border-gray-300 rounded-lg px-4 py-2 mb-3 bg-gray-50"
        />
        <TouchableOpacity
          onPress={handleAddChild}
          className="bg-blue-600 py-3 rounded-lg items-center shadow-md active:opacity-80"
        >
          <Text className="text-white font-semibold text-base">Add Child</Text>
        </TouchableOpacity>
      </View>

      {/* View All Children Section */}
      <View className="flex-1">
        <Text className="text-lg font-bold text-gray-800 mb-4">Your Children:</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#2563EB" />
        ) : children.length === 0 ? (
          <Text className="text-gray-600">No children found.</Text>
        ) : (
          <FlatList
            data={children}
            keyExtractor={(item: User) => item.id}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleChildClick(item.id)}
                className="mb-3 rounded-xl border border-gray-200 p-4 bg-white shadow-sm"
              >
                <Text className="text-base font-medium text-gray-900">👤 {item.name}</Text>
                <Text className="text-sm text-gray-600">{item.email}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  );
}
