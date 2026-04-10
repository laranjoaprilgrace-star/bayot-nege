<script setup>
import { state, showView } from '../store';
import { computed } from 'vue';

const cottagePrice = computed(() => state.selectedCottage?.price || 0);
const grillPrice = computed(() => state.hasGrill ? 300 : 0);
const total = computed(() => cottagePrice.value + grillPrice.value);
</script>

<template>
  <section id="view-summary" class="container fade-in">
    <div style="max-width: 500px; margin: 0 auto;">
      <h2 style="margin-bottom: 40px; text-align: center;">Summary</h2>
      <div id="summary-details" style="margin-bottom: 40px; border-bottom: 1px solid var(--border-color); padding-bottom: 40px;">
        <div style="margin-bottom: 32px;">
          <div style="font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); margin-bottom: 8px;">Group / Customer Name</div>
          <div style="font-weight: 500;">{{ state.groupName || 'Not Provided' }}</div>
        </div>
        <div style="margin-bottom: 32px;">
          <div style="font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); margin-bottom: 8px;">Event</div>
          <div style="font-weight: 300;">{{ state.eventType || 'Not Specified' }}</div>
        </div>
        <div style="margin-bottom: 32px;">
          <div style="font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); margin-bottom: 8px;">Accommodation</div>
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <div style="font-weight: 300;">Cottage {{ state.selectedCottage?.id }} (1 Day)</div>
            <div style="font-weight: 500;">₱{{ cottagePrice.toLocaleString() }}</div>
          </div>
        </div>
        <div style="margin-bottom: 32px;">
          <div style="font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); margin-bottom: 8px;">Add-ons</div>
          <div style="display: flex; justify-content: space-between;">
            <div style="font-weight: 300;">Grill Service</div>
            <div style="font-weight: 500;">₱{{ grillPrice.toLocaleString() }}</div>
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 1.5rem; margin-top: 40px; border-top: 1px solid var(--border-color); padding-top: 24px;">
          <div style="font-weight: 200;">Total</div>
          <div style="font-weight: 500;">₱{{ total.toLocaleString() }}</div>
        </div>
      </div>
      <button 
        @click="showView('payment')" 
        style="width: 100%;" 
        :disabled="!state.groupName.trim()"
      >
        Proceed to Payment
      </button>
      <p v-if="!state.groupName.trim()" style="font-size: 0.8rem; color: #e53e3e; text-align: center; margin-top: 12px; font-weight: 500;">
        Please enter the group / customer name to proceed.
      </p>
      <button @click="showView('selection')" class="secondary" style="width: 100%; margin-top: 16px;">Change Selection</button>
    </div>
  </section>
</template>
