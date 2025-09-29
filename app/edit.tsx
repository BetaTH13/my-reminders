import AppHeader from "@/components/AppHeader";
import { Button, Card, Text } from "@/components/Themed";
import { useReminders } from "@/contexts/RemindersContext";
import { useSettings } from "@/contexts/SettingsContext";
import type { Reminder, Weekday } from "@/lib/types";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useMemo as useMemoReact, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


const WD_LABELS: { key: Weekday; label: string }[] = [
  { key: 0, label: "Mon" },
  { key: 1, label: "Tue" },
  { key: 2, label: "Wed" },
  { key: 3, label: "Thu" },
  { key: 4, label: "Fri" },
  { key: 5, label: "Sat" },
  { key: 6, label: "Sun" },
];

export default function EditReminder() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const { reminders, add, update, toggleEnabled } = useReminders();
  const { theme, settings } = useSettings();
  const insets = useSafeAreaInsets();

  const existing: Reminder | undefined = useMemo(
    () => reminders.find((r) => r.id === params.id),
    [reminders, params.id]
  );

  const [name, setName] = useState(existing?.name ?? "");
  const [hour, setHour] = useState(existing?.hour ?? 8);
  const [minute, setMinute] = useState(existing?.minute ?? 0);
  const [enabled, setEnabled] = useState(existing?.enabled ?? true);
  const [weekdays, setWeekdays] = useState<Weekday[]>(
    existing?.weekdays?.length ? existing.weekdays : [0, 1, 2, 3, 4, 5, 6]
  );

  const save = async () => {
    if (!name.trim()) {
      return Alert.alert("Name required", "Please enter a name or activity.");
    }
    if (!weekdays.length) {
      return Alert.alert("Select days", "Please choose at least one weekday.");
    }

    if (existing) {
      await update(existing.id, { name, hour, minute, weekdays });
      await toggleEnabled(existing.id, enabled);
    } else {
      await add({
        name,
        hour,
        minute,
        enabled,
        weekdays,
        notificationIds: [],
        missed: false,
        id: "",
      } as any);
    }
    router.back();
  };

  const timeValue = useMemoReact(() => {
    const d = new Date();
    d.setHours(hour, minute, 0, 0);
    return d;
  }, [hour, minute]);

  const openTimePicker = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: timeValue,
        onChange: (_event, selected) => {
          if (!selected) {
            return;
          }
          setHour(selected.getHours());
          setMinute(selected.getMinutes());
        },
        mode: "time",
        is24Hour: true,
        display: "spinner"
      });
    }
  };

  const inputStyle = {
    backgroundColor: theme.colors.card,
    color: theme.colors.text,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18 * settings.textScale,
  } as const;

  const toggleDay = (d: Weekday) => {
    setWeekdays((prev) =>
      prev.includes(d)
        ? prev.filter((x) => x !== d)
        : [...prev, d].sort((a, b) => a - b)
    );
  };

  const actionsStack = settings.textScale > 1.2;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <AppHeader title={existing ? 'Edit reminder' : 'Add reminder'} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 12,
            paddingBottom: insets.bottom + 110,
          }}
        >
          <Card accessibilityLabel={existing ? 'Edit reminder fields' : 'Add reminder fields'}>
            <Text weight="700" style={{ marginBottom: 12 }}>
              {existing ? 'Edit Reminder' : 'Add Reminder'}
            </Text>

            <View style={{ gap: 12 }}>
              {/* Name */}
              <View>
                <Text weight="600" style={{ marginBottom: 8 }}>
                  Reminder Name
                </Text>
                <TextInput
                  accessibilityLabel="Reminder name"
                  value={name}
                  onChangeText={setName}
                  style={inputStyle}
                  placeholder="e.g., Take medication"
                  placeholderTextColor={theme.colors.mutedText}
                  maxFontSizeMultiplier={2}
                />
              </View>

              {/* Time */}
              <Card>
                <Text weight="600" style={{ marginBottom: 8 }}>
                  Time (24-hour)
                </Text>

                {Platform.OS === 'ios' ? (
                  // Compact iOS control (small; opens native picker)
                  <DateTimePicker
                    value={timeValue}
                    mode="time"
                    display="compact" // smaller than spinner; reduces scroll
                    onChange={(_e, selected) => {
                      if (!selected) {
                        return;
                      } 
                      setHour(selected.getHours());
                      setMinute(selected.getMinutes());
                    }}
                    themeVariant={theme.name === 'normal' ? 'light' : 'dark'}
                    style={{ alignSelf: 'flex-start' }}
                  />
                ) : (
                  // Android uses a button that opens the clock dialog
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                      flexWrap: 'wrap',
                      minWidth: 0,
                    }}
                  >
                    <Button
                      label={`${hour.toString().padStart(2, '0')}:${minute
                        .toString()
                        .padStart(2, '0')}`}
                      variant="secondary"
                      onPress={openTimePicker}
                      accessibilityLabel="Change reminder time"
                    />
                    <Text style={{ alignSelf: 'center' }}>Tap to change</Text>
                  </View>
                )}
              </Card>

              {/* Weekdays */}
              <Card>
                <Text weight="600" style={{ marginBottom: 8 }}>
                  Weekdays
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 8,
                    minWidth: 0,
                  }}
                >
                  {WD_LABELS.map(({ key, label }) => {
                    const selected = weekdays.includes(key);
                    return (
                      <Button
                        key={key}
                        label={label}
                        variant={selected ? 'primary' : 'secondary'}
                        onPress={() => toggleDay(key)}
                        accessibilityLabel={`${label} ${
                          selected ? 'selected' : 'not selected'
                        }`}
                        style={{ paddingVertical: 12, paddingHorizontal: 14 }}
                      />
                    );
                  })}
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 8,
                    marginTop: 8,
                  }}
                >
                  <Button
                    label="All days"
                    variant="secondary"
                    onPress={() => setWeekdays([0, 1, 2, 3, 4, 5, 6])}
                    accessibilityLabel="Select all days"
                  />
                  <Button
                    label="Weekdays"
                    variant="secondary"
                    onPress={() => setWeekdays([0, 1, 2, 3, 4])}
                    accessibilityLabel="Select Monday to Friday"
                  />
                  <Button
                    label="Weekends"
                    variant="secondary"
                    onPress={() => setWeekdays([5, 6])}
                    accessibilityLabel="Select Saturday and Sunday"
                  />
                </View>
              </Card>

              {/* Status */}
              <Card>
                <Text weight="600" style={{ marginBottom: 8 }}>
                  Status
                </Text>
                <View
                  style={{
                    flexDirection: actionsStack ? 'column' : 'row',
                    gap: 8,
                    flexWrap: 'wrap',
                    minWidth: 0,
                  }}
                >
                  <Button
                    label="Enabled"
                    variant={enabled ? 'primary' : 'secondary'}
                    onPress={() => setEnabled(true)}
                    accessibilityLabel="Enable reminder"
                    fullWidth={actionsStack}
                  />
                  <Button
                    label="Disabled"
                    variant={!enabled ? 'primary' : 'secondary'}
                    onPress={() => setEnabled(false)}
                    accessibilityLabel="Disable reminder"
                    fullWidth={actionsStack}
                  />
                </View>
              </Card>
            </View>
          </Card>
        </ScrollView>

        {/* Sticky bottom actions: always reachable */}
        <View
          pointerEvents="box-none"
          style={{
            position: 'absolute',
            left: 24,
            right: 24,
            bottom: insets.bottom + 16,
          }}
        >
          <View
            style={{
              flexDirection: actionsStack ? 'column' : 'row',
              gap: 12,
            }}
          >
            <Button
              label="Save"
              onPress={save}
              accessibilityLabel="Save reminder"
              fullWidth={actionsStack}
            />
            <Button
              label="Cancel"
              variant="secondary"
              onPress={() => router.back()}
              accessibilityLabel="Cancel and go back"
              fullWidth={actionsStack}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
