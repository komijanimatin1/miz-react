<template>
  <nav
    id="drag-region"
    class="titlebar w-full bg-grey-4 py-2 px-4 flex flex-row justify-between items-center"
  >
    <div
      class="icon-container flex flex-row items-center gap-x-2 clickable w-[170px]"
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

    <div
      class="title-bar clickable py-1 px-6 w-[300px] rounded-full bg-grey-7 flex flex-row items-center gap-x-6"
    >
      <span
        class="material-icons-outlined cursor-pointer text-grey-3 font-thin text-base"
        @click="reloadWebview"
      >
        refresh
      </span>
      <div class="basis-full flex flex-row items-center justify-between">
        <span
          class="material-icons-outlined cursor-pointer text-grey-3 font-thin text-lg"
          @click="goBack"
          :class="{ '  !text-grey-5': !canGoBack }"
        >
          chevron_right
        </span>
        <span class="text-grey-3 font-bold text-sm w-44 truncate text-center">
          {{ pageTitle || "پنل من" }}
        </span>
        <span
          class="material-icons-outlined cursor-pointer text-grey-3 font-thin text-lg"
          @click="goForward"
          :class="{ '  !text-grey-5': !canGoForward }"
        >
          chevron_left
        </span>
      </div>
    </div>

    <div class="flex flex-row items-center gap-x-6 clickable">
      <div class="relative">
        <span
          ref="settingPopupButton"
          @click="isSettingPopupVisible = !isSettingPopupVisible"
          class="material-icons-outlined cursor-pointer text-grey-3 font-thin text-xl"
        >
          settings
        </span>
        <transition name="fade-in-top">
          <section
            class="settingPopup"
            v-if="isSettingPopupVisible"
            ref="settingPopup"
          >
            <div class="flex flex-row items-center gap-x-2">
              <span class="material-icons-outlined scale-x-[-1] text-xl">
                zoom_in
              </span>
              <span class="font-semibold text-sm">زوم</span>
            </div>
            <div class="flex flex-row items-center gap-x-3">
              <button class="zoom-btn" @click="emit('zoom-out')">
                <span class="material-icons-outlined text-grey-3 text-base">
                  remove
                </span>
              </button>
              <span class="text-grey-3 text-sm">{{
                actualWebviewZoom
                  ? `%${Math.floor(actualWebviewZoom * 100)}`
                  : "100%"
              }}</span>
              <button class="zoom-btn" @click="emit('zoom-in')">
                <span class="material-icons-outlined text-grey-3 text-base">
                  add
                </span>
              </button>
            </div>
          </section>
        </transition>
      </div>

      <div class="relative">
        <span
          class="material-icons-outlined cursor-pointer text-grey-3 font-thin text-xl"
          @click="onLockClick"
          ref="lockPopupButton"
        >
          lock
        </span>
        <transition name="fade-in-top">
          <section class="lockPopup" v-if="isLockpopupVisible" ref="lockPopup">
            <div
              class="flex flex-col items-center justify-center w-8 h-8 rounded-full bg-[#E5FFFBE5]"
            >
              <span class="material-icons-outlined text-primary text-base">
                lock
              </span>
            </div>
            <div class="flex flex-col pt-1 items-start gap-y-2">
              <span class="text-sm font-bold">تعیین رمز عبور</span>
              <span class="text-sm text-[#5C5C5C]"
                >برای امنیت داده های خود در سیستم رمز عبور تعیین کنید.</span
              >
              <button
                @click="lockApp"
                class="btn px-6 py-2 bg-primary rounded-lg flex flex-col justify-center items-center text-white hover:bg-[#30b8a7] transition-all"
              >
                تعیین رمز
              </button>
            </div>
          </section>
        </transition>
      </div>

      <div class="relative">
        <span
          class="material-icons-outlined cursor-pointer text-grey-3 font-thin text-xl aiPopUpBTN"
          @click="onAIClick"
          ref="AIPopupButton"
        >
          waving_hand
        </span>
        <transition name="fade-in-top">
          <section class="AIPopup" v-if="isAIpopupVisible" ref="AIPopup">
            <div
              class="flex flex-col items-center justify-center w-8 h-8 rounded-full bg-[#E5FFFBE5]"
            >
              <span class="material-icons-outlined text-primary text-base">
                waving_hand
              </span>
            </div>
            <div class="flex flex-col pt-1 items-start gap-y-2">
              <span class="text-sm font-bold">دستیار میزبانی</span>
              <span class="text-sm text-[#5C5C5C]"
                >می می تونم تو نامه زدن، یا نوشتن متن بهت کمک کنم. آیا الان به
                کمک من نیاز داری؟</span
              >
              <button
                @click="launchAI"
                class="btn px-6 py-2 bg-primary rounded-lg flex flex-col justify-center items-center text-white hover:bg-[#30b8a7] transition-all"
              >
                شروع
              </button>
            </div>
          </section>
        </transition>
      </div>

      <div class="w-[1px] bg-grey-15 h-4"></div>

      <div class="rounded-full relative">
        <div
          @click="showAccountMenu"
          class="flex flex-row items-center justify-between gap-x-2 w-[150px]"
          ref="menuButton"
        >
          <div class="flex flex-row items-center gap-x-2">
            <img
              :src="logoUrl(authStore.activeUnit.logo)"
              alt="user-profile"
              class="cursor-pointer w-6 h-6 rounded-full"
              style="display: none;"
            />
            <span
              class="cursor-pointer text-xs font-bold text-grey-3 w-20 truncate"
              >{{ activeUnit }}</span
            >
          </div>
          <span
            class="material-icons-outlined text-grey-3 transition-all duration-300"
            :class="{ 'rotate-180': accountMenu }"
          >
            expand_more
          </span>
        </div>
        <transition name="fade-in-top">
          <section class="menu" v-if="accountMenu" ref="headerMenu">
            <div
              v-for="unit in units"
              :key="unit.id"
              @click="changeActiveUnit(unit)"
              class="flex flex-row items-center justify-between cursor-pointer hover:bg-soft-primary rounded-lg transition-all"
            >
              <div class="flex flex-row items-center gap-x-2">
                <img :src="logoUrl(unit.logo)" alt="" class="w-8 h-8 rounded-full"
                style="display: none;" />
                <span class="text-sm font-bold leading-6">{{
                  unit.title
                }}</span>
              </div>
              <span
                v-if="unit.id === authStore.activeUnit.id"
                class="material-icons text-primary"
              >
                check_circle
              </span>
            </div>
            <hr />
            <div
              class="flex flex-row gap-x-2 items-center cursor-pointer"
              @click="addNewAccount"
            >
              <span class="material-icons-outlined font-light">
                group_add
              </span>
              <span class="text-sm leading-6">افزودن حساب کاربری</span>
            </div>

            <div
              class="flex flex-row gap-x-2 items-center cursor-pointer"
              @click="selectAccount"
            >
              <span class="material-icons-outlined font-light">
                people_alt
              </span>
              <span class="text-sm leading-6">تغییر حساب کاربری</span>
            </div>
            <div
              class="flex flex-row gap-x-2 items-center cursor-pointer"
              @click="showLogoutModal"
            >
              <span
                class="material-icons-outlined font-light rotate-180 text-negative"
              >
                logout
              </span>
              <span class="text-sm leading-6 text-negative">خروج از حساب</span>
            </div>
          </section>
        </transition>
      </div>
    </div>

    <!-- logout modal -->
    <section
      class="backdrop absolute top-0 left-0 w-screen h-screen bg-[#0000003b] backdrop-blur z-30"
      v-if="logoutModalVisible"
      @click="logoutModalVisible = false"
    ></section>

    <transition name="fade-in-logout-modal">
      <section v-if="logoutModalVisible" class="logout-modal">
        <div class="flex flex-row items-center justify-between">
          <span class="text-base font-bold">خروج از حساب</span>
          <span
            class="material-icons-outlined cursor-pointer"
            @click="logoutModalVisible = false"
          >
            close
          </span>
        </div>
        <span
          >آیا می خواهید از حساب مطب {{ authStore.activeUnit.title }} خارج
          شوید؟</span
        >

        <div class="flex flex-row-reverse items-center gap-x-2 w-full">
          <button
            class="bg-negative-5 px-6 py-2 text-white rounded-lg"
            @click="logout"
          >
            <span class="text-sm"> خروج از حساب </span>
          </button>
          <button
            class="px-6 py-2 text-grey-22"
            @click="logoutModalVisible = false"
          >
            <span>انصراف</span>
          </button>
        </div>
      </section>
    </transition>
  </nav>
