<template>
  <webview id="webview_component" ref="webview_component" class="h-full rounded-xl" frameborder="0"
    enableblinkfeatures="PreciseMemoryInfo, CSSVariables" autosize="on" :src="src"
    :partition="`persist:${activeAccount?.partition}`" :preload="pathStore.getBasicPath() + '\\preload.mjs'"
    allowpopups></webview>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useAuthStore } from "../stores/Authentication";
import { usePathStore } from "../stores/path";


const pathStore = usePathStore();

const props = defineProps(["src"]);

const { activeAccount } = useAuthStore();

const webview_component = ref(null);

onMounted(() => {





    // گوش دادن به پیام های ipc از webview
    webview_component.value.addEventListener('ipc-message', (event) => {
      
      if (event.channel === 'context-menu-event') {
        const params = event.args[0];
        const webContentsId = webview_component.value.getWebContentsId();
        window.ipcRenderer.showWebviewContextMenu({
          x: params.x,
          y: params.y,
          webContentsId:webContentsId,
          hasText: params.hasText,
          isEditable:params.isEditable,
          selectionText:params.selectionText,
          canGoBack: webview_component.value.canGoBack(),
          canGoForward: webview_component.value.canGoForward(),
        });
      }
    });

 

  // webview_component.value.addEventListener("click", (event) => {
  //   console.log("clicked");
  //   if (
  //     event.target.tagName.toLowerCase() === "a" &&
  //     event.target.hasAttribute("target") &&
  //     event.target.getAttribute("target") === "_blank"
  //   ) {
  //     event.preventDefault(); // Prevent default navigation
  //     window.postMessage({ type: "blank-link-click", url: event.target.href }); // Send message to main component
  //   }
  // });


  webview_component.value.addEventListener('did-navigate', (event) => {
    if (event.url.toLowerCase().includes("https://e.fanap.ir/letter/letter/send/type/internal")) {
      launchAIPrompt(1,"https://e.fanap.ir/letter/letter/send/type/internal");    
    }
  });


  // webview_component.value.addEventListener("dom-ready", () => {
  //   if (props.src.includes("mizBunny_todo")) {
  //     webview_component.value.openDevTools();
  //   }
  // });






});

// onMounted(() => {
//   webview_component.value.addEventListener("will-navigate", (event) => {
//     console.log("will navigate");
//     event.preventDefault();
//     webview_component.value.loadURL(event.url);
//   });

//   webview_component.value.addEventListener("new-window", (event) => {
//     console.log("new-window");
//     event.preventDefault();
//     webview_component.value.loadURL(event.url);
//   });
// });

// watch(
//   () => props.src,
//   (newSrc) => {
//     if (webview_component.value) {
//       console.log('if in watch');
//       webview_component.value.loadURL(newSrc);
//     }
//   }
// );
</script>
