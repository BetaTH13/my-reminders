import { Card, Text } from "@/components/Themed";
import { useSettings } from "@/contexts/SettingsContext";
import type { Reminder } from "@/lib/types";
import React from "react";
import { Pressable, View } from "react-native";

const WD = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function ReminderItem({
  r,
  onPress,
  onToggle,
  onDelete,
}: {
  r: Reminder;
  onPress: () => void;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const { theme, settings } = useSettings();
  const statusColor = !r.enabled
    ? theme.colors.disabled
    : r.missed
    ? theme.colors.danger
    : theme.colors.upcoming;

  const daysLabel =
    r.weekdays.length === 7
      ? "Every day"
      : r.weekdays.map((i) => WD[i]).join(", ");

  return (
    <Card
      style={{ marginBottom: 12 }}
      accessibilityRole="button"
      accessibilityLabel={`${r.name}, ${
        r.enabled ? (r.missed ? "missed" : "upcoming") : "disabled"
      }, ${daysLabel}`}
    >
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Edit ${r.name}`}
      >
        <View style={{ gap: 8 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text weight="700" style={{ marginBottom: 2 }} numberOfLines={1}>
                {r.name}
              </Text>
              <Text style={{ color: theme.colors.mutedText }} numberOfLines={1}>
                {daysLabel}
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text weight="700" style={{ color: statusColor }}>
                {`${r.hour.toString().padStart(2, "0")}:${r.minute
                  .toString()
                  .padStart(2, "0")}`}
              </Text>
              <Text
                style={{
                  color: statusColor,
                  fontSize: 14 * settings.textScale,
                }}
              >
                {!r.enabled ? "Disabled" : r.missed ? "Missed" : "Upcoming"}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <Pressable
              accessibilityRole="switch"
              accessibilityLabel={
                r.enabled ? "Disable reminder" : "Enable reminder"
              }
              onPress={onToggle}
              style={{
                backgroundColor: theme.colors.card,
                borderWidth: 1,
                borderColor: theme.colors.border,
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 12,
              }}
            >
              <Text>{r.enabled ? "Disable" : "Enable"}</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Delete ${r.name}`}
              onPress={onDelete}
              style={{
                backgroundColor: theme.colors.card,
                borderWidth: 1,
                borderColor: theme.colors.border,
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 12,
              }}
            >
              <Text>Delete</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Card>
  );
}