</template>

<script setup>
import {
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
  reactive,
  computed,
} from "vue";
import { useAuthStore } from "../../stores/Authentication";
import { useLockStore } from "../../stores/LockStatus";
import { launcherApi } from "../../../axios";

const authStore = useAuthStore();
const lockScreen = useLockStore();

const props = defineProps([
  "actualWebviewZoom",
  "pageTitle",
  "canGoBack",
  "canGoForward",
]);

console.log(props);

const emit = defineEmits([
  "reloadWebview",
  "goBack",
  "goForward",
  "setPassword",
  "active-unit-changed",
  "zoom-in",
  "zoom-out",
  "aiPopupShow",
]);

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

const activeUnit = computed(() => {
  return authStore.activeUnit.title;
});

// setting popup
const settingPopup = ref(null);
const isSettingPopupVisible = ref(false);
const settingPopupButton = ref(null);

// lock popup
const lockPopup = ref(null);
const isLockpopupVisible = ref(false);
const lockPopupButton = ref(null);
const AIPopup = ref(null);
const AIPopupButton = ref(null);
const isAIpopupVisible = ref(false);
const onLockClick = () => {
  if (!!lockScreen.hasPassword) {
    lockScreen.lockApp();
  } else {
    isLockpopupVisible.value = !isLockpopupVisible.value;
  }
};
const lockApp = () => {
  isLockpopupVisible.value = false;
  // emit to main layout that go to the setLock component
  emit("setPassword");
};
const onAIClick = () => {
  aiType = 0;
  aiData = null;
  isAIpopupVisible.value = true;
};

