<template>
  <section class="w-screen h-screen bg-grey-4 flex flex-col items-center">
    <auth-header
      class="z-10"
      :showTitleBar="showTitleBar"
      @reloadWebview="reloadWebview"
      @backToSelectAccount="backToSelectAccount"
    ></auth-header>

    <section
      class="w-full flex flex-row pl-4 pt-2 pb-4 basis-full items-center justify-center"
    >
      <transition name="fade-in" mode="out-in">
        <component
          :is="selectedComponent"
          @is-authenticated="isAuthenticated"
          @go-welcome="onGoWelcome"
          @add-account="addAccount"
          @logout="backToSelectAccount"
        ></component>
      </transition>
    </section>
  </section>
</template>

<script>
import { ref, watch } from "vue";
import WelcomePage from "../components/Auth/WelcomePage.vue";
import LoginPage from "../components/Auth/LoginPage.vue";
import UnitSelectPage from "../components/Auth/UnitSelectPage.vue";
import AuthHeader from "../components/UI/AuthHeader.vue";
import SelectAccount from "../components/Auth/SelectAccount.vue";
import { useAuthStore } from "../stores/Authentication";
import { useRoute } from "vue-router";

export default {
  components: {
    WelcomePage,
    LoginPage,
    UnitSelectPage,
    AuthHeader,
    SelectAccount,
  },
  setup() {
    const authStore = useAuthStore();
    const route = useRoute();
    const selectedComponent = ref("WelcomePage");
    const showTitleBar = ref(false);

    const isAuthenticated = (state) => {
      if (authStore.activeAccount) {
        selectedComponent.value = "UnitSelectPage";
      } else {
        selectedComponent.value = "SelectAccount";
        // if (state === 0) {
        //   selectedComponent.value = "LoginPage";
        // } else {
        //   selectedComponent.value = "SelectAccount";
        // }
      }
    };

    const onGoWelcome = () => {
      selectedComponent.value = "UnitSelectPage";
    };

    const addAccount = () => {
      selectedComponent.value = "LoginPage";
    };

    watch(selectedComponent, (newSelectedComponent) => {
      if (newSelectedComponent === "LoginPage") {
        showTitleBar.value = true;
      } else {
        showTitleBar.value = false;
      }
    });

    const reloadWebview = () => {
      const webview_login = document.getElementById("webview_login");
      if (webview_login) {
        webview_login.reload();
      }
    };

    if (route.query.addNewAccount) {
      selectedComponent.value = "LoginPage";
    }
    if (route.query.selectAccount) {
      selectedComponent.value = "SelectAccount";
    }

    const backToSelectAccount = () => {
      selectedComponent.value = "SelectAccount";
    };

    return {
      selectedComponent,
      isAuthenticated,
      onGoWelcome,
      showTitleBar,
      reloadWebview,
      addAccount,
      backToSelectAccount,
    };
  },
};
</script>

<style scoped>
.btn {
  box-shadow: 0px 30px 60px 0px #0000001a;
  box-shadow: 0px 15px 30px 0px #0000000d;
}
</style>
