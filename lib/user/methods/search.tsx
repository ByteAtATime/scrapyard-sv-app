import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Search } from "~/lib/icons/Search";
import type { UserIdentificationMethod, User } from "../types";
import { ScrollView, TouchableOpacity } from "react-native";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";

const MOCK_USERS: User[] = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
  { id: "3", name: "Bob Johnson" },
  { id: "4", name: "Alice Brown" },
];

function SearchButton({
  onSelect,
  disabled,
}: {
  onSelect: (user: User) => void;
  disabled?: boolean;
}) {
  {
    const [search, setSearch] = useState("");

    const filteredUsers = MOCK_USERS.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex-1 flex-row items-center">
            <Search className="w-2 mr-2 text-muted-foreground" />
            <Text>Search Users</Text>
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
            {filteredUsers.map((user) => (
              <TouchableOpacity
                key={user.id}
                onPress={() => {
                  onSelect(user);
                }}
                className="p-3 border-b border-border"
              >
                <Text className="font-medium">{user.name}</Text>
                <Text className="text-sm text-muted-foreground">
                  ID: {user.id}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </DialogContent>
      </Dialog>
    );
  }
}

export const SearchIdentification: UserIdentificationMethod = {
  id: "search",
  name: "Search Users",
  Component: SearchButton,
};
