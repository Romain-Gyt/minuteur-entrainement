<script setup>
import { computed } from "vue";

const props = defineProps({
  label: { type: String, default: "" },
  modelValue: { type: String, default: "" },
  placeholder: { type: String, default: "" },
  error: { type: String, default: "" }, // message d’erreur optionnel
  compact: { type: Boolean, default: false }, // version compacte
});

const emit = defineEmits(["update:modelValue"]);

const displayValue = computed(() => props.modelValue ?? "");
const inputClasses = computed(() => [
  "w-full rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-100",
  "placeholder-neutral-500 transition-all duration-150 outline-none",
  "focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
  props.compact ? "px-2 py-1 text-sm" : "px-3 py-2",
  props.error ? "border-red-600 focus:ring-red-600 focus:border-red-600" : "",
]);
</script>

<template>
  <label class="block w-full">
    <span class="text-sm text-neutral-300">{{ label }}</span>

    <input
      type="text"
      :value="displayValue"
      :placeholder="placeholder"
      @input="emit('update:modelValue', $event.target.value)"
      :class="inputClasses"
    />

    <!-- affichage du message d’erreur -->
    <p v-if="error" class="text-sm text-red-500 mt-1">{{ error }}</p>
  </label>
</template>
