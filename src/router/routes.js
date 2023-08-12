import SignIn from "pages/SignIn.vue";
import DashboardPage from "pages/DashboardPage.vue";
import ReviewPage from "pages/ReviewPage.vue";
import BadgePage from "pages/BadgePage.vue";

const routes = [
  {
    path: "/",
    alias: "/sign-in",
    component: SignIn,
  },
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "/dashboard", name: "dashboard", component: DashboardPage },
      { path: "/review/:repo_name", name: "review", component: ReviewPage },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
