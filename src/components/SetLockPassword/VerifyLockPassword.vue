<template>
  <section
    class="bg-soft-primary h-full p-4 z-[1000] flex flex-col items-center justify-center gap-y-4 relative"
  >
    <img src="../../assets/Images/lock.svg" alt="" />
    <span class="font-bold text-primary text-base leading-6"
      >تکرار رمز عبور</span
    >
    <span class="font-bold text-sm leading-5 text-grey-21"
      >رمز عبور 4 رقمی خود را مجددا وارد کنید.</span
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

    <span
      class="text-xs font-semibold leading-6 text-negative-4"
      v-if="errMessage"
      >{{ errMessage }}</span
    >

    <button
      class="bg-primary w-[260px] h-12 rounded-xl text-white"
      @click="verifyLockPassword(digits)"
    >
      تایید
    </button>
  </section>
</template>

<script>
import { ref, getCurrentInstance } from "vue";
import { useLockStore } from "../../stores/LockStatus";
import router from "../../router";
import { useRouter } from "vue-router";
export default {
  props: ["tempPassword"],
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

  setup(props, { emit }) {
    const router = useRouter();
    const instance = getCurrentInstance();

    const errMessage = ref("");
    const lockStatus = useLockStore();

    const verifyLockPassword = (pass) => {
      // confirm should be same with the initail password
      if (
        pass === props.tempPassword &&
        instance.proxy.digits[0] &&
        instance.proxy.digits[1] &&
        instance.proxy.digits[2] &&
        instance.proxy.digits[3]
      ) {
        lockStatus.setPassword(pass);
        errMessage.value = "";
        lockStatus.isLocked = false;
      } else {
        errMessage.value = "تکرار رمز عبور تطابق ندارد";
        instance.proxy.digits = ["", "", "", ""];
      }
    };
    return {
      errMessage,
      verifyLockPassword,
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
</style>
