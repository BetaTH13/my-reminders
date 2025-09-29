export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type Reminder = {
    id: string;
    name: string;
    hour: number;
    minute: number;
    enabled: boolean;
    weekdays: Weekday[];  
    notificationIds: string[];
    missed: boolean; // stays true until disabled
};
