import React, { useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { Calendar } from "~/lib/icons/Calendar";
import type { Event } from "~/lib/events/types";

interface Props {
  events: Event[];
  value: Event | null;
  onChange: (event: Event | null) => void;
}

export function EventSelector({ events, value, onChange }: Props) {
  const [search, setSearch] = useState("");

  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(search.toLowerCase()) ||
      new Date(event.date).toLocaleDateString().includes(search)
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex-1 flex-row items-baseline">
          <Calendar className="mr-2 text-muted-foreground" size={20} />
          <Text style={{ lineHeight: 18 }}>
            {value ? value.name : "Select Event"}
          </Text>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>Select Event</DialogTitle>
          <DialogDescription>
            Choose an event to mark attendance for
          </DialogDescription>
        </DialogHeader>

        <Input
          value={search}
          onChangeText={setSearch}
          placeholder="Search events..."
          className="mb-4"
        />

        <ScrollView className="max-h-64">
          {filteredEvents.map((event) => (
            <TouchableOpacity
              key={event.id}
              onPress={() => {
                onChange(event);
                setSearch("");
              }}
              className="p-3 border-b border-border"
            >
              <Text className="font-medium">{event.name}</Text>
              <Text className="text-sm text-muted-foreground">
                {new Date(event.date).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </DialogContent>
    </Dialog>
  );
}
