import React from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import type { User, UserIdentificationMethod } from "~/lib/user/types";

interface Props {
  value: User | null;
  onChange: (user: User | null) => void;
  methods: UserIdentificationMethod[];
}

export function UserSelector({ value, onChange, methods }: Props) {
  return (
    <View className="gap-2">
      <Text className="text-sm font-medium">
        {value ? "Selected User" : "Select User"}
      </Text>

      {value ? (
        <View className="flex-row items-center justify-between p-2 border border-border rounded-md">
          <View>
            <Text className="font-medium">{value.name}</Text>
            <Text className="text-sm text-muted-foreground">
              ID: {value.id}
            </Text>
          </View>
          <Button
            variant="destructive"
            size="sm"
            onPress={() => onChange(null)}
          >
            <Text>Clear</Text>
          </Button>
        </View>
      ) : (
        <View className="flex-row gap-2">
          {methods.map((method) => (
            <method.Component
              key={method.id}
              onSelect={onChange}
              disabled={value !== null}
            />
          ))}
        </View>
      )}
    </View>
  );
}
