<script setup>
import { computed } from "vue";
import NumberField from "@/components/atoms/NumberField.vue";

const props = defineProps({
  workSec: { type: Number, required: true },
  restSec: { type: Number, required: true },
  reps: { type: Number, required: true },
  serie: { type: Number, required: true },
  restSerieSec: { type: Number, required: true },
});
const emit = defineEmits([
  "update:workSec",
  "update:restSec",
  "update:reps",
  "update:serie",
  "update:restSerieSec",
]);

const workProxy = computed({
  get: () => props.workSec,
  set: (v) => emit("update:workSec", v),
});
const restProxy = computed({
  get: () => props.restSec,
  set: (v) => emit("update:restSec", v),
});
const repsProxy = computed({
  get: () => props.reps,
  set: (v) => emit("update:reps", v),
});
const serieProxy = computed({
  get: () => props.serie,
  set: (v) => emit("update:serie", v),
});
const restSerieProxy = computed({
  get: () => props.restSerieSec,
  set: (v) => emit("update:restSerieSec", v),
});
</script>

<template>
  <section class="grid grid-cols-2 gap-3 sm:grid-cols-5 sm:gap-8">
    <NumberField
      label="Travail"
      labelSuffix="(s)"
      v-model="workProxy"
      :min="1"
      :max="600"
    />
    <NumberField
      label="Repos"
      labelSuffix="(s)"
      v-model="restProxy"
      :min="0"
      :max="1200"
    />
    <NumberField
      label="Répétitions"
      labelSuffix="(x)"
      v-model="repsProxy"
      :min="1"
      :max="200"
    />
    <NumberField
      label="Série"
      labelSuffix="(x)"
      v-model="serieProxy"
      :min="1"
      :max="10"
    />
    <NumberField
      label="Repos entre série"
      labelSuffix="(s)"
      v-model="restSerieProxy"
      :min="1"
      :max="1200"
    />
  </section>
</template>
