<script setup>
const year = new Date().getFullYear();
</script>

<template>
  <footer class="mt-8 border-t border-neutral-800">
    <div
      class="mx-auto max-w-6xl px-6 py-6 text-sm text-neutral-400 flex flex-col sm:flex-row items-center justify-between gap-2"
    >
      <p>© {{ year }} MyTimer</p>
      <p class="text-neutral-500">Construit avec Vue 3 + Tailwind</p>
    </div>
  </footer>
</template>
