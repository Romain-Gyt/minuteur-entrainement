<script setup>
import { computed } from "vue";

const props = defineProps({
  label: { type: String, default: "" },
  modelValue: { type: Number, default: 0 },
  min: { type: Number, default: -Infinity },
  max: { type: Number, default: Infinity },
  step: { type: Number, default: 1 },
  labelSuffix: { type: String, default: "" },
  compact: { type: Boolean, default: false },
});
const emit = defineEmits(["update:modelValue"]);

const clamp = (v) => Math.min(props.max, Math.max(props.min, v));
const displayValue = computed(() => props.modelValue ?? 0);

const onInput = (e) => {
  const n = Number(e.target.value);
  emit("update:modelValue", clamp(Number.isFinite(n) ? n : props.min));
};

const increment = () => {
  emit("update:modelValue", clamp(displayValue.value + props.step));
};

const decrement = () => {
  emit("update:modelValue", clamp(displayValue.value - props.step));
};

// Height: slightly larger on small screens for better touch targets
const h = props.compact ? "h-10 sm:h-9" : "h-11 sm:h-10";
</script>

<template>
  <label class="block">
    <span class="text-sm text-neutral-300">{{ label }}</span>
    <div class="mt-1 flex items-center gap-2">
      <!-- groupe input/boutons -->
      <div
        class="inline-flex items-center rounded-xl border border-neutral-700 bg-neutral-900 focus-within:ring-2 focus-within:ring-emerald-500"
      >
        <button
          type="button"
          :class="['px-3 rounded-l-xl hover:bg-neutral-800 active:scale-95', h]"
          @click="decrement"
        >
          −
        </button>

        <input
          type="number"
          :value="displayValue"
          @input="onInput"
          :class="[
            'w-20 text-center bg-transparent outline-none border-x border-neutral-800',
            'px-2 tabular-nums',
            h,
            '[&::-webkit-outer-spin-button]:appearance-none',
            '[&::-webkit-inner-spin-button]:appearance-none',
            '[-moz-appearance:textfield]',
          ]"
        />

        <button
          type="button"
          :class="['px-3 rounded-r-xl hover:bg-neutral-800 active:scale-95', h]"
          @click="increment"
        >
          +
        </button>
      </div>

      <span v-if="labelSuffix" class="text-sm text-neutral-400 select-none">{{
        labelSuffix
      }}</span>
    </div>
  </label>
</template>
