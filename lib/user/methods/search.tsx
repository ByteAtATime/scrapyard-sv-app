import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Search } from "~/lib/icons/Search";
import type { UserIdentificationMethod, User } from "../types";
import { ScrollView, TouchableOpacity, View } from "react-native";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Spinner } from "~/components/ui/spinner";
import { useUsers } from "~/lib/api/swr";

function SearchButton({
  onSelect,
  disabled,
}: {
  onSelect: (user: User) => void;
  disabled?: boolean;
}) {
  const [search, setSearch] = useState("");
  const { users, isLoading, isError } = useUsers();

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex-1 flex-row items-center"
          disabled={disabled}
        >
          <Search className="mr-2 text-muted-foreground" size={20} />
          <Text style={{ lineHeight: 18 }}>Search Users</Text>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>Select User</DialogTitle>
          <DialogDescription>
            Search for a user by name or email.
          </DialogDescription>
        </DialogHeader>
        <Input
          placeholder="Search users..."
          value={search}
          onChangeText={setSearch}
          className="mb-4"
        />
        <ScrollView className="max-h-64">
          {isLoading ? (
            <View className="p-4 items-center">
              <Spinner />
            </View>
          ) : isError ? (
            <Text className="text-destructive p-4 text-center">
              Failed to load users
            </Text>
          ) : filteredUsers.length === 0 ? (
            <Text className="text-muted-foreground p-4 text-center">
              No users found
            </Text>
          ) : (
            filteredUsers.map((user) => (
              <TouchableOpacity
                key={user.id}
                onPress={() => {
                  onSelect(user);
                }}
                className="p-3 border-b border-border"
              >
                <Text className="font-medium">{user.name}</Text>
                <Text className="text-sm text-muted-foreground">
                  {user.email}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </DialogContent>
    </Dialog>
  );
}

export const SearchIdentification: UserIdentificationMethod = {
  id: "search",
  name: "Search Users",
  Component: SearchButton,
};
