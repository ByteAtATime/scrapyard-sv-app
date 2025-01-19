import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="attendance"
        options={{
          title: "Attendance",
        }}
      />
      <Stack.Screen
        name="config"
        options={{
          title: "Server Configuration",
        }}
      />
      <Stack.Screen
        name="award-points"
        options={{
          title: "Award Points",
        }}
      />
    </Stack>
  );
}
