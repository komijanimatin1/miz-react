<template>
  <router-view v-slot="{ Component }">
    <transition name="fade-in" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script>
import { useOnlineStatus } from "./composables/useOnlineStatus";
import OfflineComponent from "./components/OfflineComponent.vue";

import { ref } from "vue";
import { useAuthStore } from "./stores/Authentication";
import { useLockStore } from "./stores/LockStatus";
import { usePathStore } from "./stores/path.js";
import { useRoute } from "vue-router";

export default {
  name: "App",
  components: {
    OfflineComponent,
  },
  setup() {
    const lockStore = useLockStore();
    const pathStore = usePathStore();
    const authStore = useAuthStore();
    // watch sysBunny for refreshToken change
    sysBunny.onTokenChanage(function (token,refreshToken){
      debugger
      // console.info("token changed token is :  " + token);
          authStore.activeAccount.accessToken=token; 
          authStore.activeAccount.refreshToken=refreshToken;  
          // console.info("token changed refreshToken is :  " + refreshToken);
    });
    sysBunny.onLogout(function (token,refreshToken){
      debugger
      authStore.logout();
    });
    // end watching for refreshToken change
    const currentAppPath = ref(null);
    window.ipcRenderer.getAppPath((data) => {
      currentAppPath.value = data;
      pathStore.setBasicPath(currentAppPath.value);
      console.log(pathStore.getBasicPath());
    });
    window.ipcRenderer.getAppPathMain();
    return {
      lockStore,
    };
  },
};
</script>

<style scoped></style>
