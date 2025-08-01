import { create } from 'zustand';
import { useAuthStore } from './auth-store';

interface LockState {
  correctPassword: string | null;
  hasPassword: boolean;
  isLocked: boolean;
  setPassword: (password: string) => void;
  removePassword: () => void;
  unlockApp: () => void;
  lockApp: () => void;
}

export const useLockStore = create<LockState>((set, get) => ({
  correctPassword: null,
  hasPassword: false,
  isLocked: false,

  setPassword: (password) => {
    const authStore = useAuthStore.getState();
    const { activeAccount, accounts } = authStore;
    
    if (activeAccount) {
      const updatedAccounts = accounts.map(account => 
        account.phoneNumber === activeAccount.phoneNumber 
          ? { ...account, pin: password }
          : account
      );
      
      authStore.setActiveAccount({ ...activeAccount, pin: password });
      useAuthStore.setState({ accounts: updatedAccounts });
    }
    
    set({ 
      correctPassword: password,
      hasPassword: true 
    });
  },

  removePassword: () => {
    set({ 
      correctPassword: null,
      hasPassword: false 
    });
  },

  unlockApp: () => {
    set({ isLocked: false });
  },

  lockApp: () => {
    set({ isLocked: true });
  },
})); 