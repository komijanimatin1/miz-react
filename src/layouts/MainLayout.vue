<template>
  <section style="overflow-x: hidden">
    <transition name="slide-out-up">
      <lock-screen
        v-if="lockStore.isLocked && lockStore.hasPassword"
        @unlock="unlock"
      ></lock-screen>
    </transition>

    <div class="relative h-full flex flex-col bg-grey-4">
      <the-header
        :actualWebviewZoom="actualWebviewZoom"
        :pageTitle="pageTitle"
        @reloadWebview="reloadWebview"
        :canGoBack="canGoBack"
        :canGoForward="canGoForward"
        @goForward="goForward"
        @goBack="goBack"
        @setPassword="goSetLockPassword"
        @active-unit-changed="getUserApp"
        @zoom-in="zoomIn"
        @zoom-out="zoomOut"
        @aiPopupShow="aiModal = true"
      ></the-header>

      <section class="flex flex-row pl-4 pt-2 pb-4 h-[calc(100vh-52px)]">
        <side-bar
          class=""
          :menu-items="menuItems"
          :main-menu-items="mainMenuItems"
          :full-side-bar-clicked="fullSideBarClicked"
          @menu-item-clicked="menuItemClicked"
          @menuSliderShown="menuSliderShown"
          @updateHiddenItems="updateHiddenItems"
        ></side-bar>
        <!-- <router-view class=" border-4 border-primary basis-full rounded-lg bg-white"></router-view> -->
        <section
          class="basis-full rounded-xl bg-white relative border border-grey-15"
          style="z-index: 5"
        >
          <transition name="fade-in" mode="out-in">
            <section
              class="bg-white h-full w-full rounded-xl relative flex flex-col gap-y-4 items-center justify-center"
              v-if="!activeUrl && !lockStore.isLocked"
            >
              <img src="../assets/Images/in-progress.svg" alt="" />
              <span class="font-bold"
                >لطفا یکی از گزینه های منو را انتخاب کنید</span
              >
            </section>

            <set-lock-password-component
              v-else-if="lockStore.isLocked && !lockStore.hasPassword"
            ></set-lock-password-component>

            <section
              v-else
              class="webview-container bg-white h-full w-full rounded-xl relative"
            >
              <div
                class="active-webview h-full w-full rounded-xl absolute top-0 left-0"
                v-for="(item, index) in menuItems"
                :key="index"
                :class="item.url === activeUrl ? 'visible z-20 ' : 'invisible '"
              >
                <keep-alive :key="item.url">
                  <component
                    :is="currentComponent"
                    :src="item.url"
                    :class="
                      item.url === activeUrl ? 'visible isCurrent' : 'invisible'
                    "
                    @did-finish-load="loadedFn"
                    @did-navigate-in-page="onDidNavigateInPage"
                    ref="webviewsRef"
                  ></component>
                </keep-alive>
              </div>
            </section>
          </transition>

          <div
            class="absolute w-full h-full top-0 left-0 z-50 backdrop-blur-sm rounded-lg bg-[#0000003b]"
            @click="isMenuSliderShown = false"
            v-if="isMenuSliderShown"
          ></div>

          <div
            id="modal"
            style="z-index: 50000"
            class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 hidden"
          >
            <div class="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
              <div id="isNotLoading">
                <h2 class="text-xl font-semibold mb-4">موضوع نامه</h2>
                <p class="mb-4">لطفاً موضوع نامه مورد نظر خود را وارد کنید:</p>
                <input
                  type="text"
                  id="inputField"
                  class="w-full p-2 border border-gray-300 rounded mb-4"
                  placeholder="موضوع نامه"
                />
                <div class="flex justify-end">
                  <button
                    id="cancelBtn"
                    onclick="onclick_cancelBtn()"
                    class="px-4 py-2 bg-gray-500 text-white rounded mr-2"
                  >
                    لغو
                  </button>
                  <button
                    id="submitBtn"
                    onclick="onclick_submitBtn()"
                    class="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    تأیید
                  </button>
                </div>
              </div>
              <div id="isLoading" class="hidden">
                <div
                  class="border-t-4 border-blue-500 border-solid rounded-full w-12 h-12 animate-spin"
                ></div>
              </div>
            </div>
          </div>

          <div
            id="aiAlertModal"
            style="z-index: 50000"
            class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 hidden"
          >
            <div class="bg-white rounded-lg shadow-lg p-6 w-80">
              <div class="text-lg font-semibold mb-4">دستیار میزبانی</div>
              <div id="aiAlertMessage" class="text-gray-700 mb-6">
                اینجا پیام نمایش داده می‌شود
              </div>
              <button
                id="copyBtn"
                class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                کپی کردن پیام و بستن
              </button>
            </div>
          </div>

          <transition name="slide-in">
            <div
              class="w-[200px] h-[calc(100%+2px)] absolute top-[-1px] right-[-8px] bg-grey-17 rounded-xl z-[51] blur-0"
              v-if="isMenuSliderShown"
            >
              <full-side-bar
                :menu-items="hiddenItems"
                @close-slide-menu="isMenuSliderShown = false"
                @menu-item-clicked="menuItemClicked"
              ></full-side-bar>
            </div>
          </transition>

          <div
            class="absolute w-full h-full top-0 left-0 z-50 backdrop-blur-sm rounded-lg bg-[#0000003b]"
            @click="externalLinkPopup = false"
            v-if="externalLinkPopup"
          ></div>
          <transition name="slide-in-left">
            <div
              class="w-[90%] h-[calc(100%+2px)] absolute top-[-1px] left-0 bg-white rounded-xl z-[51] blur-0"
              v-if="externalLinkPopup"
            >
              <ExternalLinkPopup
                :src="externalLinkPopupSrc"
                @close="externalLinkPopup = false"
              ></ExternalLinkPopup>
            </div>
          </transition>

          <div
            class="absolute w-full h-full top-0 left-0 z-50 backdrop-blur-sm rounded-lg bg-[#0000003b]"
            @click="aiModal = false"
            v-if="aiModal"
          ></div>
          <transition name="slide-in-left">
            <div
              class="w-[40%] h-[calc(100%+2px)] absolute top-[-1px] left-0 bg-white rounded-xl z-[51] blur-0"
              v-if="aiModal"
            >
              <webview
                id="webview_ai"
                ref="webview_component"
                class="h-full rounded-xl"
                frameborder="0"
                enableblinkfeatures="PreciseMemoryInfo, CSSVariables"
                autosize="on"
                :src="webview_ai_src()"
                :partition="`persist:${activeAccount?.partition}`"
                :preload="pathStore.getBasicPath() + '\\preload.mjs'"
              ></webview>
            </div>
          </transition>
        </section>
      </section>
    </div>
  </section>
