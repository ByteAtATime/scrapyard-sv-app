import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { Calendar } from "~/lib/icons/Calendar";
import { MOCK_EVENTS } from "~/lib/events/mock";
import type { Event } from "~/lib/events/types";

interface Props {
  value: Event | null;
  onChange: (event: Event | null) => void;
}

export function EventSelector({ value, onChange }: Props) {
  const [search, setSearch] = useState("");

  const filteredEvents = MOCK_EVENTS.filter(
    (event) =>
      event.name.toLowerCase().includes(search.toLowerCase()) ||
      new Date(event.date).toLocaleDateString().includes(search)
  );

  return (
    <View className="gap-2">
      <Text className="text-sm font-medium">
        {value ? "Selected Event" : "Select Event"}
      </Text>

      {value ? (
        <View className="flex-row items-center justify-between p-2 border border-border rounded-md">
          <View>
            <Text className="font-medium">{value.name}</Text>
            <Text className="text-sm text-muted-foreground">
              {new Date(value.date).toLocaleString()}
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
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full flex-row items-center">
              <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
              <Text>Choose Event</Text>
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full">
            <DialogHeader>
              <DialogTitle>Select Event</DialogTitle>
            </DialogHeader>
            <Input
              placeholder="Search events..."
              value={search}
              onChangeText={setSearch}
              className="mb-4"
            />
            <ScrollView className="max-h-64">
              {filteredEvents.map((event) => (
                <TouchableOpacity
                  key={event.id}
                  onPress={() => onChange(event)}
                  className="p-3 border-b border-border"
                >
                  <Text className="font-medium">{event.name}</Text>
                  <Text className="text-sm text-muted-foreground">
                    {new Date(event.date).toLocaleString()}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </DialogContent>
        </Dialog>
      )}
    </View>
  );
}
