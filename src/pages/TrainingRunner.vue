<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import TimerHUD from "@/components/molecules/TimerHUD.vue";
import TimerControls from "@/components/molecules/TimerControls.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const training = ref(null);

const idx = ref(0); // index exercice
const serieIdx = ref(1); // 1..serie
const repIdx = ref(1); // 1..reps
const phase = ref("work"); // 'work' | 'rest' | 'restSerie' | 'between'
const running = ref(false);

const total = ref(0); // durée de la phase courante (s)
const left = ref(0); // restant (s)
const startTime = ref(0); // timestamp de début de phase
const duration = ref(0); // durée en ms

let tickId = null;
let wakeLock = null;

// Audio Context
let audioCtx = null;

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
};

const playBeep = (freq = 440, duration = 0.1, type = "sine") => {
  if (!audioCtx) initAudio();
  if (audioCtx.state === "suspended") audioCtx.resume();

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = type;
  osc.frequency.value = freq;
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);
  osc.stop(audioCtx.currentTime + duration);
};

const current = computed(() => training.value?.exercises?.[idx.value]);
const restBetween = computed(() => training.value?.restBetweenSec ?? 0);

// Determine the next exercise name for preview
const nextExerciseName = computed(() => {
  if (!training.value) return "";
  // If in rest (between reps/series), next is same exercise
  if (phase.value === 'rest' || phase.value === 'restSerie') return current.value?.name;

  // If in between exercises, next is the next exercise in list
  if (phase.value === 'between') {
    const nextEx = training.value.exercises[idx.value + 1];
    return nextEx ? nextEx.name : "Fin";
  }

  // If in work, depends on if it's the last rep/serie
  return "";
});

const computePhaseDuration = () => {
  if (!current.value) return 0;
  if (phase.value === "work") return current.value.workSec;
  if (phase.value === "rest") return current.value.restSec;
  if (phase.value === "restSerie") return current.value.restSerieSec;
  return restBetween.value; // 'between'
};

const applyPhase = () => {
  total.value = computePhaseDuration();
  left.value = total.value;

  // Reset animation if running
  if (running.value) {
    startTime.value = Date.now();
    duration.value = total.value * 1000;
  }
};

const nextStep = () => {
  if (!current.value) return;

  if (phase.value === "work") {
    // End of work
    if (repIdx.value < current.value.reps) {
      // More reps in this serie -> Rest
      phase.value = "rest";
    } else {
      // Last rep of the serie
      if (serieIdx.value < current.value.serie) {
        // More series -> Rest Serie
        phase.value = "restSerie";
      } else {
        // Last serie of the exercise
        if (idx.value < (training.value?.exercises?.length ?? 0) - 1) {
          // More exercises -> Between
          phase.value = "between";
        } else {
          // End of training
          training.value = null;
          running.value = false;
          releaseWakeLock();
          return;
        }
      }
    }
  } else if (phase.value === "rest") {
    // End of rest -> Next rep
    repIdx.value++;
    phase.value = "work";
  } else if (phase.value === "restSerie") {
    // End of restSerie -> Next serie
    serieIdx.value++;
    repIdx.value = 1;
    phase.value = "work";
  } else if (phase.value === "between") {
    // End of between -> Next exercise
    idx.value++;
    serieIdx.value = 1;
    repIdx.value = 1;
    phase.value = "work";
  }

  applyPhase();
};

// Modified tick logic for better sync
const runTimer = () => {
  if (!running.value) return;

  if (left.value > 0) {
    left.value--;
    if (left.value > 0 && left.value <= 3) {
      playBeep(440, 0.1, "sine");
    } else if (left.value === 0) {
      playBeep(880, 0.3, "square"); // GO sound
    }
  } else {
    // It was 0, now we switch
    nextStep();
  }
};

const play = () => {
  if (!training.value) return;
  if (!current.value) return;

  // If starting fresh or resuming
  if (!running.value) {
    running.value = true;
    initAudio();
    requestWakeLock();

    // If resuming, we need to adjust startTime so animation resumes correctly
    // But simplistic approach: just reset animation for remaining time?
    // Or better: calculate new duration based on left.
    // For simplicity, let's just restart the visual timer for the *remaining* part
    // This might cause a jump if we pause/play, but it's acceptable for now.
    // A better way would be tracking `pausedAt` and adjusting `startTime`.

    // Adjusting for pause/resume:
    // We have `left`. We can pretend the phase started `(total - left)` seconds ago.
    // So `startTime = Date.now() - (total - left) * 1000`
    const elapsedSec = total.value - left.value;
    startTime.value = Date.now() - (elapsedSec * 1000);
    duration.value = total.value * 1000;
  }
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
  releaseWakeLock();
  // router.push('/builder')
};

const requestWakeLock = async () => {
  if ('wakeLock' in navigator) {
    try {
      wakeLock = await navigator.wakeLock.request('screen');
    } catch (err) {
      console.error(`${err.name}, ${err.message}`);
    }
  }
};

const releaseWakeLock = () => {
  if (wakeLock !== null) {
    wakeLock.release()
      .then(() => {
        wakeLock = null;
      });
  }
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
  // Pause initially
  running.value = false;

  tickId = setInterval(runTimer, 1000);

  // Re-acquire wake lock if visibility changes
  document.addEventListener('visibilitychange', async () => {
    if (wakeLock !== null && document.visibilityState === 'visible') {
      await requestWakeLock();
    }
  });
});

onBeforeUnmount(() => {
  if (tickId) clearInterval(tickId);
  releaseWakeLock();
});

// Dynamic background classes based on phase
const bgClass = computed(() => {
  switch (phase.value) {
    case "work":
      return "from-emerald-950 to-neutral-950";
    case "rest":
      return "from-amber-950 to-neutral-950";
    case "restSerie":
      return "from-purple-950 to-neutral-950";
    case "between":
      return "from-blue-950 to-neutral-950";
    default:
      return "from-neutral-950 to-neutral-950";
  }
});
</script>

<template>
  <div
    class="fixed inset-0 bg-gradient-to-br transition-colors duration-1000 ease-in-out flex flex-col"
    :class="bgClass"
  >
    <!-- Minimal Header -->
    <header class="p-4 flex justify-between items-center z-10">
      <button
        @click="router.push('/builder')"
        class="text-white/50 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
      >
        ← Retour
      </button>
      <div class="text-xs font-mono text-white/30">
        {{ training?.exercises?.length ?? 0 }} EXERCICES
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-md mx-auto relative z-10">
      <div v-if="current" class="w-full space-y-12">
        <TimerHUD
          :total="total"
          :left="left"
          :startTime="startTime"
          :duration="duration"
          :phase="phase"
          :name="current.name"
          :rep-idx="repIdx"
          :rep-total="current.reps"
          :serie-idx="serieIdx"
          :serie-total="current.serie"
          :next-name="nextExerciseName"
        />

        <TimerControls
          :running="running"
          @play="play"
          @pause="pause"
          @reset="reset"
        />
      </div>

      <div v-else class="text-center space-y-6 animate-fade-in">
        <div class="text-6xl">🎉</div>
        <h2 class="text-3xl font-bold text-white">Entraînement terminé !</h2>
        <p class="text-neutral-400">Bien joué, session complétée.</p>
        <button
          @click="router.push('/builder')"
          class="px-8 py-3 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-all"
        >
          Nouvel entraînement
        </button>
      </div>
    </main>

    <!-- Background Elements for Atmosphere -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-white/5 blur-[100px]"></div>
      <div class="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-white/5 blur-[100px]"></div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
