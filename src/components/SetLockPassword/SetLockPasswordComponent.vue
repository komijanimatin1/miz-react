<template>
  <transition name="fade-in" mode="out-in">
    <component
      :is="shownComponent"
      @goVerifyLockPassword="goVerifyLockPassword"
      :tempPassword="tempPassword"
      class="rounded-xl"
    ></component>
  </transition>
</template>

<script>
import InitalLockPassword from "./InitalLockPassword.vue";
import VerifyLockPassword from "./VerifyLockPassword.vue";
import { ref } from "vue";
export default {
  components: {
    InitalLockPassword,
    VerifyLockPassword,
  },

  setup() {
    const shownComponent = ref("InitalLockPassword");
    const tempPassword = ref("");

    const goVerifyLockPassword = (pass) => {
      shownComponent.value = "VerifyLockPassword";
      tempPassword.value = pass;
    };

    return {
      shownComponent,
      goVerifyLockPassword,
      tempPassword,
    };
  },
};
</script>
