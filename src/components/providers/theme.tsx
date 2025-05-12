import { createContext, useContext, useEffect, useState } from 'react';
import { useSettings } from './settings';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('system');
    const [isLoading, setIsLoading] = useState(true);

    const { settings, isLoading: settingsLoading, updateSettings } = useSettings();

    useEffect(() => {
        if (settingsLoading) return;

        const savedTheme = settings['ui/theme'];
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
            setTheme(savedTheme as Theme);
        }

        setIsLoading(false);
    }, [settings, settingsLoading]);

    const updateTheme = async (newTheme: Theme) => {
        setTheme(newTheme);
        try {
            await updateSettings({ 'ui/theme': newTheme });
        } catch (error) {
            console.error('Failed to save theme setting:', error);
        }
    };

    // Apply theme class to document based on theme
    useEffect(() => {
        if (isLoading) return;

        const root = window.document.documentElement;

        root.classList.remove('light', 'dark');

        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light';
            root.classList.add(systemTheme);
        } else {
            root.classList.add(theme);
        }
    }, [theme, isLoading]);

    useEffect(() => {
        if (theme !== 'system') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = () => {
            const root = window.document.documentElement;
            root.classList.remove('light', 'dark');
            root.classList.add(mediaQuery.matches ? 'dark' : 'light');
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    return (
        <ThemeContext.Provider
            value={{
                theme,
                setTheme: updateTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
