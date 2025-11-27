<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Exercice from "@/components/organisms/Exercice.vue";
import NumberField from "@/components/atoms/NumberField.vue";

const router = useRouter();

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

const duplicateExercise = (exercise) => {
  const copy = JSON.parse(JSON.stringify(exercise));
  copy.id = crypto.randomUUID();
  // Insert after the current one
  const index = exercises.value.findIndex((e) => e.id === exercise.id);
  exercises.value.splice(index + 1, 0, copy);
};

const moveExercise = (index, direction) => {
  if (direction === -1 && index > 0) {
    const temp = exercises.value[index];
    exercises.value[index] = exercises.value[index - 1];
    exercises.value[index - 1] = temp;
  } else if (direction === 1 && index < exercises.value.length - 1) {
    const temp = exercises.value[index];
    exercises.value[index] = exercises.value[index + 1];
    exercises.value[index + 1] = temp;
  }
};

const clearAll = () => {
  if (confirm("Tout effacer ?")) {
    exercises.value = [newExercise()];
  }
};

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

const startTraining = () => {
  localStorage.setItem(
    "trainingData",
    JSON.stringify({
      exercises: exercises.value,
      restBetweenSec: restBetweenSec.value,
    })
  );
  router.push({ name: "run" });
};
</script>

<template>
  <div class="min-h-screen bg-neutral-950 text-neutral-100 pb-32 sm:pb-10">
    <section class="mx-auto w-full max-w-6xl p-4 sm:p-6 space-y-6">
      <header class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sticky top-0 z-10 bg-neutral-950/80 backdrop-blur-md py-2 -mx-4 px-4 sm:static sm:bg-transparent sm:p-0 sm:mx-0">
        <div>
          <h1 class="text-3xl font-bold">Créateur</h1>
          <div class="text-sm text-neutral-400 mt-1">
            Total théorique :
            <span class="font-semibold text-neutral-200"
              >{{ totalSeconds() }} s</span
            >
          </div>
        </div>

        <button
          @click="clearAll"
          class="text-sm text-neutral-500 hover:text-rose-500 underline self-start sm:self-auto"
        >
          Tout effacer
        </button>
      </header>

      <div class="space-y-6">
        <TransitionGroup name="list" tag="div" class="space-y-6">
          <div
            v-for="(ex, i) in exercises"
            :key="ex.id"
            class="rounded-2xl border border-neutral-800 p-4 bg-neutral-900/40 relative group"
          >
            <div class="flex justify-between items-start mb-4">
               <div class="flex items-center gap-2">
                 <span class="flex items-center justify-center w-6 h-6 rounded-full bg-neutral-800 text-xs font-mono text-neutral-400">
                   {{ i + 1 }}
                 </span>
                 <h3 class="font-medium text-neutral-300">Exercice</h3>
               </div>

               <div class="flex items-center gap-1">
                 <button
                   @click="moveExercise(i, -1)"
                   :disabled="i === 0"
                   class="p-2 rounded-lg hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent text-neutral-400"
                   title="Monter"
                 >
                   ↑
                 </button>
                 <button
                   @click="moveExercise(i, 1)"
                   :disabled="i === exercises.length - 1"
                   class="p-2 rounded-lg hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent text-neutral-400"
                   title="Descendre"
                 >
                   ↓
                 </button>
               </div>
            </div>

            <Exercice v-model:exercise="exercises[i]" />

            <div class="mt-4 flex gap-3 flex-wrap border-t border-neutral-800/50 pt-4">
              <button
                class="px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-sm font-medium transition-colors"
                @click="duplicateExercise(ex)"
              >
                Dupliquer
              </button>
              <button
                class="px-3 py-2 rounded-lg bg-rose-900/30 text-rose-400 hover:bg-rose-900/50 text-sm font-medium transition-colors ml-auto"
                @click="removeExercise(ex.id)"
              >
                Supprimer
              </button>
            </div>
          </div>
        </TransitionGroup>
      </div>

      <div class="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pt-4">
        <button
          class="w-full sm:w-auto px-4 py-3 rounded-xl border-2 border-dashed border-neutral-700 text-neutral-400 hover:border-emerald-500 hover:text-emerald-500 hover:bg-emerald-500/5 transition-all flex items-center justify-center gap-2"
          @click="addExercise"
        >
          <span class="text-xl">+</span> Ajouter un exercice
        </button>

        <div class="w-full sm:w-auto">
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

    <!-- Sticky Footer for Mobile -->
    <div class="fixed bottom-0 left-0 right-0 p-4 bg-neutral-950/90 backdrop-blur-lg border-t border-neutral-800 z-50 sm:hidden">
      <button
        class="w-full px-6 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 font-bold text-lg text-white shadow-lg shadow-emerald-900/20 active:scale-[0.98] transition-all"
        @click="startTraining"
      >
        ▶️ Démarrer ({{ totalSeconds() }}s)
      </button>
    </div>

    <!-- Desktop Button -->
    <div class="hidden sm:flex justify-center mt-12 pb-12">
      <button
        class="px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 font-bold text-xl text-white shadow-lg shadow-emerald-900/20 hover:scale-105 transition-all"
        @click="startTraining"
      >
        ▶️ Démarrer l'entraînement
      </button>
    </div>
  </div>
</template>

<style scoped>
.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
  width: 100%;
  z-index: 0;
}
</style>
