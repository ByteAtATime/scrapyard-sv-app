import NfcManager, { NfcTech, Ndef } from "react-native-nfc-manager";
import { Platform } from "react-native";

// Initialize NFC Manager
export const initNfc = async (): Promise<boolean> => {
  try {
    await NfcManager.start();
    return await NfcManager.isSupported();
  } catch (error) {
    console.error("Error initializing NFC:", error);
    return false;
  }
};

// Check if NFC is supported on the device
export const isNfcSupported = async (): Promise<boolean> => {
  try {
    return await NfcManager.isSupported();
  } catch (error) {
    console.error("Error checking NFC support:", error);
    return false;
  }
};

// Write a URL to an NFC tag
export const writeNfcUrl = async (url: string): Promise<boolean> => {
  try {
    // Request technology
    await NfcManager.requestTechnology(NfcTech.Ndef);

    // Create URL record
    const urlBytes = Ndef.encodeMessage([Ndef.uriRecord(url)]);

    // Write to tag
    if (urlBytes) {
      await NfcManager.ndefHandler.writeNdefMessage(urlBytes);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error writing NFC tag:", error);
    return false;
  } finally {
    // Cancel technology request
    NfcManager.cancelTechnologyRequest().catch(() => {});
  }
};

// Read NFC tag and extract URL
export const readNfcTag = async (): Promise<string | null> => {
  try {
    // Request technology
    await NfcManager.requestTechnology(NfcTech.Ndef);

    // Read tag
    const tag = await NfcManager.getTag();
    const ndefRecords = tag?.ndefMessage || [];

    // Find URL record
    for (const record of ndefRecords) {
      // Check if this is a URI record
      if (
        record.tnf === Ndef.TNF_WELL_KNOWN &&
        record.type &&
        Array.isArray(record.type) &&
        record.type.length === Ndef.RTD_URI.length &&
        record.type.every((byte, i) => Number(byte) === Number(Ndef.RTD_URI[i]))
      ) {
        // Extract URL from record
        if (record.payload && Array.isArray(record.payload)) {
          const url = Ndef.uri.decodePayload(new Uint8Array(record.payload));
          return url;
        }
      }
    }

    return null;
  } catch (error) {
    console.error("Error reading NFC tag:", error);
    return null;
  } finally {
    // Cancel technology request
    NfcManager.cancelTechnologyRequest().catch(() => {});
  }
};

// Extract user ID from URL
export const extractUserIdFromUrl = (url: string | null): number | null => {
  if (!url) return null;

  try {
    // Expected format: https://www.scrapyard.dev/users/[id]
    const match = url.match(/\/users\/(\d+)$/);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
    return null;
  } catch (error) {
    console.error("Error extracting user ID from URL:", error);
    return null;
  }
};

// Clean up NFC resources
export const cleanUpNfc = () => {
  NfcManager.cancelTechnologyRequest().catch(() => {});
};
