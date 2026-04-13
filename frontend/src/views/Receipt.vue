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

      <!-- Header -->
      <div class="receipt-header">
        <div class="receipt-check">✓</div>
        <h2 class="receipt-title">Booking Confirmed</h2>
        <p class="receipt-sub">Safe travels. Your reservation is secure.</p>
      </div>

      <!-- Ref & Date -->
      <div class="receipt-section">
        <div class="receipt-row">
          <span class="receipt-label">Reference No.</span>
          <span class="receipt-value bold">{{ state.refNumber.toUpperCase() }}</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">Transaction Date</span>
          <span class="receipt-value">{{ timestamp }}</span>
        </div>
      </div>

      <div class="receipt-divider"></div>

      <!-- Guest Info -->
      <div class="receipt-section">
        <div class="receipt-section-title">Guest Details</div>
        <div class="receipt-row">
          <span class="receipt-label">Name / Group</span>
          <span class="receipt-value bold">{{ state.groupName }}</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">Event Type</span>
          <span class="receipt-value">{{ state.eventType || '—' }}</span>
        </div>
      </div>

      <div class="receipt-divider"></div>

      <!-- Booking Info -->
      <div class="receipt-section">
        <div class="receipt-section-title">Reservation</div>
        <div class="receipt-row">
          <span class="receipt-label">Cottage</span>
          <span class="receipt-value bold">
            Cottage {{ state.selectedCottage?.id }}
            <span class="receipt-badge">{{ state.selectedCottage?.tier }}</span>
          </span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">Date</span>
          <span class="receipt-value">{{ displayDate }}</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">Duration</span>
          <span class="receipt-value">Full Day (12am – 11:59pm)</span>
        </div>
        <div class="receipt-row" v-if="state.hasGrill">
          <span class="receipt-label">Add-on</span>
          <span class="receipt-value">Grill Service</span>
        </div>
      </div>

      <div class="receipt-divider"></div>

      <!-- Total -->
      <div class="receipt-total-row">
        <span class="receipt-total-label">Total Paid</span>
        <span class="receipt-total-amount">₱{{ total.toLocaleString() }}</span>
      </div>

      <button @click="returnHome" class="receipt-btn">Return Home</button>
    </div>
  </section>
</template>

<style scoped>
.receipt-box {
  background: #ffffff;
  padding: 44px 40px 40px;
  border-radius: 20px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.18);
  max-width: 460px;
  width: 100%;
  margin: 0 auto;
  color: #1a1a1a;
}

/* Header */
.receipt-header {
  text-align: center;
  margin-bottom: 28px;
}
.receipt-check {
  width: 48px;
  height: 48px;
  background: #1a1a1a;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  margin: 0 auto 14px;
}
.receipt-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 6px;
}
.receipt-sub {
  font-size: 0.85rem;
  color: #888;
  font-weight: 300;
}

/* Sections */
.receipt-section {
  margin-bottom: 16px;
}
.receipt-section-title {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #aaa;
  margin-bottom: 10px;
}
.receipt-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 7px;
}
.receipt-label {
  font-size: 0.82rem;
  color: #999;
  white-space: nowrap;
}
.receipt-value {
  font-size: 0.88rem;
  color: #1a1a1a;
  text-align: right;
  font-weight: 400;
}
.receipt-value.bold {
  font-weight: 600;
}
.receipt-badge {
  display: inline-block;
  margin-left: 6px;
  padding: 1px 8px;
  border-radius: 20px;
  font-size: 0.65rem;
  font-weight: 600;
  background: #f0f0f0;
  color: #555;
  vertical-align: middle;
  letter-spacing: 0.04em;
}

/* Divider */
.receipt-divider {
  border: none;
  border-top: 1px solid #ebebeb;
  margin: 18px 0;
}

/* Total */
.receipt-total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
}
.receipt-total-label {
  font-size: 0.9rem;
  color: #888;
  font-weight: 400;
}
.receipt-total-amount {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
}

/* Button */
.receipt-btn {
  width: 100%;
  padding: 14px;
  background: #1a1a1a;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: background 0.2s;
}
.receipt-btn:hover {
  background: #333;
}
</style>
