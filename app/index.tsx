import EmptyState from '@/components/EmptyState';
import ReminderItem from '@/components/ReminderItem';
import { Button, Card, Text } from '@/components/Themed';
import { useReminders } from '@/contexts/RemindersContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { FlatList, View } from 'react-native';

export default function Home() {
  const router = useRouter();
  const { reminders, remove, toggleEnabled, refreshMissedFlags } = useReminders();
  const { theme, settings, setTextScale, setThemeName } = useSettings();

  useEffect(() => {
    refreshMissedFlags();
    const id = setInterval(refreshMissedFlags, 60 * 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <FlatList
      accessibilityRole="list"
      style={{ flex: 1, backgroundColor: theme.colors.background, padding: 16 }}
      data={reminders}
      keyExtractor={item => item.id}
      ListHeaderComponent={
        <View style={{ marginBottom: 16 }}>
          <Text weight="700" style={{ fontSize: 24 * settings.textScale, marginBottom: 8 }}>Medication Reminders</Text>

          <Card style={{ marginBottom: 12 }}>
            <Text weight="600" style={{ marginBottom: 8 }}>Accessibility Settings</Text>
            <View style={{ flexDirection: settings.textScale > 1.2 ? 'column' : 'row', gap: 8, flexWrap: 'wrap', minWidth: 0 }}>
              <Button label="Normal Theme" variant={theme.name === 'normal' ? 'primary' : 'secondary'} onPress={() => setThemeName('normal')} accessibilityLabel="Switch to normal theme" fullWidth={settings.textScale > 1.2} />
              <Button label="High Contrast" variant={theme.name === 'high-contrast' ? 'primary' : 'secondary'} onPress={() => setThemeName('high-contrast')} accessibilityLabel="Switch to high contrast theme" fullWidth={settings.textScale > 1.2} />
            </View>
            <View accessibilityRole="adjustable" accessibilityLabel="Adjust text size" style={{ gap: 8 }}>
              <Text>Text size</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap', minWidth: 0 }}>
                <Button label="A-" variant="secondary" onPress={() => setTextScale(Math.max(0.75, settings.textScale - 0.1))} accessibilityLabel="Decrease text size" />
                <Button label="A+" variant="secondary" onPress={() => setTextScale(Math.min(1.75, settings.textScale + 0.1))} accessibilityLabel="Increase text size" />
                <Button label="Reset" variant="secondary" onPress={() => setTextScale(1)} accessibilityLabel="Reset text size" />
              </View>
              <Text style={{ marginTop: 4 }}>Current scale: {settings.textScale.toFixed(2)}×</Text>
            </View>
          </Card>

          <Button label="Add Reminder" onPress={() => router.push('/edit')} accessibilityLabel="Add a new medication reminder" />
        </View>
      }
      renderItem={({ item }) => (
        <ReminderItem
          r={item}
          onPress={() => router.push({ pathname: '/edit', params: { id: item.id } })}
          onToggle={() => toggleEnabled(item.id, !item.enabled)}
          onDelete={() => remove(item.id)}
        />
      )}
      ListEmptyComponent={<EmptyState />}
    />
  );
}
