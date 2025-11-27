<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';

const router = useRouter();
const workouts = ref([]);
const loading = ref(true);
const user = ref(null);

onMounted(async () => {
  const userData = localStorage.getItem('user');
  if (userData) {
    user.value = JSON.parse(userData);
  } else {
    router.push('/login');
    return;
  }

  try {
    const response = await api.getWorkouts();
    workouts.value = response.data;
  } catch (err) {
    console.error('Failed to fetch workouts', err);
    if (err.response && err.response.status === 403) {
        // Token invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    }
  } finally {
    loading.value = false;
  }
});

const createNew = () => {
  router.push('/builder');
};

const playWorkout = (workout) => {
  localStorage.setItem('trainingData', JSON.stringify(workout.data));
  router.push('/run');
};

const deleteWorkout = async (id) => {
  if (!confirm('Voulez-vous vraiment supprimer cet entraînement ?')) return;
  try {
    await api.deleteWorkout(id);
    workouts.value = workouts.value.filter(w => w.id !== id);
  } catch (err) {
    console.error('Failed to delete workout', err);
  }
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/login');
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const getTotalDuration = (workoutData) => {
    if (!workoutData || !workoutData.exercises) return 0;
    const exercises = workoutData.exercises;
    const restBetweenSec = workoutData.restBetweenSec || 0;

    return exercises.reduce((sum, e, idx) => {
        const bloc = e.workSec + e.restSec;
        const serieDur = e.reps * bloc;
        const restBetweenSeries = e.serie > 1 ? (e.serie - 1) * e.restSerieSec : 0;
        const exTotal = e.serie * serieDur + restBetweenSeries;
        const between = idx < exercises.length - 1 ? restBetweenSec : 0;
        return sum + exTotal + between;
    }, 0);
};

const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
}
</script>

<template>
  <div class="min-h-screen bg-neutral-950 text-neutral-100 pb-20">
    <!-- Header -->
    <header class="sticky top-0 z-10 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800">
      <div class="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-white">Mes Entraînements</h1>
          <p class="text-sm text-neutral-400">Bonjour, {{ user?.username }}</p>
        </div>
        <button
          @click="logout"
          class="text-sm text-neutral-500 hover:text-white transition-colors"
        >
          Déconnexion
        </button>
      </div>
    </header>

    <main class="max-w-6xl mx-auto p-4 space-y-8 mt-6">
      <!-- Actions -->
      <div class="flex justify-end">
        <button
          @click="createNew"
          class="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-900/20 transition-all flex items-center gap-2"
        >
          <span class="text-xl">+</span> Créer un nouveau
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="workouts.length === 0" class="text-center py-12 space-y-4">
        <div class="text-6xl">📝</div>
        <h3 class="text-xl font-medium text-white">Aucun entraînement sauvegardé</h3>
        <p class="text-neutral-400">Créez votre premier entraînement pour le retrouver ici.</p>
      </div>

      <!-- Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="workout in workouts"
          :key="workout.id"
          class="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition-all group relative overflow-hidden"
        >
          <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

          <div class="relative z-10">
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-lg font-bold text-white truncate pr-4">{{ workout.name }}</h3>
              <span class="text-xs font-mono text-neutral-500 bg-neutral-900 px-2 py-1 rounded-md border border-neutral-800">
                {{ formatDate(workout.created_at) }}
              </span>
            </div>

            <div class="space-y-2 mb-6">
              <div class="flex items-center justify-between text-sm text-neutral-400">
                <span>Durée estimée</span>
                <span class="text-emerald-400 font-mono">{{ formatDuration(getTotalDuration(workout.data)) }}</span>
              </div>
              <div class="flex items-center justify-between text-sm text-neutral-400">
                <span>Exercices</span>
                <span class="text-white font-mono">{{ workout.data.exercises?.length || 0 }}</span>
              </div>
            </div>

              <div class="flex gap-3">
                <button
                  @click="playWorkout(workout)"
                  class="flex-1 py-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white font-medium transition-all"
                >
                  Lancer
                </button>
                <button
                  @click="router.push(`/builder/${workout.id}`)"
                  class="px-3 py-2.5 rounded-lg bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white transition-all"
                  title="Modifier"
                >
                  ✏️
                </button>
                <button
                  @click="deleteWorkout(workout.id)"
                  class="px-3 py-2.5 rounded-lg bg-neutral-800 text-neutral-400 hover:bg-rose-500/20 hover:text-rose-400 transition-all"
                  title="Supprimer"
                >
                  🗑️
                </button>
              </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
