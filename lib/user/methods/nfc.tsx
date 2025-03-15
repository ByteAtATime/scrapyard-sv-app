import React, { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { SmartphoneNfc } from "~/lib/icons/SmartphoneNfc";
import type { UserIdentificationMethod, User } from "../types";
import { toast } from "sonner-native";
import {
  readNfcTag,
  extractUserIdFromUrl,
  initNfc,
  cleanUpNfc,
  isNfcSupported,
} from "~/lib/nfc";
import { useUserData } from "~/lib/api/swr";
import { Spinner } from "~/components/ui/spinner";
import { View } from "react-native";

function NfcButton({
  onSelect,
  disabled,
}: {
  onSelect: (user: User) => void;
  disabled?: boolean;
}) {
  const [isReading, setIsReading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [nfcSupported, setNfcSupported] = useState<boolean | null>(null);
  const { userData, isLoading } = useUserData(
    userId ? ({ id: userId } as User) : null
  );

  // Check if NFC is supported and initialize when component mounts
  useEffect(() => {
    const checkNfcSupport = async () => {
      try {
        // Initialize NFC
        await initNfc();

        // Check if NFC is supported
        const supported = await isNfcSupported();
        setNfcSupported(supported);

        if (!supported) {
          console.warn("NFC is not supported on this device");
        }
      } catch (error) {
        console.error("Failed to initialize NFC:", error);
        setNfcSupported(false);
        toast.error("Failed to initialize NFC");
      }
    };

    checkNfcSupport();

    // Clean up NFC when component unmounts
    return () => {
      cleanUpNfc();
    };
  }, []);

  // When user data is loaded, select the user
  useEffect(() => {
    if (userData?.data && userId) {
      onSelect(userData.data);
      setUserId(null);
      toast.success(`User ${userData.data.name} selected`);
    }
  }, [userData, userId, onSelect]);

  const handlePress = async () => {
    if (isReading) return;

    if (nfcSupported === false) {
      toast.error("NFC is not supported on this device");
      return;
    }

    try {
      setIsReading(true);
      toast.info("Please tap NFC card to scan");

      // Read NFC tag
      const url = await readNfcTag();
      if (!url) {
        toast.error("No URL found on NFC tag");
        return;
      }

      // Extract user ID from URL
      const id = extractUserIdFromUrl(url);
      if (!id) {
        toast.error("Invalid user ID on NFC tag");
        return;
      }

      // Set user ID to trigger data fetch
      setUserId(id);
    } catch (error) {
      console.error("Error reading NFC tag:", error);
      toast.error("Failed to read NFC tag");
    } finally {
      setIsReading(false);
    }
  };

  // If we're still checking NFC support, show a loading state
  if (nfcSupported === null) {
    return (
      <Button
        variant="outline"
        className="flex-1 flex-row items-center"
        disabled={true}
      >
        <Spinner className="mr-2" size="small" />
        <Text style={{ lineHeight: 18 }}>Checking NFC...</Text>
      </Button>
    );
  }

  // If NFC is not supported, show a disabled button with warning
  if (nfcSupported === false) {
    return (
      <View className="flex-1">
        <Button
          variant="outline"
          className="flex-1 flex-row items-center"
          disabled={true}
        >
          <SmartphoneNfc className="mr-2 text-muted-foreground" size={20} />
          <Text style={{ lineHeight: 18 }}>NFC Not Supported</Text>
        </Button>
      </View>
    );
  }

  return (
    <Button
      variant="outline"
      className="flex-1 flex-row items-center"
      onPress={handlePress}
      disabled={disabled || isReading || isLoading}
    >
      <SmartphoneNfc className="mr-2 text-muted-foreground" size={20} />
      {isReading ? (
        <View className="flex-row items-center">
          <Spinner className="mr-1" size="small" />
          <Text style={{ lineHeight: 18 }}>Reading...</Text>
        </View>
      ) : isLoading ? (
        <View className="flex-row items-center">
          <Spinner className="mr-1" size="small" />
          <Text style={{ lineHeight: 18 }}>Loading...</Text>
        </View>
      ) : (
        <Text style={{ lineHeight: 18 }}>Scan NFC Card</Text>
      )}
    </Button>
  );
}

export const NfcIdentification: UserIdentificationMethod = {
  id: "nfc",
  name: "Scan NFC Card",
  Component: NfcButton,
};
