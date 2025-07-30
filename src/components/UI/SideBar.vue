<template>
  <aside
    class="z-10 right-0 bottom-0 min-w-[120px] flex flex-col items-center justify-center px-4 overflow-hidden"
    ref="sidebar"
  >
    <div
      class="nabvar-items flex flex-col min-w-[75px] h-full items-center gap-y-8 px-2 py-6 bg-grey-17 rounded-lg overflow-hidden"
    >
      <div
        v-for="item in mainMenuItems"
        :key="item"
        class="w-full flex flex-col items-center gap-y-1 cursor-pointer"
      >
        <span
          class="material-icons-outlined cursor-pointer text-grey-10 font-thin text-base"
        >
          {{ item.icon }}
        </span>

        <span class="text-[10px] text-grey-10 font-bold">{{
          item.title
        }}</span>
      </div>

      <div
        v-for="(item, index) in visibleItems"
        :key="item.id"
        class="w-full flex flex-col items-center gap-y-1 cursor-pointer"
        @click="menuItemClicked(item, false, index)"
        :class="{ active: isActiveExternal(item.url) }"
      >
        <span
          class="material-icons-outlined cursor-pointer text-grey-10 font-thin text-base"
          v-if="!!item.icon"
        >
          {{ item.icon }}
        </span>
        <div v-else-if="!!item.logoUrl" class="w-5 h-5 image-container">
          <img :src="logoUrl(item.logoUrl)" alt="" class="menu-item-img" />
        </div>
        <span
          class="text-[10px] text-grey-10 font-bold w-[72px] truncate text-center"
          >{{ item.title }}</span
        >
      </div>

      <div>
        <button
          class="w-8 !h-8 flex flex-col items-center justify-center cursor-pointer bg-grey-2 rounded-full"
          v-if="hiddenItemCount > 0"
          @click="showAllItems"
        >
          <span class="text-[10px] font-semibold text-grey-12"
            >{{ hiddenItemCount }} +
          </span>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  nextTick,
  watch,
} from "vue";

const props = defineProps(["menuItems", "mainMenuItems", "fullSideBarClicked"]);
const emit = defineEmits([
  "menuItemClicked",
  "menuSliderShown",
  "updateHiddenItems",
]);

const sidebar = ref(null);
const hiddenItemCount = ref(0);
const hiddenItems = ref([]);
const visibleItems = ref([]);

const mainMenuItems = ref(props.mainMenuItems);

const menuItems = ref(props.menuItems);

const activeExternalLink = ref("");

const isActiveExternal = (url) => {
  return activeExternalLink.value === url && !props.fullSideBarClicked;
};

const menuItemClicked = (item, _, index) => {
  activeExternalLink.value = item.url;
  emit("menuItemClicked", item, _, index);
};

const showAllItems = () => {
  emit("menuSliderShown");
};

const findMissingElements = (mainArr, secondArr) => {
  let tempArr = [];
  mainArr.forEach((el) => {
    if (!secondArr.some((element) => element.title === el.title)) {
      tempArr.push(el);
    }
  });
  return tempArr;
};

const updateVisibleItems = () => {
  nextTick(() => {
    const sidebarHeight = sidebar.value.clientHeight;
    const itemHeight = 70; // Adjust based on your item height
    const maxVisibleItems = Math.floor(sidebarHeight / itemHeight);
    visibleItems.value = menuItems.value.slice(0, maxVisibleItems - 1);
    hiddenItems.value = findMissingElements(
      menuItems.value,
      visibleItems.value
    );
    emit("updateHiddenItems", hiddenItems.value);

    hiddenItemCount.value = menuItems.value.length - visibleItems.value.length;
  });
};

onMounted(() => {
  updateVisibleItems();
  window.addEventListener("resize", updateVisibleItems);
});

const logoUrl = (url) => {
  if (url) {
    if(url.toLowerCase().startsWith("http")){
      return url;
    }
    return "https://betaapi.fanapmed.com" + url;
  }
};

watch(
  () => props.menuItems,
  (newVal, oldVal) => {
    menuItems.value = props.menuItems;
    updateVisibleItems();
    console.log("menu items changed");
  },
  { deep: true, immediate: true }
);
</script>

<style lang="scss" scoped>
.menu-modal {
  width: 500px;
  height: 400px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  background-color: white;
  border-radius: 12px;
}

.active {
  position: relative;

  span {
    color: #ffffff;
  }
  &::before {
    display: block;
    content: "";
    width: 4px;
    height: 36px;
    background-color: #ffffff;
    position: absolute;
    top: 50%;
    right: -7px;
    transform: translateY(-50%);
    border-radius: 8px 0 0 8px;
  }
}

.image-container {
  filter: invert(360%) brightness(100%) contrast(100%);
  .menu-item-img {
    filter: brightness(0);
  }
}

.image-container-green {
  filter: invert(30%) sepia(13%) saturate(3939%) hue-rotate(131deg)
    brightness(97%) contrast(96%);
  .menu-item-img {
    filter: brightness(0);
  }
}

</style>
