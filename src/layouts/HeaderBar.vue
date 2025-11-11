<script setup>
import { RouterLink, useRoute } from "vue-router";
const route = useRoute();
const isActive = (name) => route.name === name;
</script>

<template>
  <header
    class="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-md"
  >
    <div
      class="mx-auto max-w-6xl px-6 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <h1 class="text-xl font-bold tracking-wide text-emerald-400">
        Training App
      </h1>

      <nav class="flex gap-2">
        <RouterLink
          :to="{ name: 'builder' }"
          class="px-4 py-2 rounded-lg font-medium transition-colors"
          :class="
            isActive('builder')
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-neutral-300 hover:text-emerald-400'
          "
        >
          🧩 Builder
        </RouterLink>
        <RouterLink
          :to="{ name: 'run' }"
          class="px-4 py-2 rounded-lg font-medium transition-colors"
          :class="
            isActive('run')
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-neutral-300 hover:text-emerald-400'
          "
        >
          ⏱ Runner
        </RouterLink>
      </nav>

      <!-- Slot optionnel pour actions à droite -->
      <div class="flex gap-2" v-if="$slots.actions">
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>
