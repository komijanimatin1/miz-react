<template>
  <section class="w-full h-full p-6 flex flex-col gap-y-8 relative">
    <span class="text-xs leading-6 font-medium text-grey-19">سایر برنامه ها</span>
    <div class="flex flex-row items-center gap-x-2 cursor-pointer" v-for="item in menuItems" :key="item.title"
      @click="menuItemClicked(item)">

      <div class="w-5 h-5 image-container">
        <img :src="item.logoUrl" alt="" class="menu-item-img" />
      </div>

      <span class="material-icons-outlined  text-grey-10 font-thin text-base">{{ item.icon }}</span>
      <span class="text-grey-10 text-xs font-bold leading-6">{{
        item.title
      }}</span>
    </div>

    <div class="w-6 h-6 rounded-full bg-grey-2 absolute top-6 left-[-12px] flex flex-col items-center justify-center"
      @click="emit('closeSlideMenu')">
      <span class="material-icons-outlined cursor-pointer text-grey-3 font-thin text-base">chevron_right</span>
    </div>
  </section>
</template>

<script setup>
const props = defineProps(["menuItems"]);
const emit = defineEmits(["closeSlideMenu"]);
const menuItemClicked = (item) => {
  emit("closeSlideMenu");
  emit("menuItemClicked", item, true);
};



</script>

<style lang="scss" scoped>


.image-container {
  filter: invert(360%) brightness(100%) contrast(100%);
  .menu-item-img {
    filter: brightness(0);
  }
}

</style>
