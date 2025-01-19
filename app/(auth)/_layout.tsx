import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Stack, useRouter } from "expo-router";
import { ActivityIndicator, View, Pressable, Text } from "react-native";

export default function AuthLayout() {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/sign-in");
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerRight: () => (
          <Pressable
            onPress={handleSignOut}
            className="mr-4 bg-destructive px-3 py-1.5 rounded-md"
          >
            <Text className="text-destructive-foreground font-medium">
              Sign Out
            </Text>
          </Pressable>
        ),
      }}
    />
  );
}
