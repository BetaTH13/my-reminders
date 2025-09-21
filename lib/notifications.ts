import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function prepareNotifications() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('med-reminder-daily', {
      name: 'Medication Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      sound: 'default'
    });
  }
  const settings = await Notifications.getPermissionsAsync();
  if (!settings.granted) await Notifications.requestPermissionsAsync();
}

export async function scheduleDailyNotification(title: string, body: string, hour: number, minute: number) {
  return Notifications.scheduleNotificationAsync({
    content: { title, body, sound: true },
    trigger: { hour, minute, repeats: true, channelId: 'med-reminder-daily' }
  });
}

export async function cancelNotification(id?: string | null) {
  if (id) {
    try { await Notifications.cancelScheduledNotificationAsync(id); } catch {}
  }
}
