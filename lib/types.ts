export type Reminder = {
    id: string;
    name: string;
    dosage: string;
    hour: number;
    minute: number;
    enabled: boolean;
    notificationId?: string | null;
    missed: boolean; // stays true until disabled
};
