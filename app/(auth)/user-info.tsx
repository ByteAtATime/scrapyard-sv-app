import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { Stack } from "expo-router";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { User } from "~/lib/user/types";
import { UserSelector } from "~/components/user/UserSelector";
import { CONFIG } from "~/lib/config";
import { NfcIdentification } from "~/lib/user/methods/nfc";
import { SearchIdentification } from "~/lib/user/methods/search";
import { useUserData } from "~/lib/api/swr";

export default function UserInfo() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { userData, isLoading, isError } = useUserData(selectedUser);

  return (
    <View className="flex-1 p-4">
      <Stack.Screen options={{ title: "User Info" }} />

      <UserSelector
        value={selectedUser}
        onChange={setSelectedUser}
        methods={[NfcIdentification, SearchIdentification]}
      />

      {isLoading && (
        <Text className="text-center mt-4">Loading user data...</Text>
      )}

      {isError && (
        <Text className="text-center mt-4 text-red-500">
          Error loading user data
        </Text>
      )}

      {userData && (
        <ScrollView className="mt-4">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Points</CardTitle>
            </CardHeader>
            <CardContent>
              <Text className="text-lg font-bold">
                Total: {userData.points.total}
              </Text>
              {userData.points.history.map((entry, index) => (
                <View key={index} className="mt-2">
                  <Text>
                    {entry.points} points - {entry.reason}
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    By {entry.author.name} on{" "}
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </Text>
                </View>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              {userData.attendance.map((entry, index) => (
                <View key={index} className="mt-2">
                  <Text className="font-medium">{entry.event.name}</Text>
                  <Text className="text-sm text-muted-foreground">
                    {entry.attended ? "Attended" : "Not attended"}
                    {entry.checkInTime &&
                      ` - Checked in at ${new Date(
                        entry.checkInTime
                      ).toLocaleTimeString()}`}
                  </Text>
                </View>
              ))}
            </CardContent>
          </Card>
        </ScrollView>
      )}
    </View>
  );
}
