import { cancelNotifications, scheduleWeeklyNotifications } from "@/lib/notifications";
import { readReminders, writeReminders } from "@/lib/storage";
import type { Reminder, Weekday } from "@/lib/types";
import React, { createContext, useContext, useEffect, useState } from "react";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

function isTimePassedToday(hour: number, minute: number) {
  const now = new Date();
  const t = new Date();
  t.setHours(hour, minute, 0, 0);
  return now.getTime() > t.getTime();
}

function todayMon0(): Weekday {
  const js = new Date().getDay();
  return ((js + 6) % 7) as Weekday;
}

const ALL_DAYS: Weekday[] = [0, 1, 2, 3, 4, 5, 6];


type CtxType = {
  reminders: Reminder[];
  add: (r: Omit<Reminder, 'id' | 'notificationIds' | 'missed'>) => Promise<void>;
  update: (id: string, patch: Partial<Reminder>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  toggleEnabled: (id: string, enabled: boolean) => Promise<void>;
  refreshMissedFlags: () => void;
};


const Ctx = createContext<CtxType>({
  reminders: [],
  add: async () => {},
  update: async () => {},
  remove: async () => {},
  toggleEnabled: async () => {},
  refreshMissedFlags: () => {},
});

export const useReminders = () => useContext(Ctx);

export const RemindersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  // Load from disk (and migrate old shape if needed)
  useEffect(() => {
    (async () => {
      const saved = await readReminders();
      // Migrate: ensure fields exist in case of old data
      const normalized: Reminder[] = (saved as any[]).map((r: any) => ({
        id: r.id,
        name: r.name,
        hour: r.hour,
        minute: r.minute,
        enabled: r.enabled ?? true,
        weekdays: Array.isArray(r.weekdays) && r.weekdays.length ? r.weekdays : ALL_DAYS.slice(),
        notificationIds: Array.isArray(r.notificationIds) ? r.notificationIds : (r.notificationId ? [r.notificationId] : []),
        missed: !!r.missed,
      }));
      setReminders(normalized);
    })();
  }, []);

  // Persist
  useEffect(() => {
    writeReminders(reminders);
  }, [reminders]);

  async function reschedule(next: Reminder): Promise<string[]> {
    await cancelNotifications(next.notificationIds);
    if (!next.enabled) return [];
    if (!next.weekdays.length) return [];

    const title = next.name;
    const body = `Reminder at ${String(next.hour).padStart(2, '0')}:${String(next.minute).padStart(2, '0')}`;
    return scheduleWeeklyNotifications(title, body, next.hour, next.minute, next.weekdays);
  }

  const add: CtxType['add'] = async (input) => {
    const r: Reminder = {
      id: uuidv4(),
      name: input.name,
      hour: input.hour,
      minute: input.minute,
      enabled: input.enabled,
      weekdays: input.weekdays?.length ? input.weekdays : ALL_DAYS.slice(),
      notificationIds: [],
      missed: false,
    };
    const ids = await reschedule(r);
    r.notificationIds = ids;
    setReminders(list => [r, ...list]);
  };

  const update: CtxType['update'] = async (id, patch) => {
    const current = reminders.find(x => x.id === id);
    if (!current) return;
    const next: Reminder = {
      ...current,
      ...patch,
      // keep arrays safe
      weekdays: patch.weekdays !== undefined ? patch.weekdays : current.weekdays,
      notificationIds: current.notificationIds,
    };
    const ids = await reschedule(next);
    next.notificationIds = ids;
    setReminders(list => list.map(x => (x.id === id ? next : x)));
  };

  const remove: CtxType['remove'] = async (id) => {
    const r = reminders.find(x => x.id === id);
    if (r) await cancelNotifications(r.notificationIds);
    setReminders(list => list.filter(x => x.id !== id));
  };

  const toggleEnabled: CtxType['toggleEnabled'] = async (id, enabled) => {
    const current = reminders.find(x => x.id === id);
    if (!current) return;
    let next: Reminder = { ...current, enabled, missed: enabled ? current.missed : false };
    if (enabled) {
      const ids = await reschedule(next);
      next.notificationIds = ids;
    } else {
      await cancelNotifications(next.notificationIds);
      next.notificationIds = [];
    }
    setReminders(list => list.map(x => (x.id === id ? next : x)));
  };

  const refreshMissedFlags = () => {
    const today = todayMon0();
    setReminders(list =>
      list.map(item => {
        if (!item.enabled) return item;
        const isToday = item.weekdays.includes(today);
        const missedNow = isToday && isTimePassedToday(item.hour, item.minute);
        const missed = item.missed || missedNow; // once missed, stays true until disabled
        return { ...item, missed };
      })
    );
  };

  return (
    <Ctx.Provider value={{ reminders, add, update, remove, toggleEnabled, refreshMissedFlags }}>
      {children}
    </Ctx.Provider>
  );
};
