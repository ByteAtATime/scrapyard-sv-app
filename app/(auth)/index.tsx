import React from "react";
import { View, ScrollView, Pressable } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { ArrowRight } from "~/lib/icons/ArrowRight";
import { Gift } from "~/lib/icons/Gift";
import { Users } from "~/lib/icons/Users";
import { Utensils } from "~/lib/icons/Utensils";
import { Settings } from "~/lib/icons/Settings";
import { Map } from "~/lib/icons/Map";
import { CONFIG } from "~/lib/config";

export default function Index() {
  const router = useRouter();

  const actions = [
    {
      title: `Award ${CONFIG.POINTS_NAME}`,
      description: `Give ${CONFIG.POINTS_NAME.toLowerCase()} to participants`,
      icon: Gift,
      route: "/award-points",
      comingSoon: false,
    },
    {
      title: "Mark Attendance",
      description: "Record participant attendance",
      icon: Users,
      route: "/attendance",
      comingSoon: false,
    },
    {
      title: "Meal Tracking",
      description: "Track meal claims",
      icon: Utensils,
      route: "/meals",
      comingSoon: true,
    },
    {
      title: "Scavenger Hunt",
      description: "Manage scavenger hunt points",
      icon: Map,
      route: "/scavenger-hunt",
      comingSoon: true,
    },
    {
      title: "Server Config",
      description: "Configure API server URL",
      icon: Settings,
      route: "/config",
    },
  ];

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <Stack.Screen
        options={{
          title: "Home",
        }}
      />

      <View className="gap-4">
        {actions.map((action) => (
          <Pressable
            key={action.route}
            onPress={() =>
              !action.comingSoon && router.push(action.route as any)
            }
            disabled={action.comingSoon}
            accessibilityRole="button"
            accessibilityLabel={action.title}
            accessibilityHint={action.description}
            style={({ pressed }) => [pressed && { opacity: 0.7 }]}
          >
            <Card>
              <CardContent className="flex-row items-center p-4 gap-4">
                <action.icon className="h-6 w-6 text-muted-foreground" />

                <View className="flex-1">
                  <Text className="text-lg font-semibold">{action.title}</Text>
                  <Text className="text-sm text-muted-foreground">
                    {action.description}
                  </Text>
                  {action.comingSoon && (
                    <Text className="text-xs text-blue-500 mt-1">
                      Coming Soon
                    </Text>
                  )}
                </View>
                <ArrowRight className="h-4 w-4 text-black" />
              </CardContent>
            </Card>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}
