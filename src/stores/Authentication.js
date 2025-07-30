import { defineStore } from "pinia";
import { reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useLockStore } from "./LockStatus";

export const useAuthStore = defineStore("auth", () => {
  const router = useRouter();
  const lockStatus = useLockStore();

  const accounts = reactive(JSON.parse(localStorage.getItem("accounts")) || []);

  // const activeAccount = ref(
  //   JSON.parse(localStorage.getItem("accounts"))?.[0] || null
  // );
  const activeAccount = ref(null);
  const setActiveAccount = (payload, profileUpdated = false) => {
    if (payload) {
      if (!!payload.pin) {
        lockStatus.isLocked = true;
      } else {
        lockStatus.isLocked = false;
      }
    } else {
      lockStatus.isLocked = true;
    }

    activeAccount.value = payload;

    if (profileUpdated) {
      accounts.forEach((account, index) => {
        // debugger;
        if (account.phoneNumber === activeAccount.value.phoneNumber) {
          // accounts.splice(index, 1);
          // edit active account in the accounts array
          accounts[index] = activeAccount.value;
        }
      });
      lockStatus.isLocked = false;
    }
  };

  const activeAccountWorkspaces = ref(null);
  const setActiveAccountWorkspaces = (payload) => {
    activeAccountWorkspaces.value = payload;
  };

  const activeUnit = ref(null);
  const setActiveUnit = (payload) => {
    activeUnit.value = payload;
  };

  const logout = async () => {
    // Logout from the launcher
    // remove everything, logout from every webview, remove the user password and unlock the app for re-enter
    // window.ipcRenderer.clearSession();
    const phoneNumber = JSON.parse(
      JSON.stringify(activeAccount.value.phoneNumber)
    );
    try{
          // console.log("**************clearpartition***************"+partition); 

    const partition = JSON.parse(
      JSON.stringify(activeAccount.value.partition)
    );  
    
     window.ipcRenderer.clearPartition(`persist:${partition}`);
    } catch(eee){
      console.error(eee);
    }

    accounts.forEach((account, index) => {
      if (account.phoneNumber === activeAccount.value.phoneNumber) {
        accounts.splice(index, 1);
      }
    });
    setActiveAccount(null);
    lockStatus.removePassword();
    lockStatus.unlockApp();
    await router.replace({ name: "login" });
  };

  const addNewAccount = () => {
    setActiveAccount(null);
    router.replace({ name: "login", query: { addNewAccount: true } });
  };

  const selectAccount = () => {
    if (!!activeAccount.pin) {
      lockStatus.lockApp();
    }
    setActiveAccount(null);
    router.replace({ name: "login", query: { selectAccount: true } });
  };

  const newAccount = (payload) => {
    // check if the phone number has an account already, don't register it again
    if (
      accounts.find((account) => account.phoneNumber === payload.phoneNumber)
    ) {
      return;
    }
    accounts.push(payload);

    // window.ipcRenderer.clearSession();
    // localStorage.clear();
    lockStatus.removePassword();
    lockStatus.unlockApp();
    // router.replace({ name: "login" });
  };

  watch(accounts, (oldAccounts, newAccounts) => {
    localStorage.setItem("accounts", JSON.stringify(accounts));
  });

  return {
    logout,
    activeAccount,
    setActiveAccount,
    accounts,
    newAccount,
    addNewAccount,
    activeAccountWorkspaces,
    setActiveAccountWorkspaces,
    activeUnit,
    setActiveUnit,
    selectAccount,
  };
});
