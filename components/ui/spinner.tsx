import { ActivityIndicator, View } from "react-native";
import { cn } from "~/lib/utils";

interface SpinnerProps {
  size?: number | "small" | "large";
  className?: string;
  color?: string;
}

export function Spinner({ size = "small", className, color }: SpinnerProps) {
  return (
    <View className={cn("flex-row items-center justify-center", className)}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}
