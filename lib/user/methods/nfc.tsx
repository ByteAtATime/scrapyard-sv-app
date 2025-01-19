import React from "react";
import { Alert } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { SmartphoneNfc } from "~/lib/icons/SmartphoneNfc";
import type { UserIdentificationMethod, User } from "../types";

// Mock NFC reading for now
async function readNfcTag(): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("user_123");
    }, 1000);
  });
}

function NfcButton({
  onSelect,
  disabled,
}: {
  onSelect: (user: User) => void;
  disabled?: boolean;
}) {
  const handlePress = async () => {
    try {
      const userId = await readNfcTag();
      // In reality, you'd fetch user details from your API
      onSelect({
        id: userId,
        name: "John Doe",
      });
    } catch (error) {
      Alert.alert("Error", "Failed to read NFC tag");
    }
  };

  return (
    <Button
      variant="outline"
      className="flex-1 flex-row items-center"
      onPress={handlePress}
      disabled={disabled}
    >
      <SmartphoneNfc className="!w-2 !h-2 mr-2 text-muted-foreground" />
      <Text>Scan NFC Card</Text>
    </Button>
  );
}

export const NfcIdentification: UserIdentificationMethod = {
  id: "nfc",
  name: "Scan NFC Card",
  Component: NfcButton,
};
