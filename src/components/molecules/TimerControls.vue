<script setup>
import IconButton from "@/components/atoms/IconButton.vue";
const emit = defineEmits(["play", "pause", "reset"]);
const props = defineProps({ running: { type: Boolean, default: false } });
</script>

<template>
  <div class="flex items-center justify-center gap-3">
    <IconButton v-if="!running" kind="primary" @click="emit('play')"
      >▶ Démarrer</IconButton
    >
    <IconButton v-else kind="neutral" @click="emit('pause')"
      >⏸ Pause</IconButton
    >
    <IconButton kind="danger" @click="emit('reset')">↺ Reset</IconButton>
  </div>
</template>
