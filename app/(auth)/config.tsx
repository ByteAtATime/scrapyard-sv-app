import React, { useState, useEffect } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { toast } from "sonner-native";

const SERVER_URL_KEY = "@server_url";

export default function ConfigScreen() {
  const [serverUrl, setServerUrl] = useState("");

  useEffect(() => {
    loadSavedUrl();
  }, []);

  const loadSavedUrl = async () => {
    try {
      const savedUrl = await AsyncStorage.getItem(SERVER_URL_KEY);
      if (savedUrl) {
        setServerUrl(savedUrl);
      }
    } catch {
      toast.error("Failed to load saved server URL");
    }
  };

  const saveServerUrl = async () => {
    if (!serverUrl) {
      toast.error("Please enter a server URL");
      return;
    }

    try {
      // Basic URL validation
      new URL(serverUrl);

      await AsyncStorage.setItem(SERVER_URL_KEY, serverUrl);
      toast.success("Server URL saved successfully");
    } catch {
      toast.error("Please enter a valid URL");
    }
  };

  return (
    <View className="flex-1 p-4 bg-white">
      <Stack.Screen
        options={{
          title: "Server Configuration",
        }}
      />

      <Text className="text-lg mb-2">Server Configuration</Text>
      <TextInput
        className="border border-gray-300 rounded-md p-2 mb-4"
        value={serverUrl}
        onChangeText={setServerUrl}
        placeholder="Enter server URL (e.g., http://localhost:5173)"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TouchableOpacity
        className="bg-blue-500 rounded-md p-3"
        onPress={saveServerUrl}
      >
        <Text className="text-white text-center">Save Configuration</Text>
      </TouchableOpacity>
    </View>
  );
}
