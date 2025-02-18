import React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { User } from "~/lib/user/types";
import { User as UserIcon } from "~/lib/icons/User";

interface Props {
  user: User;
  status?: {
    type: "success" | "error";
    message: string;
    timestamp?: boolean;
  };
  compact?: boolean;
}

export function UserCard({ user, status, compact = false }: Props) {
  return (
    <View
      className={`rounded-lg border-border border p-3 ${
        status?.type === "error"
          ? "border-red-500 bg-destructive/30"
          : status?.type === "success"
          ? "bg-muted/50"
          : "bg-background"
      }`}
    >
      <View className="flex-row items-center gap-3">
        <View className="flex-row items-center flex-1 gap-4">
          <View
            className={`items-center justify-center rounded-full bg-muted ${
              compact ? "h-8 w-8" : "h-10 w-10"
            }`}
          >
            <UserIcon
              className={`text-muted-foreground ${
                compact ? "h-4 w-4" : "h-5 w-5"
              }`}
            />
          </View>

          <View>
            <Text className="font-medium text-foreground">{user.name}</Text>
            <Text className="text-sm text-muted-foreground">{user.email}</Text>

            {!compact && (
              <View className="mt-2 flex-row flex-wrap gap-2">
                <View className="rounded-md bg-primary/10 px-2 py-0.5">
                  <Text className="text-xs text-primary">ID: {user.id}</Text>
                </View>
                <View className="rounded-md bg-primary/10 px-2 py-0.5">
                  <Text className="text-xs text-primary">
                    {user.totalPoints} Points
                  </Text>
                </View>
                {user.isOrganizer && (
                  <View className="rounded-md bg-blue-500/10 px-2 py-0.5">
                    <Text className="text-xs text-blue-500">Organizer</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>

        {status && (
          <View className="items-end">
            <Text
              className={
                status.type === "error" ? "text-red-600" : "text-green-600"
              }
              style={{ fontWeight: "500" }}
            >
              {status.message}
            </Text>
            {status.timestamp && (
              <Text className="text-xs text-muted-foreground">
                {new Date().toLocaleString()}
              </Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
}
