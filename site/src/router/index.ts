import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import PrimeSampleView from "../views/PrimeSampleView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/builds",
    name: "builds",
    component: HomeView,
  },
  {
    path: "/primevuesample",
    name: "sample",
    component: PrimeSampleView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
