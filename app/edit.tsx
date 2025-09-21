import AppHeader from '@/components/AppHeader';
import { Button, Card, Text } from '@/components/Themed';
import { useReminders } from '@/contexts/RemindersContext';
import { useSettings } from '@/contexts/SettingsContext';
import type { Reminder } from '@/lib/types';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useMemo as useMemoReact, useState } from 'react';
import { Alert, Platform, TextInput, View } from 'react-native';

export default function EditReminder() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const { reminders, add, update, toggleEnabled } = useReminders();
  const { theme, settings } = useSettings();

  const existing: Reminder | undefined = useMemo(() => reminders.find(r => r.id === params.id), [reminders, params.id]);

  const [name, setName] = useState(existing?.name ?? '');
  const [dosage, setDosage] = useState(existing?.dosage ?? '');
  const [hour, setHour] = useState(existing?.hour ?? 8);
  const [minute, setMinute] = useState(existing?.minute ?? 0);
  const [enabled, setEnabled] = useState(existing?.enabled ?? true);

   const [showIosPicker, setShowIosPicker] = useState(false);

  const save = async () => {
    if (!name.trim()) return Alert.alert('Name required', 'Please enter a medication name.');
    if (!dosage.trim()) return Alert.alert('Dosage required', 'Please enter a dosage.');

    if (existing) {
      await update(existing.id, { name, dosage, hour, minute });
      await toggleEnabled(existing.id, enabled);
    } else {
      await add({ name, dosage, hour, minute, enabled });
    }
    router.back();
  };

  const adjust = (setter: React.Dispatch<React.SetStateAction<number>>, min: number, max: number, delta: number) => () =>
    setter(v => Math.max(min, Math.min(max, v + delta)));

  const timeValue = useMemoReact(() => {
    const d = new Date();
    d.setHours(hour, minute, 0, 0);
    return d;
  }, [hour, minute]);

  const openTimePicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: timeValue,
        onChange: (_event, selected) => {
          if (!selected) return; // dismissed
          setHour(selected.getHours());
          setMinute(selected.getMinutes());
        },
        mode: 'time',
        is24Hour: true,
      });
    } else {
      setShowIosPicker(s => !s);
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
    fontSize: 18 * settings.textScale
  } as const;

  return (
    <View style={{ padding: 16, backgroundColor: theme.colors.background, flex: 1 }}>
      <AppHeader />
      <Card accessibilityLabel={existing ? 'Edit reminder fields' : 'Add reminder fields'}>
        <Text weight="700" style={{ marginBottom: 12 }}>{existing ? 'Edit Reminder' : 'Add Reminder'}</Text>

        <View style={{ gap: 12 }}>
          <View>
            <Text weight="600" style={{ marginBottom: 8 }}>Medication Name</Text>
            <TextInput
              accessibilityLabel="Medication name"
              value={name}
              onChangeText={setName}
              style={inputStyle}
              placeholder="e.g., Metformin"
              placeholderTextColor={theme.colors.mutedText}
            />
          </View>

          <View>
            <Text weight="600" style={{ marginBottom: 8 }}>Dosage</Text>
            <TextInput
              accessibilityLabel="Dosage"
              value={dosage}
              onChangeText={setDosage}
              style={inputStyle}
              placeholder="e.g., 500 mg"
              placeholderTextColor={theme.colors.mutedText}
            />
          </View>

          <Card>
            <Text weight="600" style={{ marginBottom: 8 }}>Time (24-hour)</Text>

            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', minWidth: 0 }}>
              <Button
                label={`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`}
                variant="secondary"
                onPress={openTimePicker}
                accessibilityLabel="Change reminder time"
              />
              <Text style={{ alignSelf: 'center' }}>Tap to change</Text>
            </View>

            {/* iOS inline picker (Android uses modal via DateTimePickerAndroid) */}
            {Platform.OS === 'ios' && showIosPicker && (
              <View style={{ marginTop: 8 }}>
                <DateTimePicker
                  value={timeValue}
                  mode="time"
                  is24Hour
                  display="spinner" // iOS-friendly wheel; change to 'compact' if you prefer
                  onChange={(_e, selected) => {
                    if (!selected) return;
                    setHour(selected.getHours());
                    setMinute(selected.getMinutes());
                  }}
                  themeVariant={theme.name === 'normal' ? 'light' : 'dark'}
                />
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                  <Button label="Done" onPress={() => setShowIosPicker(false)} accessibilityLabel="Close time picker" />
                </View>
              </View>
            )}

            <Text style={{ marginTop: 8 }}>
              Selected time: {hour.toString().padStart(2, '0')}:{minute.toString().padStart(2, '0')}
            </Text>
          </Card>

          <Card>
            <Text weight="600" style={{ marginBottom: 8 }}>Status</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Button label="Enabled" variant={enabled ? 'primary' : 'secondary'} onPress={() => setEnabled(true)} accessibilityLabel="Enable reminder" />
              <Button label="Disabled" variant={!enabled ? 'primary' : 'secondary'} onPress={() => setEnabled(false)} accessibilityLabel="Disable reminder" />
            </View>
          </Card>

          <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
            <Button label="Save" onPress={save} accessibilityLabel="Save reminder" />
            <Button label="Cancel" variant="secondary" onPress={() => router.back()} accessibilityLabel="Cancel and go back" />
          </View>
        </View>
      </Card>
    </View>
  );
}
