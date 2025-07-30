<template>
  <section
    class="w-full h-screen flex flex-col items-center justify-center gap-y-10"
  >
    <img src="../assets/Images/net-err.svg" alt="" />
    <span class="text-lg leading-5 text-grey-20 font-medium"
      >دسترسی شما به اینترنت قطع می باشد ، اتصال خود بررسی کنید.</span
    >
    <span class="retry-btn bg-primary py-4 px-6 rounded-xl text-white w-[260px] flex flex-row items-center justify-center cursor-pointer leading-5 font-bold">تلاش مجدد</span>
  </section>
</template>

<style scoped lang="scss">
.retry-btn {
  box-shadow: 0px 30px 60px 0px #0000001a, 0px 15px 30px 0px #0000000d;
}
</style>
