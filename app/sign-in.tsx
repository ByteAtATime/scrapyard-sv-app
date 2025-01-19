import { useOAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { View } from "react-native";
import * as Linking from "expo-linking";
import { CONFIG } from "~/lib/config";

WebBrowser.maybeCompleteAuthSession();

export default function SignIn() {
  const router = useRouter();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onSignInPress = async () => {
    try {
      const redirectUrl = Linking.createURL("/");
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl,
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace("/(auth)");
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  };

  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-2xl font-bold mb-8">
        Welcome to {CONFIG.APP_NAME}
      </Text>
      <Button onPress={onSignInPress}>
        <Text className="text-primary-foreground font-medium">
          Sign in with Google
        </Text>
      </Button>
    </View>
  );
}
