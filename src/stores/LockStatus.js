import { defineStore } from "pinia";
import { reactive, ref, watch, onMounted } from "vue";
import { useAuthStore } from "./Authentication";

export const useLockStore = defineStore("lock", () => {
  const authStore = useAuthStore();

  const correctPassword = ref(authStore.activeAccount?.pin);

  function updateLockStatus() {
    correctPassword.value = authStore.activeAccount?.pin;
    hasPassword.value = !!correctPassword.value;
  }
  // Watch for changes in activeAccount and update lockStatus accordingly
  watch(
    () => authStore.activeAccount,
    (newVal) => {
      if (newVal) {
        updateLockStatus();
      }
    },
    { immediate: true } // Trigger the watcher immediately to check the initial state
  );

  // Ensure lockStatus is checked on component mount
  onMounted(() => {
    updateLockStatus();
  });
  const hasPassword = ref(!!correctPassword.value);
  const isLocked = ref(false);

  const setPassword = (val) => {
    // 1. find the active account in the accounts of the authStore => using id and etc
    // 2. set the pin to the stored account in the authStore => watcher will apply these changes to the localStorage

    authStore.accounts.forEach((account) => {
      if (account?.phoneNumber === authStore.activeAccount?.phoneNumber) {
        account.pin = val;
      }
    });
    correctPassword.value = val;
    hasPassword.value = true;
  };

  const removePassword = () => {
    correctPassword.value = null;
    hasPassword.value = false;
  };

  const unlockApp = () => {
    isLocked.value = false;
  };

  const lockApp = () => {
    isLocked.value = true;
  };

  return {
    correctPassword,
    hasPassword,
    isLocked,
    setPassword,
    removePassword,
    unlockApp,
    lockApp,
  };
});
