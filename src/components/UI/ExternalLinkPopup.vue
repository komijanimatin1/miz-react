<template>
  <section class="h-full relative">
    <section
      class="absolute top-0 left-0 w-full h-10 px-6 z-20 bg-[#BEBEBEA3] rounded-t-xl flex flex-row items-center justify-between"
      style="backdrop-filter: blur(1px)"
    >
      <span class="text-black text-sm font-bold leading-[38px]">{{
        pageTitle || "صفحه جدید"
      }}</span>
      <div
        class="w-6 h-6 flex flex-col items-center justify-center cursor-pointer"
        @click="emit('close')"
      >
        <span class="material-icons-outlined text-sm"> close </span>
      </div>
    </section>

    <webview
      id="externalLinkPopupWebview"
      ref="externalLinkPopupWebview"
      class="h-full rounded-xl"
      frameborder="0"
      enableblinkfeatures="PreciseMemoryInfo, CSSVariables"
      autosize="on"
      :src="src"
      @did-finish-load="loadedFn"
    ></webview>
  </section>
</template>

<script setup>
import { onMounted, ref } from "vue";
const props = defineProps(["src"]);
const emit = defineEmits(["close"]);

const pageTitle = ref(null);
const externalLinkPopupWebview = ref(null);

const loadedFn = () => {
  pageTitle.value = externalLinkPopupWebview.value.getTitle();
};

onMounted(() => {
  let externalLinkPopupWebview = document.getElementById(
    "externalLinkPopupWebview"
  );
  let iframe = externalLinkPopupWebview.shadowRoot.querySelector("iframe");
  iframe.style.height = "100%";
  iframe.style.borderRadius = "12px";
  externalLinkPopupWebview.style.display = "block";
});
</script>

<style lang="scss" scoped></style>
