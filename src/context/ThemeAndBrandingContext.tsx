import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteBrandingSettings } from '../types';
import { storage } from '../services/storageService';
import { DEFAULT_BRANDING_SETTINGS } from '../data/seedData';

interface ThemeAndBrandingContextType {
  branding: SiteBrandingSettings;
  updateBranding: (newSettings: Partial<SiteBrandingSettings>) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeAndBrandingContext = createContext<ThemeAndBrandingContextType | undefined>(undefined);

export const ThemeAndBrandingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [branding, setBranding] = useState<SiteBrandingSettings>(() => {
    return storage.getBrandingSettings() || DEFAULT_BRANDING_SETTINGS;
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('prayercloud_dark_mode') === 'true';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('prayercloud_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('prayercloud_dark_mode', 'false');
    }
  }, [isDarkMode]);

  // Apply custom primary/secondary branding colors to CSS custom properties
  useEffect(() => {
    document.documentElement.style.setProperty('--color-primary', branding.primaryColor || '#2563EB');
    document.documentElement.style.setProperty('--color-secondary', branding.secondaryColor || '#0EA5E9');
  }, [branding]);

  const updateBranding = (newSettings: Partial<SiteBrandingSettings>) => {
    const updated = { ...branding, ...newSettings };
    setBranding(updated);
    storage.updateBrandingSettings(updated);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <ThemeAndBrandingContext.Provider
      value={{
        branding,
        updateBranding,
        isDarkMode,
        toggleDarkMode
      }}
    >
      {children}
    </ThemeAndBrandingContext.Provider>
  );
};

export const useBranding = () => {
  const context = useContext(ThemeAndBrandingContext);
  if (!context) {
    throw new Error('useBranding must be used within a ThemeAndBrandingProvider');
  }
  return context;
};
