const routes = [
  {
    path: "/Dashboard",
    component: () => import("../layouts/MainLayout.vue"),
    // redirect: { name: "dashboard" },
    meta: { requiresAuth: true },
    name: "dashboard",
  },

  {
    path: "/",
    name: "login",
    component: () => import("../layouts/AuthLayout.vue"),
  },

  {
    path: "/:catchAll(.*)*",
    component: () => import("../layouts/ErrorNotFound.vue"),
  },
];

export default routes;
