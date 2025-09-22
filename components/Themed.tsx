import { useSettings } from "@/contexts/SettingsContext";
import React from "react";
import {
  PressableProps,
  Pressable as RNPressable,
  Text as RNText,
  View as RNView,
  TextProps,
  ViewProps,
} from "react-native";

export const View: React.FC<ViewProps> = ({ style, ...rest }) => {
  const { theme } = useSettings();
  return (
    <RNView
      style={[{ backgroundColor: theme.colors.background }, style]}
      {...rest}
    />
  );
};

export const Card: React.FC<ViewProps> = ({ style, ...rest }) => {
  const { theme } = useSettings();
  return (
    <RNView
      style={[
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
          borderWidth: 1,
          borderRadius: 16,
          padding: 16,
        },
        style,
      ]}
      {...rest}
    />
  );
};

export const Text: React.FC<TextProps & { weight?: "400" | "600" | "700" }> = ({
  style,
  weight = "400",
  ...rest
}) => {
  const { theme, settings } = useSettings();
  return (
    <RNText
      style={[
        {
          color: theme.colors.text,
          fontSize: 18 * settings.textScale,
          fontWeight: weight as any,
        },
        style,
      ]}
      {...rest}
    />
  );
};

export const Button: React.FC<
  PressableProps & { label: string; variant?: "primary" | "secondary", fullWidth?: boolean } & {
    accessibilityLabel?: string;
  }
> = ({ label, variant = "primary", style, fullWidth = false, accessibilityLabel, ...rest }) => {
  const { theme, settings } = useSettings();
  const bg = variant === "primary" ? theme.colors.primary : theme.colors.card;
  const textColor =
    variant === "primary" ? theme.colors.buttonText : theme.colors.text;
  return (
    <RNPressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      style={({ pressed }) => [
        {
          backgroundColor: bg,
          paddingVertical: 16,
          paddingHorizontal: 20,
          borderRadius: 16,
          alignItems: "center",
          justifyContent: "center",
          opacity: pressed ? 0.8 : 1,
          maxWidth: '100%', 
          minWidth: 0,
          alignSelf: fullWidth ? 'stretch' : 'auto',
        },
        style,
      ]}
      {...rest}
    >
      <RNText
        style={{
          color: textColor,
          fontSize: 18 * settings.textScale,
          fontWeight: "700",
          textAlign: 'center',
          flexShrink: 1,
        }}
      >
        {label}
      </RNText>
    </RNPressable>
  );
};
