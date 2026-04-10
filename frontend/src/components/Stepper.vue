<script setup>
import { computed } from 'vue';
import { state } from '../store';

const currentStep = computed(() => {
  if (['selection'].includes(state.currentView)) return 'step-selection';
  if (['addons'].includes(state.currentView)) return 'step-addons';
  if (['summary', 'payment'].includes(state.currentView)) return 'step-summary';
  return null;
});
</script>

<template>
  <div v-if="currentStep" id="stepper-container" class="container" style="margin-top: 40px;">
    <div class="stepper">
      <div class="step" :class="{ active: currentStep === 'step-selection' }">
        <div class="step-circle"></div>
        <span>Search</span>
      </div>
      <div class="step" :class="{ active: currentStep === 'step-addons' }">
        <div class="step-circle"></div>
        <span>Add-ons</span>
      </div>
      <div class="step" :class="{ active: currentStep === 'step-summary' }">
        <div class="step-circle"></div>
        <span>Confirm</span>
      </div>
    </div>
  </div>
</template>
