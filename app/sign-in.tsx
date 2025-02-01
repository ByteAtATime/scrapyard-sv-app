import { useOAuth, useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { View, TextInput } from "react-native";
import * as Linking from "expo-linking";
import { CONFIG } from "~/lib/config";
import { useState, useCallback } from "react";
import { Spinner } from "~/components/ui/spinner";

WebBrowser.maybeCompleteAuthSession();

export default function SignIn() {
  const router = useRouter();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const { signIn, setActive, isLoaded } = useSignIn();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);

  const onSignInWithGooglePress = async () => {
    try {
      setIsLoadingGoogle(true);
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
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) return;

    try {
      setIsLoadingEmail(true);
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(auth)");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      console.error("Sign in error:", err);
    } finally {
      setIsLoadingEmail(false);
    }
  }, [isLoaded, emailAddress, password]);

  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-2xl font-bold mb-8">
        Welcome to {CONFIG.APP_NAME}
      </Text>

      <View className="w-full max-w-sm space-y-4 flex-col gap-2">
        <TextInput
          className="w-full bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Email address"
          onChangeText={setEmailAddress}
          editable={!isLoadingEmail}
        />
        <TextInput
          className="w-full bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
          value={password}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={setPassword}
          editable={!isLoadingEmail}
        />
        <Button
          onPress={onSignInPress}
          className="w-full"
          disabled={isLoadingEmail}
        >
          <View className="flex-row items-center justify-center gap-2">
            {isLoadingEmail && <Spinner color="white" />}
            <Text className="text-primary-foreground font-medium">
              {isLoadingEmail ? "Signing in..." : "Sign in with Email"}
            </Text>
          </View>
        </Button>
      </View>

      <View className="flex-row items-center max-w-sm my-2">
        <View className="flex-1 h-[1px] bg-gray-300" />
        <Text className="text-gray-500 px-4">or</Text>
        <View className="flex-1 h-[1px] bg-gray-300" />
      </View>

      <View className="w-full max-w-sm">
        <Button
          onPress={onSignInWithGooglePress}
          variant="outline"
          className="w-full"
          disabled={isLoadingGoogle}
        >
          <View className="flex-row items-center justify-center gap-2">
            {isLoadingGoogle && <Spinner />}
            <Text className="font-medium">
              {isLoadingGoogle ? "Signing in..." : "Sign in with Google"}
            </Text>
          </View>
        </Button>
      </View>
    </View>
  );
}
