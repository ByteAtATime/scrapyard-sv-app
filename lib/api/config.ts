import AsyncStorage from "@react-native-async-storage/async-storage";

const SERVER_URL_KEY = "@server_url";

export async function getServerUrl(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(SERVER_URL_KEY);
  } catch (error) {
    console.error("Failed to get server URL:", error);
    return null;
  }
}

export async function setServerUrl(url: string): Promise<void> {
  try {
    await AsyncStorage.setItem(SERVER_URL_KEY, url);
  } catch (error) {
    console.error("Failed to save server URL:", error);
    throw error;
  }
}
