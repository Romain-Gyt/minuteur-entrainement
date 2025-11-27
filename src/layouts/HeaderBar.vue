<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import api from "@/services/api";

const route = useRoute();
const router = useRouter();
const isActive = (name) => route.name === name;

const user = ref(null);
const showDropdown = ref(false);
const dropdownRef = ref(null);

const avatars = [
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
  '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆'
];

const loadUser = () => {
  const userData = localStorage.getItem('user');
  if (userData) {
    user.value = JSON.parse(userData);
  }
};

onMounted(() => {
  loadUser();
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    showDropdown.value = false;
  }
};

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const updateAvatar = async (avatar) => {
  try {
    await api.updateAvatar(avatar);
    user.value.avatar = avatar;
    localStorage.setItem('user', JSON.stringify(user.value));
    showDropdown.value = false;
  } catch (err) {
    console.error('Failed to update avatar', err);
  }
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/login');
};
</script>

<template>
  <header
    class="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-md sticky top-0 z-50"
  >
    <div
      class="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between"
    >
      <div class="flex items-center gap-8">
        <h1 class="text-xl font-bold tracking-wide text-emerald-400">
          Training App
        </h1>

        <nav class="hidden sm:flex gap-2">
          <RouterLink
            :to="{ name: 'dashboard' }"
            class="px-4 py-2 rounded-lg font-medium transition-colors"
            :class="
              isActive('dashboard')
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-neutral-300 hover:text-emerald-400'
            "
          >
            🏠 Accueil
          </RouterLink>
          <RouterLink
            :to="{ name: 'planning' }"
            class="px-4 py-2 rounded-lg font-medium transition-colors"
            :class="
              isActive('planning')
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-neutral-300 hover:text-emerald-400'
            "
          >
            📅 Planning
          </RouterLink>
          <RouterLink
            :to="{ name: 'builder' }"
            class="px-4 py-2 rounded-lg font-medium transition-colors"
            :class="
              isActive('builder')
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-neutral-300 hover:text-emerald-400'
            "
          >
            🧩 Builder
          </RouterLink>
        </nav>
      </div>

      <!-- User Profile -->
      <div class="relative" ref="dropdownRef" v-if="user">
        <button
          @click="toggleDropdown"
          class="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-neutral-800 transition-colors"
        >
          <span class="text-sm font-medium text-neutral-300 hidden sm:block">{{ user.username }}</span>
          <div class="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center text-xl border-2 border-neutral-600">
            {{ user.avatar === 'default' ? '👤' : user.avatar }}
          </div>
        </button>

        <!-- Dropdown -->
        <div
          v-if="showDropdown"
          class="absolute right-0 mt-2 w-64 bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl overflow-hidden animate-fade-in"
        >
          <div class="p-4 border-b border-neutral-800">
            <p class="text-xs text-neutral-500 uppercase font-bold mb-2">Choisir un avatar</p>
            <div class="grid grid-cols-5 gap-2">
              <button
                v-for="av in avatars"
                :key="av"
                @click="updateAvatar(av)"
                class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-800 transition-colors text-lg"
                :class="{ 'bg-emerald-500/20 ring-1 ring-emerald-500': user.avatar === av }"
              >
                {{ av }}
              </button>
            </div>
          </div>
          <div class="p-2">
            <button
              @click="logout"
              class="w-full text-left px-4 py-2 rounded-lg text-rose-400 hover:bg-rose-900/20 text-sm font-medium transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.15s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
