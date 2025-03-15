import { Stack } from "expo-router";
import { CONFIG } from "~/lib/config";

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
          title: `Award ${CONFIG.POINTS_NAME}`,
        }}
      />
      <Stack.Screen
        name="check-in"
        options={{
          title: "Check-In",
        }}
      />
    </Stack>
  );
}
