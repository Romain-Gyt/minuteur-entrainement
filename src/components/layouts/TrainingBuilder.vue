<script setup>
import { ref } from "vue";
import Exercice from "@/components/organisms/Exercice.vue";
import NumberField from "@/components/atoms/NumberField.vue";

const newExercise = () => {
  return {
    id: crypto.randomUUID(),
    name: "",
    workSec: 7,
    restSec: 3,
    reps: 6,
    serie: 1,
    restSerieSec: 30,
  };
};

const exercises = ref([newExercise()]);
const restBetweenSec = ref(120);

const addExercise = () => exercises.value.push(newExercise());
const removeExercise = (id) =>
  (exercises.value = exercises.value.filter((e) => e.id !== id));

const totalSeconds = () => {
  return exercises.value.reduce((sum, e, idx) => {
    const bloc = e.workSec + e.restSec;
    const serieDur = e.reps * bloc;
    const restBetweenSeries = e.serie > 1 ? (e.serie - 1) * e.restSerieSec : 0;
    const exTotal = e.serie * serieDur + restBetweenSeries;
    const between = idx < exercises.value.length - 1 ? restBetweenSec.value : 0;
    return sum + exTotal + between;
  }, 0);
};
</script>

<template>
  <main class="min-h-screen bg-neutral-950 text-neutral-100">
    <section class="mx-auto w-full max-w-6xl p-6 space-y-6">
      <header class="flex items-center justify-between">
        <h1 class="text-3xl font-bold">Créateur d’entraînement</h1>
        <div class="text-sm text-neutral-400">
          Total théorique :
          <span class="font-semibold text-neutral-200"
            >{{ totalSeconds() }} s</span
          >
        </div>
      </header>

      <div class="space-y-6">
        <div
          v-for="(ex, i) in exercises"
          :key="ex.id"
          class="rounded-2xl border border-neutral-800 p-4 bg-neutral-900/40"
        >
          <Exercice v-model:exercise="exercises[i]" />

          <div class="mt-4 flex gap-2">
            <button
              class="px-3 py-2 rounded-lg bg-rose-700 hover:bg-rose-600"
              @click="removeExercise(ex.id)"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>

      <div class="flex items-end justify-between gap-4 flex-wrap">
        <button
          class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700"
          @click="addExercise"
        >
          + Ajouter un exercice
        </button>

        <div class="w-64">
          <NumberField
            label="Repos entre exercices"
            labelSuffix="(s)"
            v-model="restBetweenSec"
            :min="0"
            :max="1800"
          />
        </div>
      </div>
    </section>
  </main>
</template>
