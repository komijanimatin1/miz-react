import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Account {
  phoneNumber: string;
  partition?: string;
  pin?: string | null;
  firstName?: string;
  lastName?: string;
  username?: string;
  accessToken?: string;
  refreshToken?: string;
  // Add other account properties as needed
}

interface AuthState {
  accounts: Account[];
  activeAccount: Account | null;
  activeAccountWorkspaces: any | null;
  activeUnit: any | null;
  
  // Actions
  setActiveAccount: (account: Account | null, profileUpdated?: boolean) => void;
  setActiveAccountWorkspaces: (workspaces: any) => void;
  setActiveUnit: (unit: any) => void;
  addNewAccount: () => void;
  selectAccount: () => void;
  newAccount: (account: Account) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accounts: [],
      activeAccount: null,
      activeAccountWorkspaces: null,
      activeUnit: null,

      setActiveAccount: (account, profileUpdated = false) => {
        set({ activeAccount: account });
        
        if (profileUpdated && account) {
          const { accounts } = get();
          const updatedAccounts = accounts.map(acc => 
            acc.phoneNumber === account.phoneNumber ? account : acc
          );
          set({ accounts: updatedAccounts });
        }
      },

      setActiveAccountWorkspaces: (workspaces) => {
        set({ activeAccountWorkspaces: workspaces });
      },

      setActiveUnit: (unit) => {
        set({ activeUnit: unit });
      },

      addNewAccount: () => {
        set({ activeAccount: null });
        // Navigation will be handled by the component
      },

      selectAccount: () => {
        set({ activeAccount: null });
        // Navigation will be handled by the component
      },

      newAccount: (account) => {
        const { accounts } = get();
        const existingAccount = accounts.find(acc => acc.phoneNumber === account.phoneNumber);
        
        if (!existingAccount) {
          set({ accounts: [...accounts, account] });
        }
      },

      logout: () => {
        const { activeAccount, accounts } = get();
        
        if (activeAccount) {
          const updatedAccounts = accounts.filter(acc => acc.phoneNumber !== activeAccount.phoneNumber);
          set({ 
            accounts: updatedAccounts,
            activeAccount: null,
            activeAccountWorkspaces: null,
            activeUnit: null
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        accounts: state.accounts,
        activeAccount: state.activeAccount 
      }),
      skipHydration: true,
    }
  )
); 