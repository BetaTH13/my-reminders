import { RemindersProvider } from '@/contexts/RemindersContext';
import { SettingsProvider, useSettings } from '@/contexts/SettingsContext';
import { prepareNotifications } from '@/lib/notifications';
import * as NavigationBar from 'expo-navigation-bar';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform, StatusBar } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async (): Promise<Notifications.NotificationBehavior> => ({ 
    shouldPlaySound: true, 
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true
  })
});

function Providers({ children }: { children: React.ReactNode }) {
  const { theme } = useSettings();
  useEffect(() => { prepareNotifications(); }, []);
  useEffect(() => {
    // Keep Android navigation bar in sync with the app theme so system
    // nav buttons (back/menu) are darker on light themes.
    if (Platform.OS !== 'android') return;
    (async () => {
      try {
        await NavigationBar.setBackgroundColorAsync(theme.colors.card);
        // Use dark buttons on light themes, light buttons for high-contrast
        await NavigationBar.setButtonStyleAsync(
          theme.name === 'high-contrast' ? 'light' : 'dark'
        );
      } catch {
        // ignore if API not available
      }
    })();
  }, [theme]);

  return (
    <>
      <StatusBar
        barStyle={theme.name === 'high-contrast' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
        translucent={Platform.OS === 'android' ? false : undefined}
      />

      <RemindersProvider>{children}</RemindersProvider>
    </>
  );
}

export default function RootLayout() {
  return (
    <SettingsProvider>
      <Providers>
        <Stack screenOptions={{headerShown: false, headerStyle: { backgroundColor: '#1C2229' }, headerTintColor: '#fff' }}>
          <Stack.Screen name="index" options={{  }} />
          <Stack.Screen name="edit" options={{ title: 'Reminder' }} />
          <Stack.Screen name="settings" /> 
        </Stack>
      </Providers>
    </SettingsProvider>
  );
}
