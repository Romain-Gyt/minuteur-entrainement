<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';

const router = useRouter();
const username = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  try {
    const response = await api.login({ username: username.value, password: password.value });
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    router.push('/dashboard');
  } catch (err) {
    error.value = err.response?.data?.error || 'Une erreur est survenue';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-neutral-950 p-4">
    <div class="w-full max-w-md bg-neutral-900/50 p-8 rounded-2xl border border-neutral-800 backdrop-blur-sm">
      <h1 class="text-3xl font-bold text-white mb-6 text-center">Connexion</h1>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-neutral-400 mb-2">Nom d'utilisateur</label>
          <input
            v-model="username"
            type="text"
            required
            class="w-full bg-neutral-800 border-neutral-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            placeholder="Votre pseudo"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-neutral-400 mb-2">Mot de passe</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full bg-neutral-800 border-neutral-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            placeholder="••••••••"
          />
        </div>

        <div v-if="error" class="text-rose-500 text-sm text-center">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Connexion...' : 'Se connecter' }}
        </button>
      </form>

      <div class="mt-6 text-center text-neutral-400 text-sm">
        Pas encore de compte ?
        <router-link to="/register" class="text-emerald-500 hover:text-emerald-400 font-medium">
          Créer un compte
        </router-link>
      </div>
    </div>
  </div>
</template>
