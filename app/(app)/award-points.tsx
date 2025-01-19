import React, { useState } from "react";
import { View, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { getServerUrl } from "~/lib/api/config";
import { UserSelector } from "~/components/user/UserSelector";
import { NfcIdentification } from "~/lib/user/methods/nfc";
import { SearchIdentification } from "~/lib/user/methods/search";
import type { User } from "~/lib/user/types";

type AwardPointsPayload = {
  userId: string;
  amount: number;
  reason: string;
  metadata?: object;
};

export default function AwardPointsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    amount: 0,
    reason: "",
  });

  const awardPoints = async () => {
    if (!selectedUser) {
      Alert.alert("Error", "Please select a user first");
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

      const payload = {
        userId: selectedUser.id,
        amount: formData.amount,
        reason: formData.reason,
      };

      const response = await fetch(`${serverUrl}/api/v1/points/award`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const body = await response.json();

      if (!response.ok || body.error) {
        throw new Error(body.error || "Failed to award points");
      }

      Alert.alert("Success", "Points awarded successfully");
      setFormData({ amount: 0, reason: "" });
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "Unknown error (failed to award points)"
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 p-4 bg-background">
      <Card>
        <CardHeader>
          <CardTitle>Award Points</CardTitle>
        </CardHeader>
        <CardContent className="gap-4">
          <UserSelector
            value={selectedUser}
            onChange={setSelectedUser}
            methods={[NfcIdentification, SearchIdentification]}
          />

          <View className="gap-1.5">
            <Text className="text-sm text-foreground font-medium">Points</Text>
            <Input
              placeholder="Enter points amount"
              keyboardType="numeric"
              value={formData.amount.toString()}
              onChangeText={(text) =>
                setFormData({ ...formData, amount: parseInt(text) || 0 })
              }
            />
          </View>

          <View className="gap-1.5">
            <Text className="text-sm text-foreground font-medium">Reason</Text>
            <Input
              placeholder="Enter reason"
              value={formData.reason}
              onChangeText={(text) =>
                setFormData({ ...formData, reason: text })
              }
            />
          </View>

          <Button onPress={awardPoints} disabled={loading} className="mt-2">
            <Text className="text-primary-foreground">
              {loading ? "Awarding Points..." : "Award Points"}
            </Text>
          </Button>
        </CardContent>
      </Card>
    </View>
  );
}
