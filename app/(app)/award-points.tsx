import React, { useState } from "react";
import { View, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { getServerUrl } from "~/lib/api/config";

type AwardPointsPayload = {
  userId: string;
  amount: number;
  reason: string;
  metadata?: object;
};

export default function AwardPointsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AwardPointsPayload>({
    userId: "",
    amount: 0,
    reason: "",
  });

  const awardPoints = async () => {
    try {
      setLoading(true);
      const serverUrl = await getServerUrl();

      if (!serverUrl) {
        Alert.alert("Error", "Please configure server URL first");
        router.push("/config");
        return;
      }

      const response = await fetch(`${serverUrl}/api/v1/points/award`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const body = await response.json();

      if (!response.ok || body.error) {
        throw new Error(body.error || "Failed to award points");
      }

      Alert.alert("Success", "Points awarded successfully");
      setFormData({ userId: "", amount: 0, reason: "" });
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
          <View className="gap-1.5">
            <Text className="text-sm text-foreground font-medium">User ID</Text>
            <Input
              placeholder="Enter user ID"
              value={formData.userId}
              onChangeText={(text) =>
                setFormData({ ...formData, userId: text })
              }
            />
          </View>

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
