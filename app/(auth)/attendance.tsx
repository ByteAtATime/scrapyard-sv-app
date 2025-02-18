import React, { useState } from "react";
import { View, Alert } from "react-native";
import { Stack } from "expo-router";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { UserSelector } from "~/components/user/UserSelector";
import { EventSelector } from "~/components/events/EventSelector";
import { NfcIdentification } from "~/lib/user/methods/nfc";
import { SearchIdentification } from "~/lib/user/methods/search";
import type { User } from "~/lib/user/types";
import type { Event } from "~/lib/events/types";
import { useEvents, useMarkAttendance } from "~/lib/api/swr";

export default function AttendanceScreen() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const {
    events,
    isLoading: eventsLoading,
    isError: eventsError,
  } = useEvents();
  const { markAttendance, isLoading } = useMarkAttendance();

  const handleMarkAttendance = async () => {
    if (!selectedUser || !selectedEvent) {
      Alert.alert("Error", "Please select both a user and an event");
      return;
    }

    try {
      await markAttendance({
        userId: selectedUser.id,
        eventId: selectedEvent.id,
      });

      Alert.alert(
        "Success",
        `Marked attendance for ${selectedUser.name} at ${selectedEvent.name}`
      );

      // Reset selections
      setSelectedUser(null);
      setSelectedEvent(null);
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to mark attendance"
      );
      console.error(error);
    }
  };

  return (
    <View className="flex-1 p-4">
      <Stack.Screen options={{ title: "Mark Attendance" }} />

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Select User</CardTitle>
        </CardHeader>
        <CardContent>
          <UserSelector
            value={selectedUser}
            onChange={setSelectedUser}
            methods={[NfcIdentification, SearchIdentification]}
          />
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Select Event</CardTitle>
        </CardHeader>
        <CardContent>
          {eventsLoading ? (
            <Text>Loading events...</Text>
          ) : eventsError ? (
            <Text className="text-red-500">Error loading events</Text>
          ) : (
            <EventSelector
              events={events || []}
              value={selectedEvent}
              onChange={setSelectedEvent}
            />
          )}
        </CardContent>
      </Card>

      <Button
        onPress={handleMarkAttendance}
        disabled={isLoading || !selectedUser || !selectedEvent}
      >
        <Text>{isLoading ? "Marking attendance..." : "Mark Attendance"}</Text>
      </Button>
    </View>
  );
}
