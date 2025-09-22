// app/settings.tsx
import AppHeader from '@/components/AppHeader';
import { Button, Card, Text } from '@/components/Themed';
import { useSettings } from '@/contexts/SettingsContext';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, settings, setThemeName, setTextScale } = useSettings();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <AppHeader title="Settings" />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32 }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <Card style={{ marginBottom: 12 }}>
          <Text weight="700" style={{ marginBottom: 12 }}>Appearance</Text>
          <View
            style={{
              flexDirection: settings.textScale > 1.2 ? 'column' : 'row',
              gap: 8,
              flexWrap: 'wrap',
              minWidth: 0,
            }}
          >
            <Button
              label="Light Theme"
              variant={theme.name === 'normal' ? 'primary' : 'secondary'}
              onPress={() => setThemeName('normal')}
              accessibilityLabel="Switch to light theme"
              fullWidth={settings.textScale > 1.2}
            />
            <Button
              label="High Contrast"
              variant={theme.name === 'high-contrast' ? 'primary' : 'secondary'}
              onPress={() => setThemeName('high-contrast')}
              accessibilityLabel="Switch to high contrast theme"
              fullWidth={settings.textScale > 1.2}
            />
          </View>
        </Card>

        <Card>
          <Text weight="700" style={{ marginBottom: 12 }}>Text size</Text>
          <View accessibilityRole="adjustable" accessibilityLabel="Adjust text size" style={{ gap: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap', minWidth: 0 }}>
              <Button
                label="A-"
                variant="secondary"
                onPress={() => setTextScale(Math.max(0.75, settings.textScale - 0.1))}
                accessibilityLabel="Decrease text size"
              />
              <Button
                label="A+"
                variant="secondary"
                onPress={() => setTextScale(Math.min(1.75, settings.textScale + 0.1))}
                accessibilityLabel="Increase text size"
              />
              <Button
                label="Reset"
                variant="secondary"
                onPress={() => setTextScale(1)}
                accessibilityLabel="Reset text size"
              />
            </View>
            <Text style={{ marginTop: 4 }}>Current scale: {settings.textScale.toFixed(2)}×</Text>
          </View>
        </Card>

        <View style={{ marginTop: 16 }}>
          <Button label="Done" variant="secondary" onPress={() => router.back()} accessibilityLabel="Go back" />
        </View>
      </ScrollView>
    </View>
  );
}
