<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import TimerHUD from "@/components/molecules/TimerHUD.vue";
import TimerControls from "@/components/molecules/TimerControls.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const training = ref(null);

const idx = ref(0); // index exercice
const serieIdx = ref(1); // 1..serie
const repIdx = ref(1); // 1..reps
const phase = ref("work"); // 'work' | 'rest' | 'between'
const running = ref(false);

const total = ref(0); // durée de la phase courante (s)
const left = ref(0); // restant (s)
let tickId = null;

const current = computed(() => training.value?.exercises?.[idx.value]);
const restBetween = computed(() => training.value?.restBetweenSec ?? 0);

const computePhaseDuration = () => {
  if (!current.value) return 0;
  if (phase.value === "work") return current.value.workSec;
  if (phase.value === "rest") return current.value.restSec;
  return restBetween.value; // 'between'
};

const applyPhase = () => {
  total.value = computePhaseDuration();
  left.value = total.value;
};

const nextStep = () => {
  if (!current.value) return;
  if (phase.value === "work") {
    // après travail → soit repos (s’il reste des reps), soit fin de série
    if (current.value.restSec > 0) {
      phase.value = "rest";
      applyPhase();
      return;
    } else {
      // pas de repos, on simule fin instantanée de rep
      afterRest();
      return;
    }
  }
  if (phase.value === "rest") {
    afterRest();
    return;
  }
  if (phase.value === "between") {
    // passer à l’exercice suivant
    idx.value++;
    serieIdx.value = 1;
    repIdx.value = 1;
    phase.value = "work";
    if (!current.value) {
      stop();
      return;
    }
    applyPhase();
  }
};

const afterRest = () => {
  // fin d’une rep → avance rep/série
  const e = current.value;
  if (repIdx.value < e.reps) {
    repIdx.value++;
    phase.value = "work";
    applyPhase();
    return;
  }
  // fin des reps → série suivante ou repos entre exercices
  if (serieIdx.value < e.serie) {
    serieIdx.value++;
    repIdx.value = 1;
    phase.value = "work";
    applyPhase();
    return;
  }
  // fin de l’exercice → repos entre exercices ou exercice suivant direct
  if (
    restBetween.value > 0 &&
    idx.value < training.value.exercises.length - 1
  ) {
    phase.value = "between";
    applyPhase();
  } else {
    // pas de repos inter ou dernier exo → tout de suite exo suivant
    idx.value++;
    serieIdx.value = 1;
    repIdx.value = 1;
    phase.value = "work";
    if (!current.value) {
      stop();
      return;
    }
    applyPhase();
  }
};

const tick = () => {
  if (!running.value) return;
  left.value = Math.max(0, left.value - 1);
  if (left.value === 0) nextStep();
};

const play = () => {
  if (!training.value) return;
  if (!current.value) return;
  running.value = true;
};
const pause = () => {
  running.value = false;
};
const reset = () => {
  running.value = false;
  idx.value = 0;
  serieIdx.value = 1;
  repIdx.value = 1;
  phase.value = "work";
  applyPhase();
};

const stop = () => {
  running.value = false;
  // router.push('/builder')
};

onMounted(() => {
  const raw = localStorage.getItem("trainingData");
  if (raw) {
    training.value = JSON.parse(raw);
  } else {
    router.push("/builder");
    return;
  }
  applyPhase();
  tickId = setInterval(tick, 1000);
});

onBeforeUnmount(() => {
  if (tickId) clearInterval(tickId);
});
</script>

<template>
  <section class="max-w-5xl mx-auto p-6 space-y-8">
    <header class="flex items-center justify-between">
      <h1 class="text-3xl font-bold">Entraînement</h1>
      <div class="text-sm text-neutral-400">
        {{ training?.exercises?.length ?? 0 }} exercices • Repos inter :
        {{ training?.restBetweenSec ?? 0 }}s
      </div>
    </header>

    <div v-if="current" class="grid place-items-center gap-8">
      <TimerHUD
        :total="total"
        :left="left"
        :phase="phase"
        :name="current.name"
        :rep-idx="repIdx"
        :rep-total="current.reps"
        :serie-idx="serieIdx"
        :serie-total="current.serie"
      />

      <TimerControls
        :running="running"
        @play="play"
        @pause="pause"
        @reset="reset"
      />
    </div>

    <div v-else class="text-center text-neutral-400">
      Entraînement terminé ✅
    </div>
  </section>
</template>
