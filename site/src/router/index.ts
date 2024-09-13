import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import PrimeSampleView from "../views/PrimeSampleView.vue";
import ComponentsView from "../views/ComponentsView.vue";
import ComponentsListView from "../views/ComponentsListView.vue";
import Compare from "../views/Compare.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/primevuesample",
    name: "sample",
    component: PrimeSampleView,
  },
  {
    path: "/components",
    name: "components",
    component: ComponentsView,
    props: (route) => ({ type: route.query.type }),
  },
  {
    path: "/",
    name: "home",
    component: ComponentsListView,
    props: (route) => ({ type: route.query.type }),
  },
  {
    path: "/compare",
    name: "compare",
    component: Compare,
    props: (route) => ({ type: route.query.type }),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
