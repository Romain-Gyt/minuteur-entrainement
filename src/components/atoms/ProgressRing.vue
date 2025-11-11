<script setup>
import { computed } from "vue";

const props = defineProps({
  total: { type: Number, required: true }, // durée totale en s
  left: { type: Number, required: true }, // restant en s
  title: { type: String, default: "" }, // ligne du haut
  subtitle: { type: String, default: "" }, // ligne du bas
});

const size = 220;
const stroke = 14;
const r = (size - stroke) / 2;
const c = 2 * Math.PI * r;

const pct = computed(() => {
  const spent = Math.max(0, Math.min(props.total, props.total - props.left));
  return props.total > 0 ? spent / props.total : 0;
});
const dash = computed(() => c - c * pct.value);
</script>

<template>
  <div class="grid place-items-center">
    <svg
      :width="size"
      :height="size"
      :viewBox="`0 0 ${size} ${size}`"
      class="rotate-90"
    >
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="r"
        :stroke-width="stroke"
        class="fill-none stroke-neutral-800"
      />
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="r"
        :stroke-width="stroke"
        class="fill-none stroke-emerald-500 transition-all duration-300"
        :stroke-dasharray="c"
        :stroke-dashoffset="dash"
        stroke-linecap="round"
      />
    </svg>

    <div class="absolute text-center">
      <div class="text-sm text-neutral-400">{{ title }}</div>
      <div class="text-5xl font-extrabold tabular-nums">{{ left }}</div>
      <div class="text-sm text-neutral-400">{{ subtitle }}</div>
    </div>
  </div>
</template>
