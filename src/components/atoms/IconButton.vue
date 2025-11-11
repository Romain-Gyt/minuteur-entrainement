<script setup>
const props = defineProps({
  kind: { type: String, default: "neutral" }, // 'primary' | 'danger' | 'neutral'
});
const base = "px-4 py-2 rounded-xl font-semibold";
const styles = {
  primary: "bg-emerald-600 hover:bg-emerald-700",
  danger: "bg-rose-600 hover:bg-rose-700",
  neutral: "bg-neutral-800 hover:bg-neutral-700",
};
</script>

<template>
  <button :class="[base, styles[kind]]">
    <slot />
  </button>
</template>
