<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  total: { type: Number, required: true }, // durée totale en s
  left: { type: Number, required: true }, // restant en s
  title: { type: String, default: "" }, // ligne du haut
  subtitle: { type: String, default: "" }, // ligne du bas
});

const size = ref(220);
const stroke = computed(() => Math.round(size.value * 0.06));
const r = computed(() => (size.value - stroke.value) / 2);
const c = computed(() => 2 * Math.PI * r.value);

const updateSize = () => {
  // Responsive: clamp between 180px and 320px, ~80vw on small screens
  const vw = typeof window !== "undefined" ? window.innerWidth : 320;
  size.value = Math.round(Math.min(320, Math.max(180, vw * 0.8)));
};

onMounted(() => {
  updateSize();
  window.addEventListener("resize", updateSize, { passive: true });
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", updateSize);
});

const pct = computed(() => {
  const spent = Math.max(0, Math.min(props.total, props.total - props.left));
  return props.total > 0 ? spent / props.total : 0;
});
const dash = computed(() => c.value - c.value * pct.value);
</script>

<template>
  <div class="relative grid place-items-center">
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
      <div class="text-4xl sm:text-5xl font-extrabold tabular-nums">{{ left }}</div>
      <div class="text-sm text-neutral-400">{{ subtitle }}</div>
    </div>
  </div>
</template>
