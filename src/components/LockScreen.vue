<template>
  <section
    class="absolute top-[50px] left-0 bg-soft-primary p-4 w-screen h-[calc(100vh-50px)] z-[1000] flex flex-col items-center justify-center"
  >
    <div
      class="w-full h-full bg-[#FFFFFF4D] rounded-xl flex flex-col items-center justify-center gap-y-4 relative"
    >
      <img src="../assets/Images/lock.svg" alt="" />
      <span class="font-bold text-primary text-base leading-6">{{
        " " +
        authStore.activeAccount?.firstName +
        " " +
        authStore.activeAccount?.lastName
      }}</span>
      <span class="font-bold text-sm leading-5 text-grey-21"
        >رمز عبور خود را برای ورود به سیستم وارد کنید</span
      >

      <div class="input-container flex flex-row-reverse items-center gap-x-3">
        <input
          type="password"
          ref="input1"
          maxlength="1"
          v-model="digits[0]"
          @input="focusNextInput(1, $event)"
          autofocus
        />
        <input
          type="password"
          ref="input2"
          maxlength="1"
          v-model="digits[1]"
          @input="focusNextInput(2, $event)"
        />
        <input
          type="password"
          ref="input3"
          maxlength="1"
          v-model="digits[2]"
          @input="focusNextInput(3, $event)"
        />
        <input
          type="password"
          ref="input4"
          maxlength="1"
          v-model="digits[3]"
          @input="focusNextInput(4, $event)"
        />
      </div>

      <span class="h-6 text-xs font-semibold leading-6 text-negative-4">{{
        errMessage
      }}</span>

      <div
        class="absolute top-6 right-6 flex flex-row gap-x-2 items-center cursor-pointer"
        @click="logoutModalVisible = true"
      >
        <span class="material-icons-outlined text-grey-12"> delete </span>
        <span class="font-semibold text-sm leading-6 text-grey-12"
          >حذف حساب کاربری</span
        >
      </div>

      <div
        class="absolute top-6 left-6 flex flex-row gap-x-2 items-center cursor-pointer"
        @click="selectAccount"
      >
        <span class="material-icons-outlined text-grey-12"> person </span>
        <span class="font-semibold text-sm leading-6 text-grey-12"
          >انتخاب کاربر</span
        >
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
        <span>آیا می خواهید از حساب خود خارج شوید؟</span>

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
  </section>
</template>

<script>
import { ref, getCurrentInstance } from "vue";
import { useLockStore } from "../stores/LockStatus";
import { useAuthStore } from "../stores/Authentication.js";
import router from "../router";
import { useRouter } from "vue-router";
export default {
  data() {
    return {
      digits: ["", "", "", ""],
    };
  },
  methods: {
    focusNextInput(index, event) {
      let value = event.target.value;
      if (/\d/.test(value)) {
        if (index < 4) {
          this.$refs[`input${index + 1}`].focus();
        }
        if (
          this.digits[0] &&
          this.digits[1] &&
          this.digits[2] &&
          this.digits[3]
        ) {
          // this is sending the request as well
          this.$refs.input1.focus();
          console.log(this.digits.join(""));
          const joinedCode = this.digits.join("");
          this.verifyLockPassword(joinedCode);
        }
      } else {
        event.target.value = "";
      }
    },
  },
  mounted() {
    this.$refs[`input1`].focus();
  },

  setup(_, { emit }) {
    const router = useRouter();
    const instance = getCurrentInstance();

    const errMessage = ref("");
    const lockStatus = useLockStore();
    const authStore = useAuthStore();

    const logoutModalVisible = ref(false);

    const verifyLockPassword = (pass) => {
      if (pass === lockStatus.correctPassword) {
        console.log("you're in");
        emit("unlock");
      } else {
        errMessage.value = "رمز اشتباه وارد شده. مجددا امتحان کنید";
        instance.proxy.digits = ["", "", "", ""];
      }
    };

    const logout = async () => {
      // Logout from the launcher
      emit("logout");
      authStore.logout();
    };

    const selectAccount = () => {
      authStore.selectAccount();
      lockStatus.hasPassword = null;
      emit("selectAccount");
    };
    return {
      errMessage,
      verifyLockPassword,
      logout,
      authStore,
      logoutModalVisible,
      selectAccount,
    };
  },
};
</script>

<style lang="scss" scoped>
.input-container {
  input {
    @apply w-8 h-8 outline-none border text-center p-0 rounded-md text-lg pb-[2px] pl-[1px];
  }
}

.logout-modal {
  @apply absolute top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%] w-[600px] p-6 bg-white z-[31] rounded-lg flex flex-col gap-y-6;
}
</style>
