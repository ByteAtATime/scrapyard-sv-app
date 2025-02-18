import React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import type { User, UserIdentificationMethod } from "~/lib/user/types";
import { UserCard } from "./UserCard";
import { X } from "~/lib/icons/X";
import { Button } from "../ui/button";

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
        <View className="relative">
          <UserCard user={value} />
          <Button
            onPress={() => onChange(null)}
            className="absolute right-6 top-1/2 -translate-y-1/2 -mr-3 h-6 w-6 items-center justify-center rounded-full"
            size="icon"
            variant="ghost"
          >
            <X size={14} className="text-muted-foreground" />
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
