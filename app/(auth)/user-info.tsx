import React, { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import { Stack } from "expo-router";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { User } from "~/lib/user/types";
import { UserSelector } from "~/components/user/UserSelector";
import { CONFIG } from "~/lib/config";
import { getServerUrl } from "~/lib/api/config";
import { NfcIdentification } from "~/lib/user/methods/nfc";
import { SearchIdentification } from "~/lib/user/methods/search";

interface UserResponse {
  points: {
    total: number;
    history: Array<{
      points: number;
      reason: string;
      author: {
        id: string;
        name: string;
        role: string;
      };
      timestamp: Date;
    }>;
  };
  attendance: Array<{
    event: {
      id: number;
      name: string;
      description: string;
      startTime: Date;
      endTime: Date;
      type: "workshop" | "meal" | "activity";
    };
    attended: boolean;
    checkInTime?: Date;
  }>;
}

export default function UserInfo() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [serverUrl, setServerUrl] = useState<string | null>(null);

  useEffect(() => {
    getServerUrl().then(setServerUrl);
  }, []);

  const fetchUserData = async (user: User) => {
    if (!serverUrl) return;

    setLoading(true);
    try {
      const response = await fetch(`${serverUrl}/api/v1/users/${user.id}`, {
        headers: {
          "x-user-id": "admin1",
        },
      });
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedUser) {
      fetchUserData(selectedUser);
    }
  }, [selectedUser, serverUrl]);

  if (!serverUrl) {
    return (
      <View className="flex-1 p-4">
        <Text>Please configure the server URL in settings first.</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "User Information" }} />
      <ScrollView className="flex-1 p-4">
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

        {loading && (
          <Card className="mb-4">
            <CardContent>
              <Text>Loading user data...</Text>
            </CardContent>
          </Card>
        )}

        {userData && (
          <>
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>{CONFIG.POINTS_NAME} History</CardTitle>
              </CardHeader>
              <CardContent>
                <Text className="text-lg font-bold mb-2">
                  Total {CONFIG.POINTS_NAME}: {userData.points.total}
                </Text>
                {userData.points.history.map((entry, index) => (
                  <View
                    key={index}
                    className="mb-2 p-2 bg-secondary rounded-lg"
                  >
                    <Text>
                      {entry.points} points - {entry.reason}
                    </Text>
                    <Text className="text-sm text-muted-foreground">
                      By {entry.author.name} ({entry.author.role})
                    </Text>
                    <Text className="text-sm text-muted-foreground">
                      {new Date(entry.timestamp).toLocaleString()}
                    </Text>
                  </View>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attendance History</CardTitle>
              </CardHeader>
              <CardContent>
                {userData.attendance.map((entry, index) => (
                  <View
                    key={index}
                    className="mb-2 p-2 bg-secondary rounded-lg"
                  >
                    <Text className="font-bold">{entry.event.name}</Text>
                    <Text>{entry.event.description}</Text>
                    <Text className="text-sm text-muted-foreground">
                      {new Date(entry.event.startTime).toLocaleString()} -{" "}
                      {new Date(entry.event.endTime).toLocaleString()}
                    </Text>
                    <Text>
                      Status: {entry.attended ? "Attended" : "Not Attended"}
                      {entry.checkInTime &&
                        ` (Checked in: ${new Date(
                          entry.checkInTime
                        ).toLocaleString()})`}
                    </Text>
                  </View>
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </ScrollView>
    </>
  );
}
