import React, { useState } from "react";
import { View, Alert } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { UserSelector } from "~/components/user/UserSelector";
import { NfcIdentification } from "~/lib/user/methods/nfc";
import { SearchIdentification } from "~/lib/user/methods/search";
import type { User } from "~/lib/user/types";
import { CONFIG } from "~/lib/config";
import { awardPoints } from "~/lib/api/swr";

export default function AwardPointsScreen() {
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    amount: 0,
    reason: "",
  });

  const handleAwardPoints = async () => {
    if (!selectedUser) {
      Alert.alert("Error", "Please select a user first");
      return;
    }

    try {
      setLoading(true);
      await awardPoints({
        userId: selectedUser.id,
        amount: formData.amount,
        reason: formData.reason,
      });

      Alert.alert(
        "Success",
        `Awarded ${formData.amount} ${CONFIG.POINTS_NAME} to ${selectedUser.name}`
      );

      // Reset form
      setSelectedUser(null);
      setFormData({ amount: 0, reason: "" });
    } catch (error) {
      Alert.alert("Error", "Failed to award points");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 p-4">
      <Stack.Screen options={{ title: `Award ${CONFIG.POINTS_NAME}` }} />

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
          <CardTitle>Award Details</CardTitle>
        </CardHeader>
        <CardContent className="gap-4">
          <View>
            <Text className="mb-2">Amount</Text>
            <Input
              keyboardType="numeric"
              value={formData.amount.toString()}
              onChangeText={(text) =>
                setFormData((prev) => ({
                  ...prev,
                  amount: parseInt(text) || 0,
                }))
              }
            />
          </View>

          <View>
            <Text className="mb-2">Reason</Text>
            <Input
              value={formData.reason}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, reason: text }))
              }
              placeholder="Why are you awarding points?"
            />
          </View>
        </CardContent>
      </Card>

      <Button
        onPress={handleAwardPoints}
        disabled={
          loading || !selectedUser || !formData.amount || !formData.reason
        }
      >
        <Text>{loading ? "Awarding..." : `Award ${CONFIG.POINTS_NAME}`}</Text>
      </Button>
    </View>
  );
}
