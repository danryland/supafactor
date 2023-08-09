import SignIn from "pages/SignIn.vue";
import DashboardPage from "pages/DashboardPage.vue";

const routes = [
  {
    path: "/",
    alias: "/sign-in",
    component: SignIn,
  },
  {
    path: "/dashboard",
    component: DashboardPage,
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
