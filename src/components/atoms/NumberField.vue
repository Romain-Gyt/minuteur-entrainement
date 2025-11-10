<template>
  <label class="block">
    <span class="text-sm text-neutral-300">{{ label }}</span>

    <div class="mt-1 flex items-stretch gap-2">
      <button
        type="button"
        class="px-3 rounded-l-lg bg-neutral-800 hover:bg-neutral-700"
        @click="decrement"
      >
        −
      </button>

      <input
        type="number"
        class="w-full text-center bg-neutral-900 border border-neutral-700 focus:border-neutral-500 focus:outline-none"
        :value="displayValue"
        @input="onInput"
      />

      <button
        type="button"
        class="px-3 rounded-r-lg bg-neutral-800 hover:bg-neutral-700"
        @click="increment"
      >
        +
      </button>
    </div>
  </label>
</template>

<script setup>
import { computed } from "vue";

// 🟢 Déclaration des props
const props = defineProps({
  label: String,
  modelValue: Number,
  min: { type: Number, default: -Infinity },
  max: { type: Number, default: Infinity },
  step: { type: Number, default: 1 },
});

// 🟢 Événement émis quand la valeur change
const emit = defineEmits(["update:modelValue"]);

// 🧠 petite fonction utilitaire pour “clamp” la valeur entre min et max
function clamp(value) {
  return Math.min(props.max, Math.max(props.min, value));
}

// 🟢 Handlers
function onInput(e) {
  const value = Number(e.target.value);
  emit("update:modelValue", clamp(isNaN(value) ? props.min : value));
}

function increment() {
  emit("update:modelValue", clamp(props.modelValue + props.step));
}

function decrement() {
  emit("update:modelValue", clamp(props.modelValue - props.step));
}

const displayValue = computed(() => props.modelValue ?? 0);
</script>

<!-- CSS -->
<style></style>
