// components/AppHeader.tsx
import { Text } from "@/components/Themed";
import { useSettings } from "@/contexts/SettingsContext";
import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  title?: string;
  showSettingsButton?: boolean;
};

export default function AppHeader({
  title = "My Reminders",
  showSettingsButton = true,
}: Props) {
  const insets = useSafeAreaInsets();
  const { theme, settings } = useSettings();
  const router = useRouter();
  const pathname = usePathname();

  const showBtn = showSettingsButton && pathname !== "/settings";
  const iconSize = Math.round(24 * Math.min(1.4, settings.textScale));

  return (
    <View
      accessible
      accessibilityRole="header"
      accessibilityLabel={`${title} header`}
      style={{
        paddingTop: insets.top + 12,
        paddingBottom: 12,
        paddingHorizontal: 24,
        backgroundColor: theme.colors.background,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Text
        weight="700"
        style={{ fontSize: 28 * settings.textScale, letterSpacing: 0.3 }}
      >
        {title}
      </Text>

      {showBtn ? (
        <Pressable
          onPress={() => router.push("/settings")}
          accessibilityRole="button"
          accessibilityLabel="Open settings"
          hitSlop={12}
          style={{
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.card,
          }}
        >
           <Ionicons name="settings-outline" size={iconSize} color={theme.colors.text} />
        </Pressable>
      ) : (
        <View style={{ width: 1 }} />
      )}
    </View>
  );
}
