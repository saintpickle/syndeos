import React, { createContext, useContext, useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import {Setting} from "@/types";

interface SettingsContextType {
  settings: Record<string, string>;
  isLoading: boolean;
  error: string | null;
  updateSetting: (key: string, value: string) => Promise<void>;
  updateSettings: (newSettings: Record<string, string>) => Promise<void>;
  getSetting: (key: string) => string | undefined;
  scategories: Record<string, Record<string, string>>;
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

  const updateSetting = async (key: string, value: string) => {
    try {
      setIsLoading(true);
      setError(null);

      await invoke('update_setting', { key, value });

      setSettings(prevSettings => ({
        ...prevSettings,
        [key]: value
      }))
    } catch (err) {
      console.error(`Failed to update setting ${key} with value ${value}: `, err);
      setError('Failed to update setting');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: Record<string, string>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      for (const [key, value] of Object.entries(newSettings)) {
        await updateSetting(key, value);
      }
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

  const filterSettings = (filter_string: string) => {
    let filterd_settings = {};

    for (const [key, value] of Object.entries(settings)) {
      if (key.includes(filter_string)) {
        filterd_settings = {...filterd_settings, [key]: value}
      }
    }

    return filterd_settings;
  }

  const scategories = {
    ui: filterSettings('ui/'),
    connections: filterSettings('connections/'),
    security: filterSettings('security/'),
    server: filterSettings('server/'),
    advanced: filterSettings('advanced/'),
    backup: filterSettings('backup/'),
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isLoading,
        error,
        updateSetting,
        updateSettings,
        getSetting,
        scategories
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