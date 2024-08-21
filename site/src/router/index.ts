import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import PrimeSampleView from "../views/PrimeSampleView.vue";
import ComponentsView from "../views/ComponentsView.vue";
import ComponentsListView from "../views/ComponentsListView.vue";

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
  {
    path: "/components/:type",
    name: "components",
    component: ComponentsView,
    props: (route) => ({ type: route.params.type }),
  },
  {
    path: "/componentslist",
    name: "componentslist",
    component: ComponentsListView,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
