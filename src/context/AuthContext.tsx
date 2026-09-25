import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { storage } from '../services/storageService';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  login: (identifier: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string; forcePasswordChange?: boolean; user?: User }>;
  register: (data: {
    fullName: string;
    username: string;
    email: string;
    phoneNumber?: string;
    country: string;
    role: UserRole;
    password: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchAccount: (userId: string) => void;
  changePassword: (newPass: string) => boolean;
  updateProfile: (data: Partial<User>) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  forcePasswordModalOpen: boolean;
  setForcePasswordModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_KEY = 'prayercloud_current_user_v2';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(CURRENT_USER_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
      return null;
    } catch {
      return null;
    }
  });

  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [forcePasswordModalOpen, setForcePasswordModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
      if (currentUser.mustChangePassword) {
        setForcePasswordModalOpen(true);
      }
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }, [currentUser]);

  const login = async (
    identifier: string,
    password: string,
    _rememberMe = true
  ): Promise<{ success: boolean; error?: string; forcePasswordChange?: boolean; user?: User }> => {
    const users = storage.getUsers();
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanId) {
      return { success: false, error: 'Email or Username is required.' };
    }

    if (!cleanPass) {
      return { success: false, error: 'Password details are required to log in.' };
    }

    const matched = users.find(u => u.email.toLowerCase() === cleanId || u.username.toLowerCase() === cleanId);
    if (!matched) {
      return { success: false, error: 'No account found with this email or username. Please check and try again.' };
    }

    if (!matched.isActive) {
      return { success: false, error: 'Your account has been deactivated. Please contact missions@prayercloud.org.' };
    }

    // Strict password verification against stored credentials
    const isPasswordValid = storage.verifyUserPassword(matched.id, cleanPass);
    if (!isPasswordValid) {
      return { success: false, error: 'Incorrect password. Please verify your password details and try again.' };
    }

    setCurrentUser(matched);
    storage.logAudit(matched.id, matched.fullName, 'USER_LOGIN', 'Auth', `User logged in: ${matched.email}`);

    if (matched.mustChangePassword) {
      setForcePasswordModalOpen(true);
      return { success: true, forcePasswordChange: true, user: matched };
    }

    return { success: true, user: matched };
  };

  const register = async (data: {
    fullName: string;
    username: string;
    email: string;
    phoneNumber?: string;
    country: string;
    role: UserRole;
    password: string;
  }): Promise<{ success: boolean; error?: string }> => {
    const users = storage.getUsers();
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanUsername = data.username.trim().toLowerCase();

    if (!data.password || data.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email already exists.' };
    }
    if (users.some(u => u.username.toLowerCase() === cleanUsername)) {
      return { success: false, error: 'This username is already taken.' };
    }

    const newUserId = `usr-${Date.now()}`;
    const newUser: User = {
      id: newUserId,
      fullName: data.fullName,
      username: data.username,
      email: data.email,
      phoneNumber: data.phoneNumber || '',
      country: data.country || 'Global',
      role: data.role || 'Prayer Warrior',
      avatarUrl: '',
      bio: `Dedicated ${data.role} committed to fulfilling the Great Commission.`,
      isVerified: true,
      isActive: true,
      mustChangePassword: false,
      joinedAt: new Date().toISOString(),
      prayersOfferedCount: 0
    };

    // Store user profile and securely save credentials
    storage.updateUser(newUser);
    storage.setUserPassword(newUserId, data.password);

    setCurrentUser(newUser);
    storage.logAudit(newUser.id, newUser.fullName, 'USER_REGISTER', 'Auth', `New registration as ${newUser.role}`);

    setIsOnboardingOpen(true);

    return { success: true };
  };

  const logout = () => {
    if (currentUser) {
      storage.logAudit(currentUser.id, currentUser.fullName, 'USER_LOGOUT', 'Auth', 'User logged out.');
    }
    setCurrentUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const switchAccount = (userId: string) => {
    const target = storage.getUserById(userId);
    if (target) {
      setCurrentUser(target);
      if (target.mustChangePassword) {
        setForcePasswordModalOpen(true);
      }
    }
  };

  const changePassword = (newPass: string): boolean => {
    if (!currentUser) return false;
    const updated = { ...currentUser, mustChangePassword: false };
    setCurrentUser(updated);
    storage.updateUser(updated);
    storage.setUserPassword(currentUser.id, newPass);
    setForcePasswordModalOpen(false);
    storage.logAudit(currentUser.id, currentUser.fullName, 'PASSWORD_CHANGE', 'Security', 'User updated password.');
    return true;
  };

  const updateProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updated: User = { ...currentUser, ...data };
    setCurrentUser(updated);
    storage.updateUser(updated);
  };

  const isAuthenticated = !!currentUser;
  const isAdmin = currentUser?.role === 'Admin' || currentUser?.role === 'Super Admin';
  const isSuperAdmin = currentUser?.role === 'Super Admin';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isAdmin,
        isSuperAdmin,
        login,
        register,
        logout,
        switchAccount,
        changePassword,
        updateProfile,
        isOnboardingOpen,
        setIsOnboardingOpen,
        forcePasswordModalOpen,
        setForcePasswordModalOpen
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export default AuthProvider;
