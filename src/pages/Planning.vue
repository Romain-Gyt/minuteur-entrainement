<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '@/services/api';
import { useRouter } from 'vue-router';

const router = useRouter();
const currentDate = ref(new Date());
const selectedDate = ref(null);
const schedules = ref([]);
const workouts = ref([]);
const showModal = ref(false);
const selectedWorkoutId = ref('');
const selectedTime = ref('09:00');
const loading = ref(false);

const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

const currentMonthName = computed(() => months[currentDate.value.getMonth()]);
const currentYear = computed(() => currentDate.value.getFullYear());

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Adjust for Monday start
};

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const days = [];

  // Previous month padding
  for (let i = 0; i < firstDay; i++) {
    days.push({ day: '', currentMonth: false });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    const daySchedules = schedules.value.filter(s => s.date === dateStr);
    days.push({
      day: i,
      date: dateStr,
      currentMonth: true,
      hasWorkout: daySchedules.length > 0,
      schedules: daySchedules
    });
  }

  return days;
});

const prevMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1);
};

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1);
};

const selectDate = (day) => {
  if (!day.currentMonth) return;
  selectedDate.value = day;
};

const fetchData = async () => {
  loading.value = true;
  try {
    const [schedulesRes, workoutsRes] = await Promise.all([
      api.getSchedules(),
      api.getWorkouts()
    ]);
    schedules.value = schedulesRes.data;
    workouts.value = workoutsRes.data;
  } catch (err) {
    console.error('Failed to fetch data', err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);

const openAddModal = () => {
  if (!selectedDate.value) return;
  selectedTime.value = '09:00'; // Reset time
  showModal.value = true;
};

const scheduleWorkout = async () => {
  if (!selectedWorkoutId.value || !selectedTime.value) return;

  try {
    await api.createSchedule({
      workout_id: selectedWorkoutId.value,
      date: selectedDate.value.date,
      time: selectedTime.value
    });

    showModal.value = false;
    selectedWorkoutId.value = '';
    await fetchData();
    // Re-select date to update view
    const updatedDay = calendarDays.value.find(d => d.date === selectedDate.value.date);
    if (updatedDay) selectedDate.value = updatedDay;
  } catch (err) {
    console.error('Failed to schedule workout', err);
  }
};

const deleteSchedule = async (id) => {
  if (!confirm('Supprimer cet entraînement du planning ?')) return;
  try {
    await api.deleteSchedule(id);
    await fetchData();
    // Re-select date to update view
    const updatedDay = calendarDays.value.find(d => d.date === selectedDate.value.date);
    if (updatedDay) selectedDate.value = updatedDay;
    else selectedDate.value = null; // Should not happen but safe fallback
  } catch (err) {
    console.error('Failed to delete schedule', err);
  }
};

const playWorkout = (workoutData) => {
  localStorage.setItem('trainingData', workoutData);
  router.push('/run');
};
const isPastDate = computed(() => {
  if (!selectedDate.value) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selected = new Date(selectedDate.value.date);
  selected.setHours(0, 0, 0, 0);
  return selected < today;
});
</script>

<template>
  <div class="min-h-screen bg-neutral-950 text-neutral-100 pb-20">
    <main class="max-w-6xl mx-auto p-4 space-y-8 mt-6">
      <div class="flex flex-col md:flex-row gap-8">

        <!-- Calendar Section -->
        <div class="flex-1 bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 backdrop-blur-sm h-fit">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-white">{{ currentMonthName }} {{ currentYear }}</h2>
            <div class="flex gap-2">
              <button @click="prevMonth" class="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400">←</button>
              <button @click="nextMonth" class="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400">→</button>
            </div>
          </div>

          <div class="grid grid-cols-7 gap-2 mb-2">
            <div v-for="day in daysOfWeek" :key="day" class="text-center text-sm font-medium text-neutral-500 py-2">
              {{ day }}
            </div>
          </div>

          <div class="grid grid-cols-7 gap-2">
            <div
              v-for="(day, index) in calendarDays"
              :key="index"
              @click="selectDate(day)"
              class="aspect-square rounded-xl flex flex-col items-center justify-center relative cursor-pointer transition-all border"
              :class="[
                !day.currentMonth ? 'invisible' : 'hover:bg-neutral-800 border-neutral-800',
                selectedDate?.date === day.date ? 'bg-emerald-500/20 border-emerald-500 ring-1 ring-emerald-500' : 'bg-neutral-800/30',
                day.hasWorkout ? 'text-emerald-400 font-bold' : 'text-neutral-300'
              ]"
            >
              <span class="text-sm">{{ day.day }}</span>
              <div v-if="day.hasWorkout" class="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            </div>
          </div>
        </div>

        <!-- Details Section -->
        <div class="w-full md:w-96 space-y-6">
          <div v-if="selectedDate" class="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 backdrop-blur-sm animate-fade-in">
            <div class="flex justify-between items-start mb-6">
              <div>
                <h3 class="text-lg font-bold text-white">Programme du jour</h3>
                <p class="text-neutral-400">{{ new Date(selectedDate.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) }}</p>
              </div>
              <button
                v-if="!isPastDate"
                @click="openAddModal"
                class="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center font-bold shadow-lg shadow-emerald-900/20 transition-all"
              >
                +
              </button>
            </div>

            <div v-if="selectedDate.schedules.length === 0" class="text-center py-8 text-neutral-500">
              Aucun entraînement prévu
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="schedule in selectedDate.schedules"
                :key="schedule.id"
                class="bg-neutral-800/50 rounded-xl p-4 border border-neutral-700/50 hover:border-emerald-500/50 transition-all group"
              >
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <div class="text-emerald-400 text-sm font-mono mb-1">{{ schedule.time || '09:00' }}</div>
                    <h4 class="font-bold text-white">{{ schedule.workout_name }}</h4>
                  </div>
                  <button
                    @click="deleteSchedule(schedule.id)"
                    class="text-neutral-500 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
                <button
                  @click="playWorkout(schedule.workout_data)"
                  class="w-full py-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white font-medium text-sm transition-all"
                >
                  Lancer
                </button>
              </div>
            </div>
          </div>

          <div v-else class="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 text-center text-neutral-500">
            Sélectionnez une date pour voir ou ajouter des entraînements
          </div>
        </div>
      </div>
    </main>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div class="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-md space-y-6">
        <h3 class="text-xl font-bold text-white">Planifier un entraînement</h3>

        <div class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-neutral-400">Heure de début</label>
            <input
              type="time"
              v-model="selectedTime"
              class="w-full bg-neutral-800 border-neutral-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            >
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-neutral-400">Choisir un entraînement</label>
            <select
              v-model="selectedWorkoutId"
              class="w-full bg-neutral-800 border-neutral-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            >
              <option value="" disabled>Sélectionner...</option>
              <option v-for="w in workouts" :key="w.id" :value="w.id">{{ w.name }}</option>
            </select>
          </div>
        </div>

        <div class="flex gap-3 pt-2">
          <button
            @click="showModal = false"
            class="flex-1 py-3 rounded-xl bg-neutral-800 text-neutral-300 hover:bg-neutral-700 font-medium transition-colors"
          >
            Annuler
          </button>
          <button
            @click="scheduleWorkout"
            :disabled="!selectedWorkoutId || !selectedTime"
            class="flex-1 py-3 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 font-bold shadow-lg shadow-emerald-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>
