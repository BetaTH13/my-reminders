import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Weekday } from './types';

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

function toExpoWeekday(mon0: Weekday): number {
  return ((mon0 + 1) % 7) + 1;
}

export async function scheduleWeeklyNotifications(
  title: string,
  body: string,
  hour: number,
  minute: number,
  weekdays: Weekday[]
): Promise<string[]> {
  const ids: string[] = [];
  for (const d of weekdays) {
    const id = await Notifications.scheduleNotificationAsync({
      content: { title, body, sound: true },
      trigger: {
        type: 'weekly',
        weekday: toExpoWeekday(d),
        hour,
        minute,
        repeats: true,
        channelId: 'med-reminder-daily',
      } as Notifications.WeeklyTriggerInput,
    });
    ids.push(id);
  }
  return ids;
}

export async function cancelNotifications(ids: string[] | undefined | null) {
  if (!ids || !ids.length) {
    return;
  }
  await Promise.allSettled(ids.map(id => Notifications.cancelScheduledNotificationAsync(id)));
}
