<template>
  <section
    class="w-1/2 min-h-[480px] flex flex-col items-center justify-center gap-y-4 p-6 rounded-xl max-w-[928px] bg-[#FFFFFF66]"
  >
    <transition name="slide-out-up">
      <lock-screen
        v-if="lockStore.isLocked && lockStore.hasPassword"
        @unlock="unlock"
        @logout="emit('logout')"
        @selectAccount="emit('logout')"
      ></lock-screen>
    </transition>

    <div
      v-if="!(lockStore.isLocked && lockStore.hasPassword)"
      class="card w-full h-full flex flex-col items-center justify-center gap-y-4"
    >

    <div
      class="clickable fixed left-4 top-0 translate-y-[-50%]" style="margin-top: 26px;z-index: 10;"
    >
      <button
        class="rounded-lg flex flex-row justify-center items-center gap-x-2 text-black"
        @click="backToSelectAccount(unit)"
      >
        <span class="text-sm font-bold"> صفحه اصلی </span>
        <span class="material-icons-outlined text-base"> chevron_left </span>
      </button>
    </div>

      <div class="flex flex-col items-center justify-center gap-y-3 border border-grey-4 bg-white">
        <span class="text-grey-18 font-demibold leading-5"
          >میزکار خود را انتخاب کنید</span
        >
      </div>

      <transition name="fade-in-top" mode="out-in">
        <div v-if="!isLoading" class="grid grid-cols-3 gap-4">
          <div
            class="unit-card flex flex-col items-center justify-center gap-y-4 rounded-xl bg-[#FFFFFF66] p-6 cursor-pointer w-[208px]"
            v-for="unit in userUnits"
            :key="unit.id"
            @click="unitSelected(unit)"
          >
            <img
              v-if="unit.logo"
              :src="unit.logo"
              alt="logo"
              class="w-14 h-14"
            />
            <div
              v-else
              class="w-14 h-14 rounded-full border flex flex-col items-center justify-center"
            >
              <span class="material-icons-outlined text-3xl text-primary">
                apartment
              </span>
            </div>
            <span class="text-primary font-bold text-sm leading-5">{{
              unit.title
            }}</span>
          </div>
        </div>

        <div v-else role="status">
          <svg
            aria-hidden="true"
            class="w-8 h-8 text-gray-200 animate-spin dark:text-soft-primary fill-primary"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span class="sr-only">Loading...</span>
        </div>
      </transition>
    </div>
  </section>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/Authentication";
import { launcherApi } from "../../../axios.js";
import { useLockStore } from "../../stores/LockStatus";
import LockScreen from "../LockScreen.vue";

const router = useRouter();
const isLoading = ref(true);
const authStore = useAuthStore();
const lockStore = useLockStore();


const emit = defineEmits(["logout", "unitSelect"]);

const unlock = () => {
  lockStore.unlockApp();
  console.log(lockStore.isLocked);
};



// const userUnits = ref([
//   {
//     id: 1,
//     name: "مطب شهرک غرب",
//     logo: "",
//   },
//   {
//     id: 2,
//     name: "مطب میرداماد",
//     logo: "",
//   },
// ]);

const userUnits = ref([]);

const getUnitsOfAccount = async (accessToken,refreshToken) => {
  isLoading.value = true;
  try {
    // const response = await axios.get(
    //   "https://betaapi.fanapmed.com/Api/Workspace/GetWorkspaceProfile",
    //   {
    //     headers: {
    //       Authorization: `Bearer ${accessToken}`,
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );
    sysBunny.token = accessToken; 
    sysBunny.refreshToken = refreshToken;
    const teams = await sysBunny.getTeams();
  
    // const response = await launcherApi("Workspace/GetWorkspaceProfile");
    //authStore.setActiveAccountWorkspaces(response.data.data);
    // set users units
    //const unitApplications = response.data.data.unitApplications;

    teams.forEach((team) => {
      let tempUnit = {
        id: team._id,
        title: team.name,       
        logo:  team.logo,
      };

      const logoUrl = (url) => {
        if (url) {
          return "https://betaapi.fanapmed.com" + url;
        }
      };

      if (team.logo) {
        tempUnit.logo = logoUrl(team.logo);
      } else {
        // tempUnit.logo = "../../assets/Images/userImage.png";
        tempUnit.logo = "";
      }
      userUnits.value.push(tempUnit);
    });
    isLoading.value = false;
    // console.log(response);

    // if there's just one unit for this user, just go inside of the app, doesn't need to select it
    debugger
    if (userUnits.value.length >= 1) {
      unitSelected(userUnits.value[0]);
    }
  } catch (error) {
    console.error(error);
    // if (error.response.status === 401) {
    //   authStore.logout();
    // }
  }
};
getUnitsOfAccount(authStore.activeAccount.accessToken,authStore.activeAccount.refreshToken);


const selectedComponent = ref("WelcomePage");

const backToSelectAccount = () => {
  selectedComponent.value = "SelectAccount";
  alert("back to select account")
};


const unitSelected = (unit) => {
  authStore.setActiveUnit(unit);
  router.replace({ name: "dashboard" });
  // router.push("/");
};
</script>

<style lang="scss" scoped></style>
