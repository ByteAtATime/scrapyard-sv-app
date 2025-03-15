import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { UserSelector } from "~/components/user/UserSelector";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { SearchIdentification } from "~/lib/user/methods/search";
import { NfcIdentification } from "~/lib/user/methods/nfc";
import { toast } from "sonner-native";
import { useMarkAttendance } from "~/lib/api/swr";
import { User } from "~/lib/user/types";
import {
  writeNfcUrl,
  readNfcTag,
  extractUserIdFromUrl,
  initNfc,
  cleanUpNfc,
  isNfcSupported,
} from "~/lib/nfc";
import { Spinner } from "~/components/ui/spinner";
import { AlertCircle } from "lucide-react-native";

// Hard-coded event ID for now
const EVENT_ID = 1;

export default function CheckInPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isWriting, setIsWriting] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isAttendanceMarked, setIsAttendanceMarked] = useState(false);
  const [nfcSupported, setNfcSupported] = useState<boolean | null>(null);
  const { markAttendance, isLoading: isMarkingAttendance } =
    useMarkAttendance();

  // Initialize NFC and check if it's supported
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
          toast.error("NFC is not supported on this device");
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

  // Reset state when user changes
  useEffect(() => {
    setIsVerified(false);
    setIsAttendanceMarked(false);
  }, [selectedUser]);

  const handleWriteNfc = async () => {
    if (!selectedUser) {
      toast.error("Please select a user first");
      return;
    }

    if (nfcSupported === false) {
      toast.error("NFC is not supported on this device");
      return;
    }

    try {
      setIsWriting(true);
      const url = `https://www.scrapyard.dev/users/${selectedUser.id}`;

      toast.info("Please tap NFC card to write user data");
      const success = await writeNfcUrl(url);

      if (success) {
        toast.success("Successfully wrote user data to NFC card");
      } else {
        toast.error("Failed to write to NFC card");
      }
    } catch (error) {
      console.error("Error writing to NFC card:", error);
      toast.error("Failed to write to NFC card");
    } finally {
      setIsWriting(false);
    }
  };

  const handleVerifyNfc = async () => {
    if (!selectedUser) {
      toast.error("Please select a user first");
      return;
    }

    if (nfcSupported === false) {
      toast.error("NFC is not supported on this device");
      return;
    }

    try {
      setIsReading(true);

      toast.info("Please tap NFC card to verify");
      const url = await readNfcTag();

      if (!url) {
        toast.error("No data found on NFC card");
        return;
      }

      const userId = extractUserIdFromUrl(url);

      if (userId === selectedUser.id) {
        setIsVerified(true);
        toast.success("NFC card verified successfully");
      } else {
        toast.error("NFC card verification failed - user ID mismatch");
      }
    } catch (error) {
      console.error("Error verifying NFC card:", error);
      toast.error("Failed to verify NFC card");
    } finally {
      setIsReading(false);
    }
  };

  const handleMarkAttendance = async () => {
    if (!selectedUser) {
      toast.error("Please select a user first");
      return;
    }

    if (!isVerified) {
      toast.error("Please verify the NFC card first");
      return;
    }

    try {
      await markAttendance({
        userId: selectedUser.id,
        eventId: EVENT_ID,
      });

      setIsAttendanceMarked(true);
      toast.success("Attendance marked successfully");
    } catch (error) {
      console.error("Error marking attendance:", error);
      toast.error("Failed to mark attendance");
    }
  };

  return (
    <ScrollView className="flex-1 p-4">
      <Text className="text-2xl font-bold mb-6">Check-In</Text>

      {nfcSupported === false && (
        <View className="bg-red-50 p-4 rounded-md border border-red-200 mb-6 flex-row items-center">
          <AlertCircle color="#EF4444" className="mr-2" size={20} />
          <Text className="text-red-800 flex-1">
            NFC is not supported on this device. You can still select users and
            mark attendance, but you won't be able to write or read NFC cards.
          </Text>
        </View>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Step 1: Select User</CardTitle>
        </CardHeader>
        <CardContent>
          <UserSelector
            value={selectedUser}
            onChange={setSelectedUser}
            methods={[SearchIdentification, NfcIdentification]}
          />
        </CardContent>
      </Card>

      {selectedUser && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Step 2: Write NFC Card</CardTitle>
          </CardHeader>
          <CardContent>
            <Text className="mb-4">
              Write the user ID to an NFC card. This will create a URL record
              with the format:
              <Text className="font-mono bg-muted p-1 rounded">
                https://www.scrapyard.dev/users/{selectedUser.id}
              </Text>
            </Text>
          </CardContent>
          <CardFooter>
            <Button
              onPress={handleWriteNfc}
              disabled={isWriting || nfcSupported === false}
              className="w-full"
            >
              {isWriting ? (
                <View className="flex-row items-center">
                  <Spinner className="mr-2" />
                  <Text>Writing to NFC Card...</Text>
                </View>
              ) : nfcSupported === false ? (
                "NFC Not Supported"
              ) : (
                "Write to NFC Card"
              )}
            </Button>
          </CardFooter>
        </Card>
      )}

      {selectedUser && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Step 3: Verify NFC Card</CardTitle>
          </CardHeader>
          <CardContent>
            <Text className="mb-4">
              Read the NFC card to verify that the user ID was written
              correctly.
            </Text>
            {isVerified && (
              <View className="bg-green-50 p-3 rounded-md border border-green-200 mb-4">
                <Text className="text-green-800">
                  ✓ NFC card verified successfully
                </Text>
              </View>
            )}
          </CardContent>
          <CardFooter>
            <Button
              onPress={handleVerifyNfc}
              disabled={isReading || nfcSupported === false}
              variant={isVerified ? "outline" : "default"}
              className="w-full"
            >
              {isReading ? (
                <View className="flex-row items-center">
                  <Spinner className="mr-2" />
                  <Text>Reading NFC Card...</Text>
                </View>
              ) : nfcSupported === false ? (
                "NFC Not Supported"
              ) : (
                "Verify NFC Card"
              )}
            </Button>
          </CardFooter>
        </Card>
      )}

      {selectedUser && (nfcSupported === false || isVerified) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Step 4: Mark Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <Text className="mb-4">
              Mark attendance for the user at the current event.
            </Text>
            {nfcSupported === false && !isVerified && (
              <View className="bg-yellow-50 p-3 rounded-md border border-yellow-200 mb-4">
                <Text className="text-yellow-800">
                  ⚠️ NFC verification was skipped because NFC is not supported
                  on this device.
                </Text>
              </View>
            )}
            {isAttendanceMarked && (
              <View className="bg-green-50 p-3 rounded-md border border-green-200 mb-4">
                <Text className="text-green-800">
                  ✓ Attendance marked successfully
                </Text>
              </View>
            )}
          </CardContent>
          <CardFooter>
            <Button
              onPress={handleMarkAttendance}
              disabled={
                isMarkingAttendance ||
                isAttendanceMarked ||
                (nfcSupported !== false && !isVerified)
              }
              variant={isAttendanceMarked ? "outline" : "default"}
              className="w-full"
            >
              {isMarkingAttendance ? (
                <View className="flex-row items-center">
                  <Spinner className="mr-2" />
                  <Text>Marking Attendance...</Text>
                </View>
              ) : (
                "Mark Attendance"
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
    </ScrollView>
  );
}
