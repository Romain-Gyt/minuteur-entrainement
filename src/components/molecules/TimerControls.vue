<script setup>
const emit = defineEmits(["play", "pause", "reset"]);
const props = defineProps({ running: { type: Boolean, default: false } });
</script>

<template>
  <div class="flex items-center justify-center gap-6 w-full max-w-sm mx-auto">
    <!-- Reset Button -->
    <button
      @click="emit('reset')"
      class="p-4 rounded-full bg-neutral-800/50 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-all active:scale-95 backdrop-blur-sm"
      title="Réinitialiser"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
        <path d="M3 3v5h5"/>
      </svg>
    </button>

    <!-- Play/Pause Button (Hero) -->
    <button
      v-if="!running"
      @click="emit('play')"
      class="p-6 rounded-full bg-white text-neutral-950 hover:bg-neutral-200 hover:scale-105 transition-all shadow-lg shadow-white/10 active:scale-95"
      title="Démarrer"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
      </svg>
    </button>

    <button
      v-else
      @click="emit('pause')"
      class="p-6 rounded-full bg-neutral-800 text-white hover:bg-neutral-700 hover:scale-105 transition-all shadow-lg shadow-black/20 active:scale-95 border border-white/10"
      title="Pause"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <rect x="6" y="4" width="4" height="16"></rect>
        <rect x="14" y="4" width="4" height="16"></rect>
      </svg>
    </button>

    <!-- Placeholder for symmetry or future button (e.g. skip) -->
    <div class="w-14"></div>
  </div>
</template>
