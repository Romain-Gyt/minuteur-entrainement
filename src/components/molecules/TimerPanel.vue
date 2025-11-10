<template>
  <NumberField
    label="Travail (s)"
    v-model="workSec"
    :min="1"
    :max="60"
    :step="1"
  />
</template>

<script setup>
import { ref } from "vue";
import NumberField from "@/components/atoms/NumberField.vue";

const workSec = ref(7);
</script>