const launchAI = () => {
  isAIpopupVisible.value = false;
  // const modal = document.getElementById('modal');
  //   modal.classList.remove('hidden');

  const inputField = document.getElementById("inputField");
  inputField.value = "";
  emit("aiPopupShow");
};

window.launchAI = launchAI;


// account menu
const headerMenu = ref(null);
const menuButton = ref(null);
const units = ref([]);
const logoUrl = (url) => {
  if (url) {
    return "https://betaapi.fanapmed.com" + url;
  } else {
    return "../../src/assets/Images/userImage.png";
  }
};
const handleClickOutside = (event) => {
  if (
    headerMenu.value &&
    !headerMenu.value.contains(event.target) &&
    menuButton.value &&
    !menuButton.value.contains(event.target)
  ) {
    accountMenu.value = false;
  } else if (
    lockPopup.value &&
    !lockPopup.value.contains(event.target) &&
    lockPopupButton.value &&
    !lockPopupButton.value.contains(event.target)
  ) {
    isLockpopupVisible.value = false;
  } else if (
    AIPopup.value &&
    !AIPopup.value.contains(event.target) &&
    AIPopupButton.value &&
    !AIPopupButton.value.contains(event.target)
  ) {
    isAIpopupVisible.value = false;
  } else if (
    settingPopup.value &&
    !settingPopup.value.contains(event.target) &&
    settingPopupButton.value &&
    !settingPopupButton.value.contains(event.target)
  ) {
    isSettingPopupVisible.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

const getActiveAccountUnits = async () => {
  units.value = [];
  try {
    // const response = await launcherApi.get("Workspace/GetWorkspaceProfile");
    const teams = await sysBunny.getTeams();
    // const tempUnit = response.data.data.unitApplications;
    teams.forEach((team) => {
      let parsedUnit = {
        id: team._id,
        title: team.name,
        logo: team.logo,
      };

      // const logoUrl = (url) => {
      //   if (url) {
      //     return "https://betaapi.fanapmed.com" + url;
      //   }
      // };

      // if (
      //   team.logo &&
      //   team.logo != "/Assets/Units/Default.jpg"
      // ) {
      //   parsedUnit.logo = logoUrl(team.logo);
      // } else {
      //   parsedUnit.logo = "../../src/assets/Images/userImage.png";
      // }

      units.value.push(parsedUnit);
    });
  } catch (error) {
    console.error(error);
  }
};
getActiveAccountUnits();

watch();
// () => authStore.activeAccountWorkspaces.value,
// (newVal, oldVal) => {
//   getActiveAccountUnits();
// },
// { deep: true }

const changeActiveUnit = (unit) => {
  authStore.setActiveUnit(unit);
  emit("active-unit-changed");
  accountMenu.value = false;
};

const accountMenu = ref(false);
const showAccountMenu = () => {
  accountMenu.value = !accountMenu.value;
};

const selectAccount = () => {
  authStore.selectAccount();
};

const logoutModalVisible = ref(false);
const showLogoutModal = () => {
  logoutModalVisible.value = true;
  accountMenu.value = false;
};

const logout = () => authStore.logout();
const addNewAccount = () => authStore.addNewAccount();
</script>

<style lang="scss" scoped>
.menu {
  @apply absolute top-10 left-0 shadow-md bg-white w-[260px] rounded-lg z-[20] p-4 flex flex-col gap-y-4;
}

.lockPopup {
  @apply absolute top-10 left-0 shadow-md bg-white w-[360px] rounded-lg z-[100] p-4 flex flex-row gap-x-2;
}

.AIPopup {
  @apply absolute top-10 left-0 shadow-md bg-white w-[360px] rounded-lg z-[100] p-4 flex flex-row gap-x-2;
}

.settingPopup {
  @apply absolute top-10 left-0 shadow-md bg-white w-[260px] rounded-lg z-[100] p-4 flex flex-row items-center justify-between;

  .zoom-btn {
    @apply w-6 h-6 rounded-full bg-green-18 flex flex-col items-center justify-center;
  }
}

.logout-modal {
  @apply absolute top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%] w-[600px] p-6 bg-white z-[31] rounded-lg flex flex-col gap-y-6;
}
</style>
