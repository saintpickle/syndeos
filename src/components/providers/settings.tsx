import React, { createContext, useContext, useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import {Setting} from "@/types";

interface SettingsContextType {
  settings: Record<string, string>;
  isLoading: boolean;
  error: string | null;
  updateSettings: (newSettings: Record<string, string>) => Promise<void>;
  getSetting: (key: string) => string | undefined;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const settingsData = await invoke<Setting[]>('get_settings');
        
        const settingsRecord: Record<string, string> = {};
        settingsData.forEach(setting => {
          settingsRecord[setting.key] = setting.value;
        });
        
        setSettings(settingsRecord);
      } catch (err) {
        console.error('Failed to load settings:', err);
        setError('Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const updateSettings = async (newSettings: Record<string, string>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      for (const [key, value] of Object.entries(newSettings)) {
        await invoke('update_setting', { key, value });
      }
      
      setSettings(prevSettings => ({
        ...prevSettings,
        ...newSettings
      }));
    } catch (err) {
      console.error('Failed to update settings:', err);
      setError('Failed to update settings');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getSetting = (key: string): string | undefined => {
    return settings[key];
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isLoading,
        error,
        updateSettings,
        getSetting
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}