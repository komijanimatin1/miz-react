import { launcherApi } from "../../axios";
import { useAuthStore } from "../stores/Authentication";
import { useLockStore } from "../stores/LockStatus";

export function getLauncherProfile() {
  const authStore = useAuthStore();
  const lockStatus = useLockStore();

  const getProfile = async () => {
    try {
      // debugger;
      // Pin should not be null
      debugger
      const response = await launcherApi.get("Workspace/GetWorkspaceProfile");
      const newAccount = {
        firstName: response.data.data.profile.firstName,
        lastName: response.data.data.profile.lastName,
        phoneNumber: authStore.activeAccount.phoneNumber,
        partition: authStore.activeAccount.partition,
        pin: authStore.activeAccount.pin,
        accessToken: authStore.activeAccount.accessToken,
        refreshToken: authStore.activeAccount.refreshToken,
      };
      await authStore.setActiveAccount(newAccount, true);
      await authStore.setActiveAccountWorkspaces(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    getProfile,
  };
}
