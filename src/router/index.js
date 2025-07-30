import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";

import { useAuthStore } from "../stores/Authentication.js";

const router = createRouter({
  // THE MOST IMPORTANT THING FOR BUILDING IT RIGHT IS THIS FUNCTION
  // IT HAS TO BE 'CREATEWEBHASHHISTORY' NOT 'CREATEWEBHISTORY'
  history: createWebHashHistory(),
  linkActiveClass: "active",
  linkExactActiveClass: "exact-active",
  routes,
});

router.beforeEach((to, from, next) => {
  // Check if the route requires authentication
  const authStore = useAuthStore();
  if (to.meta.requiresAuth) {
    // If the user has a valid accessToken, allow navigation
    if (authStore.activeAccount?.accessToken) {
      next();
    } else {
      // Redirect to authLayout if not authenticated
      next({ name: "login" });
    }
  } else if (!!authStore.activeAccount) {
    // **ATTENTION** condition if the to: 404, next(), not redirect to dashboard
    next({ name: "dashboard" });
    // For routes that don't require authentication, allow navigation
  } else next();
});

export default router;
