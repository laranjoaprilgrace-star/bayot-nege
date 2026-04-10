<script setup>
import { computed } from 'vue';
import { state, resetState, showView } from '../store';

const cottagePrice = computed(() => state.selectedCottage?.price || 0);
const grillPrice = computed(() => state.hasGrill ? 300 : 0);
const total = computed(() => cottagePrice.value + grillPrice.value);

const timestamp = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
const displayDate = computed(() => {
  if (!state.bookingDate) return '';
  return new Date(state.bookingDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
});

const returnHome = () => {
  resetState();
  showView('home');
};
</script>

<template>
  <section id="view-receipt" class="container fade-in">
    <div class="receipt-box fade-in">
      <div style="text-align: center; margin-bottom: 60px;">
         <h2 style="margin-bottom: 16px;">Confirmed</h2>
         <p style="color: var(--text-muted); font-weight: 300;">Safe travels. Your booking is secure.</p>
      </div>
      <div id="receipt-details" style="font-family: inherit;">
        <div style="margin-bottom: 48px; border-bottom: 1px solid var(--border-color); padding-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: var(--text-muted); font-size: 0.8rem;">REF #</span>
            <span style="font-weight: 600; letter-spacing: 0.05em;">{{ state.refNumber.toUpperCase() }}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted); font-size: 0.8rem;">TRANSACTION DATE</span>
            <span style="font-weight: 300;">{{ timestamp }}</span>
          </div>
        </div>
        
        <div style="margin-bottom: 48px;">
          <div style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); margin-bottom: 16px;">Itinerary</div>
          <div style="font-weight: 300; line-height: 1.8;">
            Group / Customer: <span style="font-weight: 500;">{{ state.groupName }}</span><br>
            Event: <span style="font-weight: 400;">{{ state.eventType || '—' }}</span><br>
            Cottage {{ state.selectedCottage?.id }}<br>
            Date: {{ displayDate }}<br>
            Duration: Full Day (12am - 11:59pm)<br>
            <span v-if="state.hasGrill">Grill Service (₱300)</span>
          </div>
        </div>

        <div style="border-top: 1px solid var(--border-color); padding-top: 24px; display: flex; justify-content: space-between; font-size: 1.25rem;">
          <span style="font-weight: 200;">Amount Paid</span>
          <span style="font-weight: 500;">₱{{ total.toLocaleString() }}</span>
        </div>
      </div>
      <button @click="returnHome" style="width: 100%; margin-top: 60px;">Return Home</button>
    </div>
  </section>
</template>
