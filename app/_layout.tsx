import { RemindersProvider } from '@/contexts/RemindersContext';
import { SettingsProvider, useSettings } from '@/contexts/SettingsContext';
import { prepareNotifications } from '@/lib/notifications';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';

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
  return (
    <>
      <StatusBar barStyle="light-content" />
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
