<template>
  <nav
    id="drag-region"
    class="titlebar w-full bg-grey-4 py-2 px-4 flex flex-row justify-center items-center relative min-h-[50px]"
  >
    <div
      class="icon-container clickable flex flex-row items-center gap-x-2 absolute right-6 top-1/2 translate-y-[-50%]"
    >
      <span
        class="material-icons-outlined cursor-pointer text-base text-grey-3"
        @click="close"
      >
        close
      </span>
      <span
        id="maximize"
        @click="maximize"
        class="material-icons-outlined cursor-pointer text-base text-grey-3"
      >
        crop_square
      </span>
      <span
        @click="minimize"
        class="material-icons-outlined cursor-pointer text-base text-grey-3"
      >
        remove
      </span>
    </div>

    <div class="title-bar clickable" v-if="showTitleBar">
      <span
        class="material-icons-outlined cursor-pointer text-grey-3 font-thin text-base"
        @click="reloadWebview"
      >
        refresh
      </span>

      <div class="basis-full flex flex-row items-center justify-between">
        <span
          class="material-icons-outlined cursor-pointer text-grey-3 font-thin text-lg"
          @click="goForward"
        >
          chevron_right
        </span>
        <span class="text-grey-3 font-bold text-base">ورود به حساب</span>
        <span
          class="material-icons-outlined cursor-pointer text-grey-3 font-thin text-lg"
          @click="goBack"
        >
          chevron_left
        </span>
      </div>
    </div>

    <div
      class="clickable absolute left-4 top-1/2 translate-y-[-50%]"
      v-if="showTitleBar"
    >
      <button
        class="rounded-lg flex flex-row justify-center items-center gap-x-2 text-black"
        @click="emit('backToSelectAccount')"
      >
        <span class="text-sm font-bold"> صفحه اصلی </span>
        <span class="material-icons-outlined text-base"> chevron_left </span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";

const props = defineProps(["showTitleBar"]);
const emit = defineEmits([
  "reloadWebview",
  "goBack",
  "goForward",
  "setPassword",
  "backToSelectAccount",
]);

const router = useRouter();
const route = useRoute();

// Header Functionality
const close = () => {
  window.ipcRenderer.close();
};
const maximize = () => {
  window.ipcRenderer.toggleFullscreen();
};
const minimize = () => {
  window.ipcRenderer.minimize();
};

const reloadWebview = () => {
  emit("reloadWebview");
};
const goBack = () => {
  emit("goBack");
};
const goForward = () => {
  emit("goForward");
};
</script>

<style lang="scss" scoped>
.title-bar {
  @apply py-1 px-6 w-[300px] rounded-full bg-grey-7 flex flex-row items-center gap-x-6;
}
</style>
