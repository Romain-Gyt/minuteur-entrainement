import { createRouter, createWebHistory } from "vue-router";
import AppLayout from "@/layouts/AppLayout.vue";

// pages
import TrainingBuilder from "@/pages/TrainingBuilder.vue";
import TrainingRunner from "@/pages/TrainingRunner.vue";

import Login from "@/pages/Login.vue";
import Register from "@/pages/Register.vue";
import Dashboard from "@/pages/Dashboard.vue";
import Planning from "@/pages/Planning.vue";

const routes = [
  {
    path: "/",
    component: AppLayout,
    children: [
      { path: "", redirect: { name: "dashboard" } },
      { path: "login", name: "login", component: Login },
      { path: "register", name: "register", component: Register },
      {
        path: "dashboard",
        name: "dashboard",
        component: Dashboard,
        meta: { requiresAuth: true }
      },
      {
        path: "planning",
        name: "planning",
        component: Planning,
        meta: { requiresAuth: true }
      },
      {
        path: "builder/:id?",
        name: "builder",
        component: TrainingBuilder,
        meta: { requiresAuth: true }
      },
      { path: "run", name: "run", component: TrainingRunner },
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token');

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' });
  } else if ((to.name === 'login' || to.name === 'register') && isAuthenticated) {
    next({ name: 'dashboard' });
  } else {
    next();
  }
});
