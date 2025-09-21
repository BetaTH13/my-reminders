import {
    cancelNotification,
    scheduleDailyNotification,
} from "@/lib/notifications";
import { readReminders, writeReminders } from "@/lib/storage";
import type { Reminder } from "@/lib/types";
import React, { createContext, useContext, useEffect, useState } from "react";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

function isTimePassedToday(hour: number, minute: number) {
  const now = new Date();
  const t = new Date();
  t.setHours(hour, minute, 0, 0);
  return now.getTime() > t.getTime();
}

const Ctx = createContext<{
  reminders: Reminder[];
  add: (r: Omit<Reminder, "id" | "notificationId" | "missed">) => Promise<void>;
  update: (id: string, patch: Partial<Reminder>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  toggleEnabled: (id: string, enabled: boolean) => Promise<void>;
  refreshMissedFlags: () => void;
}>({
  reminders: [],
  add: async () => {},
  update: async () => {},
  remove: async () => {},
  toggleEnabled: async () => {},
  refreshMissedFlags: () => {},
});

export const useReminders = () => useContext(Ctx);

export const RemindersProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    readReminders().then(setReminders);
  }, []);
  useEffect(() => {
    writeReminders(reminders);
  }, [reminders]);

  const scheduleOrCancel = async (r: Reminder) => {
    if (r.enabled) {
      const id = await scheduleDailyNotification(
        r.name,
        `${r.dosage} at ${r.hour.toString().padStart(2, "0")}:${r.minute
          .toString()
          .padStart(2, "0")}`,
        r.hour,
        r.minute
      );
      r.notificationId = id;
    } else {
      await cancelNotification(r.notificationId);
      r.notificationId = null;
    }
  };

  const add = async (
    input: Omit<Reminder, "id" | "notificationId" | "missed">
  ) => {
    const r: Reminder = {
      id: uuidv4(),
      notificationId: null,
      missed: false,
      ...input,
    };
    await scheduleOrCancel(r);
    setReminders((list) => [r, ...list]);
  };

  const update = async (id: string, patch: Partial<Reminder>) => {
    setReminders((list) =>
      list.map((r) => (r.id === id ? { ...r, ...patch } : r))
    );
  };

  const remove = async (id: string) => {
    const r = reminders.find((x) => x.id === id);
    if (r) await cancelNotification(r.notificationId);
    setReminders((list) => list.filter((x) => x.id !== id));
  };

  const toggleEnabled = async (id: string, enabled: boolean) => {
    setReminders((list) =>
      list.map((item) => {
        if (item.id !== id) return item;
        const next = {
          ...item,
          enabled,
          missed: enabled ? item.missed : false,
        };
        scheduleOrCancel(next);
        return next;
      })
    );
  };

  const refreshMissedFlags = () => {
    setReminders((list) =>
      list.map((item) => {
        if (!item.enabled) return item;
        const missed = item.missed || isTimePassedToday(item.hour, item.minute);
        return { ...item, missed };
      })
    );
  };

  return (
    <Ctx.Provider
      value={{
        reminders,
        add,
        update,
        remove,
        toggleEnabled,
        refreshMissedFlags,
      }}
    >
      {children}
    </Ctx.Provider>
  );
};
