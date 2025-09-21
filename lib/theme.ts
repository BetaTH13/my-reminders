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
        background: '#101418',
        card: '#1C2229',
        text: '#FFFFFF',
        mutedText: '#C7CDD4',
        primary: '#1976D2',
        border: '#2B333B',
        danger: '#D32F2F',
        upcoming: '#1976D2',
        disabled: '#9E9E9E',
        buttonText: '#FFFFFF'
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
