import { defineStore } from "pinia";
import { reactive, ref, watch } from "vue";

export const usePathStore = defineStore("path", () => {
  const basicPath = ref(null);

  const getBasicPath = () => {
    return basicPath.value;
  };

  const setBasicPath = (path) => {
    basicPath.value = path;
  };

  return {
    setBasicPath,
    getBasicPath,
  };
});