</template>

<script>
import SideBar from "../components/UI/SideBar.vue";
import TheHeader from "../components/UI/TheHeader.vue";
import WebviewComponent from "../components/WebviewComponent.vue";
import FullSideBar from "../components/UI/FullSideBar.vue";
import SetLockPasswordComponent from "../components/SetLockPassword/SetLockPasswordComponent.vue";
import ExternalLinkPopup from "../components/UI/ExternalLinkPopup.vue";
import { ref, onMounted, nextTick, watch } from "vue";
import LockScreen from "../components/LockScreen.vue";
import { useLockStore } from "../stores/LockStatus.js";
import { api } from "../../axios.js";
import axios from "axios";
import { useAuthStore } from "../stores/Authentication";
import { getLauncherProfile } from "../composables/GetProfile.js";
import { usePathStore } from "../stores/path";

export default {
  components: {
    TheHeader,
    SideBar,
    WebviewComponent,
    LockScreen,
    FullSideBar,
    SetLockPasswordComponent,
    ExternalLinkPopup,
  },
  setup() {
    const lockStore = useLockStore();

    const pathStore = usePathStore();

    const unlock = () => {
      lockStore.unlockApp();
      console.log(lockStore.isLocked);
    };

    const authStore = useAuthStore();
    const accessToken = authStore.activeAccount.accessToken;
    const refreshToken = authStore.activeAccount.refreshToken;

    const getProfile = getLauncherProfile();

    const pageTitle = ref(null);

    const isMenuSliderShown = ref(false);
    const menuSliderShown = () => {
      isMenuSliderShown.value = true;
    };

    const hiddenItems = ref([]);
    const updateHiddenItems = (updatedItems) => {
      hiddenItems.value = updatedItems;
    };

    const mainMenuItems = ref([
      // {
      //   title: "دستیار",
      //   icon: "auto_fix_high",
      //   url: "",
      // },
      // {
      //   title: "خانه",
      //   icon: "home",
      //   url: "",
      // },
    ]);

    const fixedMenuItems = [
      // {
      //   title: "پنل من",
      //   icon: "space_dashboard",
      //   // url: `http://localhost:9000/Main/dashboard/?launcherToken=${accessToken}&launcherRefreshToken=${refreshToken}&isLauncher=true`,
      //   url: `https://betaapp.fanapmed.com/Main/dashboard/?launcherToken=${accessToken}&launcherRefreshToken=${refreshToken}&isLauncher=true`,
      // },
      // {
      //   title: "نسخه نویسی",
      //   icon: "text_snippet",
      //   url: "https://www.tamin.ir/",
      // },
      // {
      //   title: "پرونده سلامت",
      //   icon: "assignment",
      //   url: "https://ihio.gov.ir/",
      // },
      // {
      //   title: "تسهیلات",
      //   icon: "account_balance_wallet",
      //   url: "https://wepod.ir/",
      // },
      // {
      //   title: "پشتیبانی",
      //   icon: "question_answer",
      //   url: "https://www.goftino.com/c/PxPXUQ",
      // },
    ];

    const menuItems = ref(fixedMenuItems);

    function styleWebview() {
      let webview_component = document.querySelectorAll("#webview_component");
      webview_component.forEach((element) => {
        let iframe = element.shadowRoot?.querySelector("iframe");
        iframe.style.height = "100%";
        iframe.style.display = "block";
        iframe.style.borderRadius = "12px";
      });
    }

    const activeUrl = ref(null);
    const indexActiveUrl = ref(null);
    const currentComponent = ref("WebviewComponent");
    const fullSideBarClicked = ref(false);
    const menuItemClicked = (item, fullClicked = false, index) => {
      indexActiveUrl.value = index;
      fullSideBarClicked.value = fullClicked;
      activeUrl.value = item.url;
      currentComponent.value = "WebviewComponent";
      pageTitle.value =
        webviewsRef.value?.[indexActiveUrl.value]?.$el.getTitle();
      actualWebviewZoom.value =
        webviewsRef.value?.[indexActiveUrl.value].$el.getZoomFactor();
    };

    const loadedFn = (url) => {
      styleWebview();
    };

    const webviewsRef = ref(null);

    const reloadWebview = () => {
      if (!activeUrl.value) return;
      webviewsRef.value[indexActiveUrl.value].$el.reload();
    };

    const canGoBack = ref(
      webviewsRef.value?.[indexActiveUrl.value]?.$el.canGoBack()
    );
    const canGoForward = ref(
      webviewsRef.value?.[indexActiveUrl.value]?.$el.canGoForward()
    );

    const goBack = () => {
      if (!activeUrl.value) return;
      webviewsRef.value[indexActiveUrl.value].$el.goBack();
    };
    const goForward = () => {
      if (!activeUrl.value) return;
      webviewsRef.value[indexActiveUrl.value].$el.goForward();
    };

    const actualWebviewZoom = ref(null);
    const zoomIn = () => {
      if (!activeUrl.value) return;
      let actualZoom =
        webviewsRef.value[indexActiveUrl.value].$el.getZoomFactor();

      if (actualZoom < 2) {
        webviewsRef.value[indexActiveUrl.value].$el.setZoomFactor(
          actualZoom + 0.1
        );
      }
      actualWebviewZoom.value =
        webviewsRef.value[indexActiveUrl.value].$el.getZoomFactor();
    };
    const zoomOut = () => {
      if (!activeUrl.value) return;
      let actualZoom =
        webviewsRef.value[indexActiveUrl.value].$el.getZoomFactor();

      if (actualZoom >= 0.2) {
        webviewsRef.value[indexActiveUrl.value].$el.setZoomFactor(
          actualZoom - 0.1
        );
      }
      actualWebviewZoom.value =
        webviewsRef.value[indexActiveUrl.value].$el.getZoomFactor();
    };

    const goSetLockPassword = () => {
      lockStore.isLocked = true;
    };

    const failLoad = (err) => {
      console.log(err.target.src);
      if (err.target.src.includes(activeUrl.value)) {
        console.log(err);
      }
    };

    const getUserApp = async () => {
      menuItems.value = fixedMenuItems;
      let activeUnitApplications = [];
      const teamApps = await sysBunny.getTeamApps(authStore.activeUnit.id);
      teamApps.forEach((app) => {
        let tempUrl = `https://fanap.mizbunny.com/apps/${app.name}?appId=${app.appId}&teamId=${authStore.activeUnit.id}`;
        if (app.type === "web") {
          tempUrl = app.url;
        }
        let tempName = app.name;
        if (app.displayName) {
          tempName = app.displayName;
        }
        activeUnitApplications.push({
          title: tempName,
          icon: "",
          logoUrl: "https://fanap.mizbunny.com/store/" + app.name + "/" + app.logo,
          // url: `http://localhost:9000/Main/dashboard/?launcherToken=${accessToken}&launcherRefreshToken=${refreshToken}&isLauncher=true`,
          url: tempUrl,
        });
      });
      // get user applications
      let activeAccountApplications = [];
      //  authStore.activeAccountWorkspaces.userApplications;

      // get unit applications

      // authStore.activeAccountWorkspaces.unitApplications.find((unit) => {
      //   return unit.unit.id === authStore.activeUnit.id;
      // });

      // menuItems.value = [
      //   ...menuItems.value,
      //   ...(activeUnitApplications.applications.length > 0
      //     ? activeUnitApplications.applications
      //     : []),
      //   ...activeAccountApplications,
      // ];
      menuItems.value = [
        ...menuItems.value,
        ...(activeUnitApplications.length > 0 ? activeUnitApplications : []),
        ...activeAccountApplications,
      ];

      console.log(menuItems.value);
    };
    getUserApp();

    // const getProfile = async () => {
    //   try {
    //     const response = await api.get("User/GetProfile");
    //     await authStore.setActiveAccount(response.data.data);
    //     await getUserApp();
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };
    //todo
    // getProfile();
    //getProfile.getProfile();

    const onDidNavigateInPage = (evt) => {
      // first update if webview can go back and forward

      console.log("in on did navigate in page");

      canGoBack.value =
        webviewsRef.value?.[indexActiveUrl.value]?.$el.canGoBack();
      canGoForward.value =
        webviewsRef.value?.[indexActiveUrl.value]?.$el.canGoForward();

      // then get data from url from webview
      const urlParsed = evt.url.split("?");
      if (urlParsed[1]?.includes("profileUpdated")) {
        getProfile.getProfile();
      }
    };

    // watch(
    //   () => authStore.activeAccountWorkspaces.value,
    //   (newVal, oldVal) => {
    //     // console.log("active account workspace changed");
    //     getUserApp();
    //   },
    //   { deep: true }
    // );

    const aiModal = ref(false);

    const aiActions = async (requestData) => {
      let webview = document.getElementsByClassName("isCurrent")[0];

      if (requestData.type === "getHtmlAndUrl") {
        let aiMessage = null;
        if (webview) {
          aiMessage = {
            action: "receiveAIInfo",
            origin: "mizBunnyParent",
            data: {
              html: await webview.executeJavaScript("document.body.outerHTML"),
              url: webview.src,
            },
          };
        } else {
          aiMessage = {
            action: "receiveAIInfo",
            origin: "mizBunnyParent",
            data: {
              html: null,
              url: null,
            },
          };
        }

        document
          .getElementById("webview_ai")
          .contentWindow.postMessage(aiMessage, "*");
      } else if (requestData.type === "closeAIPopup") {
        aiModal.value = false;
      } else if (requestData.type === "sendLetterToWebview") {
        console.log(" sendLetterToWebview");

        debugger;
        let temp = `CKEDITOR.instances["body"].setData(${JSON.stringify(
          requestData.letter
        )});`;
        webview.executeJavaScript(temp, false);
        aiModal.value = false;

        // webview.value.executeJavaScript(
        //   `CKEDITOR.instances["body"].setData("${requestData.letter}");`,
        //   false
        // );
      }
    };

    const webview_ai_src = () => {
      let mode = null;
      // we've selected a webview
      if (activeUrl.value) {
        mode = 2;
      } else {
        mode = 1;
      }
      return `https://aitest.mizbunny.com/popup-mode?mode=${mode}`;
    };

    const externalLinkPopup = ref(false);
    const externalLinkPopupSrc = ref(null);
    onMounted(() => {
      window.ipcRenderer.receiveMessage(async (data) => {
        if (data.origin === "mizBunnyApp") {
          if (data.action === "requestToken") {
            // alert("new request mizBunny requestToken");
            sysBunny
              .appLogin(data.data.appId, data.data.teamId)
              .then((response) => {
                const tokenMessage = {
                  action: "receiveToken",
                  origin: "mizBunnyParent",
                  data: {
                    token: response,
                  },
                };
                // alert("apptoken : "+JSON.stringify(tokenMessage));
                document
                  .getElementsByClassName("isCurrent")[0]
                  .contentWindow.postMessage(tokenMessage, "*");
              });
          } else if (data.action === "AIRequest") {
            // requestData
            aiActions(data.data.requestData);
          }
        }
        // externalLinkPopup.value = true;
        // externalLinkPopupSrc.value = data;
        //console.info("****** message recieved url is : " + data);
      });

      
      window.ipcRenderer.newTab(async (data) => {
        webviewsRef.value?.[indexActiveUrl.value]?.$el.loadURL(data);

        // externalLinkPopup.value = true;
        // externalLinkPopupSrc.value = data;
        //console.info("****** message recieved url is : " + data);

      });
    });

    return {
      lockStore,
      unlock,
      menuItems,
      mainMenuItems,
      hiddenItems,
      updateHiddenItems,
      activeUrl,
      currentComponent,
      menuItemClicked,
      loadedFn,
      styleWebview,
      reloadWebview,
      goBack,
      goForward,
      webviewsRef,
      isMenuSliderShown,
      menuSliderShown,
      goSetLockPassword,
      onDidNavigateInPage,
      fullSideBarClicked,
      getUserApp,
      zoomIn,
      zoomOut,
      actualWebviewZoom,
      pageTitle,
      canGoBack,
      canGoForward,
      externalLinkPopup,
      externalLinkPopupSrc,
      aiModal,
      pathStore,
      webview_ai_src,
    };
  },
};
</script>

<style>
/* #id {
    height: 100vh;
} */

nav a {
  margin: 0 1rem;
  text-decoration: none;
}

.active-slider-menu {
  filter: blur(4px);
}
</style>
