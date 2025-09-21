// lib/storage.ts
import type { Reminder } from '@/lib/types';
import { File, Paths } from 'expo-file-system';

// We'll store a single JSON file in the app's documents folder.
const remindersFile = new File(Paths.document, 'reminders.json');

export async function readReminders(): Promise<Reminder[]> {
  try {
    if (!remindersFile.exists) {
      // First run — create the file with an empty array
      remindersFile.create();            // throws if it already exists
      remindersFile.write('[]');         // write text (UTF-8)
      return [];
    }
    // File implements Blob, so you can read text:
    const raw = await remindersFile.text();  // Promise<string>
    return JSON.parse(raw) as Reminder[];
  } catch {
    // If the file is corrupt or unreadable, reset gracefully
    try { remindersFile.write('[]'); } catch {}
    return [];
  }
}

export async function writeReminders(reminders: Reminder[]) {
  try {
    // Ensure the file exists (create() throws only if it already exists)
    if (!remindersFile.exists) remindersFile.create();
    await remindersFile.write(JSON.stringify(reminders, null, 2));
  } catch {
    // no-op; keep the app running even if a write fails
  }
}
