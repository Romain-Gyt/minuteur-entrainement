import { createRouter, createWebHistory } from "vue-router";
import AppLayout from "@/layouts/AppLayout.vue";

// pages
import TrainingBuilder from "@/pages/TrainingBuilder.vue";
import TrainingRunner from "@/pages/TrainingRunner.vue";

const routes = [
  {
    path: "/",
    component: AppLayout,
    children: [
      { path: "", redirect: { name: "builder" } },
      { path: "builder", name: "builder", component: TrainingBuilder },
      { path: "run", name: "run", component: TrainingRunner },
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
