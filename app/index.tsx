import AppHeader from '@/components/AppHeader';
import EmptyState from '@/components/EmptyState';
import ReminderItem from '@/components/ReminderItem';
import { Button } from '@/components/Themed';
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
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 0, paddingBottom: 32 }}
      data={reminders}
      keyExtractor={item => item.id}
      ListHeaderComponent={
        <View style={{ marginBottom: 16 }}>
          <AppHeader />

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
