<template>
  <div
    class="w-1/2 min-h-[480px] p-6 rounded-xl max-w-[928px] flex flex-col items-center justify-center gap-y-4"
  >
    <div class="flex flex-col items-center justify-center gap-y-3">
      <span class="text-grey-18 font-demibold leading-5 font-bold text-lg"
        >حساب کاربری خود را انتخاب کنید.</span
      >
    </div>

    <div
      class="grid grid-cols-3 gap-4 justify-center items-center"
      v-if="accounts.length > 0"
    >
      <div
        class="unit-card flex flex-col items-center justify-center gap-y-4 rounded-xl p-6 cursor-pointer w-[208px]"
        v-for="(account, index) in accounts"
        :key="account.phoneNumber"
        @click="accountSelected(index)"
      >
        <!-- <img src="../../assets/Images/unit-img.png" alt="" /> -->
        <span class="material-icons-outlined text-grey-12 text-5xl">
          account_circle
        </span>
        <span
          class="text-grey-12 font-bold text-sm leading-5"
          v-if="!!account.firstName && !!account.lastName"
          >{{ account.firstName + " " + account.lastName }}</span
        >
        <span v-else class="text-grey-12 font-bold text-sm leading-5"
          >کاربر</span
        >
      </div>

      <div
        class="unit-card flex flex-col items-center justify-center gap-y-4 rounded-xl p-6 cursor-pointer w-[208px]"
        @click="addAccount()"
      >
        <div
          class="flex flex-col items-center justify-center rounded-full bg-white w-12 h-12 border border-green-12 border-dashed"
        >
          <span class="material-icons-outlined text-grey-12 text-3xl">
            add
          </span>
        </div>
        <span class="text-grey-12 font-bold text-sm leading-5">
          افزودن حساب جدید
        </span>
      </div>
    </div>

    <div v-else class="flex flex-row items-center justify-center">
      <div
        class="unit-card flex flex-col items-center justify-center gap-y-4 rounded-xl p-6 cursor-pointer w-[208px]"
        @click="addAccount()"
      >
        <div
          class="flex flex-col items-center justify-center rounded-full bg-white w-12 h-12 border border-green-12 border-dashed"
        >
          <span class="material-icons-outlined text-grey-12 text-3xl">
            add
          </span>
        </div>
        <span class="text-grey-12 font-bold text-sm leading-5">
          افزودن حساب جدید
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/Authentication";

const emit = defineEmits(["is-authenticated", "addAccount"]);

const { accounts, activeAccount } = useAuthStore();
const authStore = useAuthStore();

const router = useRouter();

const accountSelected = (index) => {
  authStore.setActiveAccount(accounts[index]);
  emit("is-authenticated", accounts.length);
};

const addAccount = () => {
  emit("addAccount");
};
</script>

<style lang="scss" scoped></style>
