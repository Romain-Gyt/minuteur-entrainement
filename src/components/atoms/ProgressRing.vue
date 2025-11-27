<script setup>
import { computed, ref, onMounted, onBeforeUnmount, watch } from "vue";

const props = defineProps({
  total: { type: Number, required: true }, // durée totale en s
  left: { type: Number, required: true }, // restant en s (pour affichage texte)
  startTime: { type: Number, default: 0 }, // Timestamp de début de phase
  duration: { type: Number, default: 0 }, // Durée totale en ms
  title: { type: String, default: "" }, // ligne du haut
  subtitle: { type: String, default: "" }, // ligne du bas
  color: { type: String, default: "emerald" }, // emerald | amber | blue
});

const size = ref(280); // Increased default size
const stroke = computed(() => Math.round(size.value * 0.04)); // Thinner stroke
const r = computed(() => (size.value - stroke.value) / 2);
const c = computed(() => 2 * Math.PI * r.value);

const updateSize = () => {
  // Responsive: larger on mobile for immersive feel
  const vw = typeof window !== "undefined" ? window.innerWidth : 320;
  const vh = typeof window !== "undefined" ? window.innerHeight : 600;
  const minDim = Math.min(vw, vh * 0.5);
  size.value = Math.round(Math.min(380, Math.max(220, minDim * 0.8)));
};

// Smooth Animation Logic
const progress = ref(0); // 0 to 1
let rafId = null;

const animate = () => {
  if (!props.startTime || !props.duration) {
    progress.value = 0;
    return;
  }

  const now = Date.now();
  const elapsed = now - props.startTime;
  const p = Math.min(1, Math.max(0, elapsed / props.duration));

  progress.value = p;

  if (p < 1) {
    rafId = requestAnimationFrame(animate);
  }
};

watch(() => props.startTime, () => {
  if (rafId) cancelAnimationFrame(rafId);
  animate();
}, { immediate: true });

onMounted(() => {
  updateSize();
  window.addEventListener("resize", updateSize, { passive: true });
  animate();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateSize);
  if (rafId) cancelAnimationFrame(rafId);
});

const dash = computed(() => c.value - c.value * progress.value);

const colorClasses = computed(() => {
  switch (props.color) {
    case "amber":
      return "stroke-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]";
    case "blue":
      return "stroke-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]";
    case "purple":
      return "stroke-purple-500 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]";
    case "emerald":
    default:
      return "stroke-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]";
  }
});
</script>

<template>
  <div class="relative grid place-items-center">
    <svg
      :width="size"
      :height="size"
      :viewBox="`0 0 ${size} ${size}`"
      class="rotate-90 transform transition-all duration-500"
    >
      <!-- Track -->
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="r"
        :stroke-width="stroke"
        class="fill-none stroke-neutral-800/50"
      />
      <!-- Progress -->
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="r"
        :stroke-width="stroke"
        class="fill-none"
        :class="colorClasses"
        :stroke-dasharray="c"
        :stroke-dashoffset="dash"
        stroke-linecap="round"
      />
    </svg>

    <div class="absolute text-center flex flex-col items-center justify-center inset-0">
      <div class="text-sm sm:text-base font-medium text-neutral-400 uppercase tracking-widest mb-2">{{ title }}</div>
      <div class="text-7xl sm:text-8xl font-black tabular-nums tracking-tighter leading-none select-none">
        {{ left }}
      </div>
      <div class="text-sm sm:text-base text-neutral-400 mt-2 max-w-[80%] truncate px-4 font-medium">{{ subtitle }}</div>
    </div>
  </div>
</template>
