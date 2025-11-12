import { createRouter, createWebHashHistory } from "vue-router";
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
  // Use Vite's injected base to work under subfolders (e.g., GitHub Pages)
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
