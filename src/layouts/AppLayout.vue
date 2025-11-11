<script setup>
import HeaderBar from "@/layouts/HeaderBar.vue";
import AppFooter from "@/layouts/AppFooter.vue";
import { RouterView } from "vue-router";
</script>

<template>
  <div class="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
    <HeaderBar>
      <!-- Exemple d’actions dans le header (facultatif)
      <template #actions>
        <button class="px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700">Action</button>
      </template>
      -->
    </HeaderBar>

    <main class="mx-auto max-w-6xl w-full px-6 py-8 flex-1">
      <RouterView v-slot="{ Component }">
        <Transition name="slide" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <AppFooter />
  </div>
</template>

<style>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s ease;
}
.slide-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
