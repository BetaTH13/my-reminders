export type Theme = {
    name: 'normal' | 'high-contrast';
    colors: {
        background: string;
        card: string;
        text: string;
        mutedText: string;
        primary: string;
        border: string;
        danger: string;
        upcoming: string;
        disabled: string;
        buttonText: string;
    };
};

export const NormalTheme: Theme = {
    name: 'normal',
    colors: {
        background: '#F7F9FC',   // subtle off-white
        card: '#FFFFFF',
        text: '#111827',         // slate-900
        mutedText: '#6B7280',    // gray-500
        primary: '#2563EB',      // blue-600
        border: '#E5E7EB',       // gray-200
        danger: '#DC2626',       // red-600
        upcoming: '#2563EB',     // blue-600
        disabled: '#9CA3AF',     // gray-400
        buttonText: '#FFFFFF',
    }
};

export const HighContrastTheme: Theme = {
    name: 'high-contrast',
    colors: {
        background: '#000000',
        card: '#000000',
        text: '#FFFFFF',
        mutedText: '#FFFFFF',
        primary: '#FFFF00',
        border: '#FFFFFF',
        danger: '#FF0000',
        upcoming: '#00FFFF',
        disabled: '#BFBFBF',
        buttonText: '#000000'
    }
};
