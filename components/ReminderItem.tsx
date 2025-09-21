import { Card, Text } from '@/components/Themed';
import { useSettings } from '@/contexts/SettingsContext';
import type { Reminder } from '@/lib/types';
import React from 'react';
import { Pressable, View } from 'react-native';

export default function ReminderItem({ r, onPress, onToggle, onDelete }: { r: Reminder; onPress: () => void; onToggle: () => void; onDelete: () => void; }) {
  const { theme, settings } = useSettings();
  const statusColor = !r.enabled ? theme.colors.disabled : r.missed ? theme.colors.danger : theme.colors.upcoming;

  return (
    <Card style={{ marginBottom: 12 }} accessibilityRole="button" accessibilityLabel={`${r.name}, ${r.dosage}, ${r.enabled ? (r.missed ? 'missed' : 'upcoming') : 'disabled'}`}>
      <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`Edit ${r.name}`}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <Text weight="700" style={{ marginBottom: 4 }}>{r.name}</Text>
            <Text style={{ color: theme.colors.mutedText }}>{r.dosage}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text weight="700" style={{ color: statusColor }}>
              {`${r.hour.toString().padStart(2, '0')}:${r.minute.toString().padStart(2, '0')}`}
            </Text>
            <Text style={{ color: statusColor, fontSize: 14 * settings.textScale }}>
              {!r.enabled ? 'Disabled' : r.missed ? 'Missed' : 'Upcoming'}
            </Text>
          </View>
        </View>
      </Pressable>

      <View style={{ flexDirection: 'row', marginTop: 12, gap: 10 }}>
        <Pressable accessibilityRole="switch" accessibilityLabel={r.enabled ? 'Disable reminder' : 'Enable reminder'} onPress={onToggle}
          style={{ backgroundColor: theme.colors.card, borderWidth: 1, borderColor: theme.colors.border, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12 }}>
          <Text>{r.enabled ? 'Disable' : 'Enable'}</Text>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel={`Delete ${r.name}`} onPress={onDelete}
          style={{ backgroundColor: theme.colors.card, borderWidth: 1, borderColor: theme.colors.border, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12 }}>
          <Text>Delete</Text>
        </Pressable>
      </View>
    </Card>
  );
}
