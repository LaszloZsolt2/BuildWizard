import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import PrimeSampleView from "../views/PrimeSampleView.vue";
import ComponentsView from "../views/ComponentsView.vue";
import ComponentsListView from "../views/ComponentsListView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/builds",
    name: "builds",
    component: ComponentsListView,
  },
  {
    path: "/primevuesample",
    name: "sample",
    component: PrimeSampleView,
  },
  {
    path: "/components/:type",
    name: "components",
    component: ComponentsView,
    props: (route) => ({ type: route.params.type }),
  },
  {
    path: "/",
    name: "home",
    component: ComponentsListView,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
