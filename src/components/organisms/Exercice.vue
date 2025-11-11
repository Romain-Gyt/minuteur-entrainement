<script setup>
import { computed } from "vue";
import TextField from "@/components/atoms/TextField.vue";
import TimerPanel from "@/components/molecules/TimerPanel.vue";

// un seul v-model nommé "exercise"
const exercise = defineModel("exercise", {
  default: {
    id: undefined,
    name: "",
    workSec: 7,
    restSec: 3,
    reps: 6,
    serie: 1,
    restSerieSec: 30,
  },
});

const nameProxy = computed({
  get: () => exercise.value.name,
  set: (v) => (exercise.value.name = v),
});
const workProxy = computed({
  get: () => exercise.value.workSec,
  set: (v) => (exercise.value.workSec = v),
});
const restProxy = computed({
  get: () => exercise.value.restSec,
  set: (v) => (exercise.value.restSec = v),
});
const repsProxy = computed({
  get: () => exercise.value.reps,
  set: (v) => (exercise.value.reps = v),
});
const serieProxy = computed({
  get: () => exercise.value.serie,
  set: (v) => (exercise.value.serie = v),
});
const restSerieProxy = computed({
  get: () => exercise.value.restSerieSec,
  set: (v) => (exercise.value.restSerieSec = v),
});
</script>

<template>
  <section class="space-y-4 rounded-2xl bg-neutral-900/50 p-6">
    <TextField
      label="Nom de l'exercice"
      v-model="nameProxy"
      placeholder="Ex : suspension 10 mm"
    />

    <TimerPanel
      v-model:workSec="workProxy"
      v-model:restSec="restProxy"
      v-model:reps="repsProxy"
      v-model:serie="serieProxy"
      v-model:restSerieSec="restSerieProxy"
    />
  </section>
</template>
