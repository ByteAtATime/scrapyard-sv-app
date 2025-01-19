import React, { useState } from "react";
import { View, Alert } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { UserSelector } from "~/components/user/UserSelector";
import { EventSelector } from "~/components/events/EventSelector";
import { NfcIdentification } from "~/lib/user/methods/nfc";
import { SearchIdentification } from "~/lib/user/methods/search";
import { getServerUrl } from "~/lib/api/config";
import type { User } from "~/lib/user/types";
import type { Event } from "~/lib/events/types";

export default function AttendanceScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const markAttendance = async () => {
    if (!selectedUser || !selectedEvent) {
      Alert.alert("Error", "Please select both a user and an event");
      return;
    }

    try {
      setLoading(true);
      const serverUrl = await getServerUrl();

      if (!serverUrl) {
        Alert.alert("Error", "Please configure server URL first");
        router.push("/config");
        return;
      }

      const response = await fetch(`${serverUrl}/api/v1/attendance/mark`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          eventId: selectedEvent.id,
        }),
      });

      const body = await response.json();

      if (!response.ok || body.error) {
        throw new Error(body.error || "Failed to mark attendance");
      }

      Alert.alert("Success", "Attendance marked successfully");
      // Reset form
      setSelectedUser(null);
      setSelectedEvent(null);
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "Unknown error (failed to mark attendance)"
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 p-4 bg-background">
      <Stack.Screen
        options={{
          title: "Mark Attendance",
        }}
      />

      <Card>
        <CardHeader>
          <CardTitle>Mark Attendance</CardTitle>
        </CardHeader>
        <CardContent className="gap-4">
          <UserSelector
            value={selectedUser}
            onChange={setSelectedUser}
            methods={[NfcIdentification, SearchIdentification]}
          />

          <EventSelector value={selectedEvent} onChange={setSelectedEvent} />

          <Button
            onPress={markAttendance}
            disabled={loading || !selectedUser || !selectedEvent}
            className="mt-2"
          >
            <Text className="text-primary-foreground">
              {loading ? "Marking Attendance..." : "Mark Attendance"}
            </Text>
          </Button>
        </CardContent>
      </Card>
    </View>
  );
}
