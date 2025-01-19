import * as SecureStore from "expo-secure-store";
import { clerkKey } from "~/lib/constants";

export const tokenCache = {
  getToken: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  saveToken: (key: string, value: string) => {
    return SecureStore.setItemAsync(key, value);
  },
};

export const publishableKey = clerkKey; // You'll need to add this to your constants file
