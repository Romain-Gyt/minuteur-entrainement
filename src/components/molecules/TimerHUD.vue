<script setup>
import ProgressRing from "@/components/atoms/ProgressRing.vue";

const props = defineProps({
  total: { type: Number, required: true },
  left: { type: Number, required: true },
  phase: { type: String, required: true }, // 'work' | 'rest' | 'between'
  name: { type: String, default: "" },
  repIdx: { type: Number, default: 1 },
  repTotal: { type: Number, default: 1 },
  serieIdx: { type: Number, default: 1 },
  serieTotal: { type: Number, default: 1 },
});

const phaseLabel = {
  work: "Travail",
  rest: "Repos",
  between: "Repos entre exercices",
};
</script>

<template>
  <div class="grid place-items-center gap-6">
    <div class="text-center">
      <div class="text-sm text-neutral-400">Exercice</div>
      <div class="text-2xl font-bold">{{ name || "Sans nom" }}</div>
      <div class="text-sm text-neutral-400 mt-1">
        Rep {{ repIdx }} / {{ repTotal }} • Série {{ serieIdx }} /
        {{ serieTotal }}
      </div>
      <div class="mt-1 text-emerald-400 font-semibold">
        {{ phaseLabel[phase] }}
      </div>
    </div>

    <ProgressRing
      :total="total"
      :left="left"
      :title="phaseLabel[phase]"
      :subtitle="name"
    />
  </div>
</template>
