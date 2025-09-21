import { Card, Text } from '@/components/Themed';
import React from 'react';

export default function EmptyState() {
  return (
    <Card accessibilityRole="summary" accessibilityLabel="No reminders yet">
      <Text weight="600" style={{ marginBottom: 8 }}>No reminders yet</Text>
      <Text>Add your first medication reminder using the "Add Reminder" button.</Text>
    </Card>
  );
}
