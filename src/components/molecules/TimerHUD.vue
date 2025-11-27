<script setup>
import { computed } from "vue";
import ProgressRing from "@/components/atoms/ProgressRing.vue";

const props = defineProps({
  total: { type: Number, required: true },
  left: { type: Number, required: true },
  startTime: { type: Number, default: 0 },
  duration: { type: Number, default: 0 },
  phase: { type: String, required: true }, // 'work' | 'rest' | 'restSerie' | 'between'
  name: { type: String, default: "" },
  repIdx: { type: Number, default: 1 },
  repTotal: { type: Number, default: 1 },
  serieIdx: { type: Number, default: 1 },
  serieTotal: { type: Number, default: 1 },
  nextName: { type: String, default: "" }, // New prop for next exercise preview
});

const phaseLabel = {
  work: "Travail",
  rest: "Repos",
  restSerie: "Repos série",
  between: "Repos entre exercices",
};

const phaseColor = computed(() => {
  switch (props.phase) {
    case "work":
      return "emerald";
    case "rest":
      return "amber";
    case "restSerie":
      return "purple";
    case "between":
      return "blue";
    default:
      return "emerald";
  }
});
</script>

<template>
  <div class="flex flex-col items-center gap-8 w-full max-w-md mx-auto">
    <!-- Top Info -->
    <div class="text-center space-y-1">
      <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-white">
        {{ name || "Sans nom" }}
      </h2>
      <div class="flex items-center justify-center gap-3 text-sm font-medium text-white/60">
        <span class="bg-white/10 px-2 py-1 rounded-md">
          Rep {{ repIdx }} / {{ repTotal }}
        </span>
        <span class="bg-white/10 px-2 py-1 rounded-md">
          Série {{ serieIdx }} / {{ serieTotal }}
        </span>
      </div>
    </div>

    <!-- Timer Ring -->
    <div class="relative">
      <ProgressRing
        :total="total"
        :left="left"
        :startTime="startTime"
        :duration="duration"
        :title="phaseLabel[phase]"
        :subtitle="phase === 'work' ? 'En cours' : (nextName ? `À suivre : ${nextName}` : 'Pause')"
        :color="phaseColor"
      />
    </div>
  </div>
</template>
