import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Stack, useRouter } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
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
          <Button onPress={handleSignOut} variant="outline" size="sm">
            <Text>Sign Out</Text>
          </Button>
        ),
      }}
    />
  );
}
