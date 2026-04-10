<script setup>
import { computed } from 'vue';
import { state, showView } from '../store';
import CottageCard from '../components/CottageCard.vue';

const today = new Date().toISOString().split('T')[0];

const dayDisplay = computed(() => {
  if (!state.bookingDate) return '';
  const d = new Date(state.bookingDate);
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
});

const availableCount = computed(() =>
  state.cottages.filter(c => !c.bookings.includes(state.bookingDate)).length
);

const selectCottage = (cottage) => {
  state.selectedCottage = cottage;
  showView('addons');
};
</script>

<template>
  <section id="view-selection" class="sel-root fade-in">

    <!-- ── Page Header ── -->
    <div class="sel-header">
      <div class="sel-eyebrow-row">
        <span class="sel-step-tag">Step 1 <span class="sel-step-of">of 4</span></span>
        <span class="sel-divider-line"></span>
        <span class="sel-step-label">Cottage Selection</span>
      </div>
      <h2 class="sel-title">Find Your <em>Escape</em></h2>
      <p class="sel-subtitle">Fill in your details and pick a date to see what's available.</p>
    </div>

    <!-- ── Booking Form ── -->
    <div class="sel-form-card">
      <div class="sel-form">

        <div class="sel-field">
          <label class="sel-label" for="sel-group-name">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Group / Name
          </label>
          <input
            id="sel-group-name"
            type="text"
            v-model="state.groupName"
            placeholder="e.g. Santos Family, Batch 2020"
            class="sel-input"
          />
        </div>

        <div class="sel-field">
          <label class="sel-label" for="sel-event-type">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Event Type
          </label>
          <div class="sel-select-wrap">
            <select id="sel-event-type" v-model="state.eventType" class="sel-select">
              <option value="" disabled>Select an event type</option>
              <option>Birthday Celebration</option>
              <option>Family Reunion</option>
              <option>Barkada Outing</option>
              <option>Team Building</option>
              <option>Anniversary</option>
              <option>Beach Party</option>
              <option>Other</option>
            </select>
            <svg class="sel-arrow" width="11" height="7" viewBox="0 0 12 8" fill="none"><path d="M1 1l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
        </div>

        <div class="sel-field">
          <label class="sel-label" for="sel-date">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Booking Date
          </label>
          <input id="sel-date" type="date" v-model="state.bookingDate" :min="today" class="sel-input" />
        </div>

      </div>
    </div>

    <!-- ── Availability Strip ── -->
    <div class="sel-avail-strip" :class="{ 'has-date': state.bookingDate }">
      <div class="sel-avail-left">
        <transition name="fade-slot" mode="out-in">
          <div class="sel-avail-info" v-if="state.bookingDate" :key="state.bookingDate">
            <span class="sel-avail-pulse"></span>
            <span class="sel-avail-num">{{ availableCount }}</span>
            <span class="sel-avail-desc">
              cottage{{ availableCount !== 1 ? 's' : '' }} available
              <span class="sel-avail-day">· {{ dayDisplay }}</span>
            </span>
          </div>
          <div class="sel-avail-info sel-avail-empty" v-else key="empty">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Pick a date above to see availability
          </div>
        </transition>
      </div>
      <button class="sel-back-btn" @click="showView('home')">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        Back
      </button>
    </div>

    <!-- ── Cottage Grid ── -->
    <div id="cottage-grid" class="sel-grid">
      <div v-if="!state.bookingDate" class="sel-grid-overlay">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <p>Select a date to view available cottages</p>
      </div>
      <CottageCard
        v-for="c in state.cottages"
        :key="'search-' + c.id"
        :cottage="c"
        :date="state.bookingDate"
        @select="selectCottage"
      />
    </div>

  </section>
</template>

<style scoped>
/* ── Root — No panel, full bleed ──────────────────── */
.sel-root {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
}

/* ── Header ───────────────────────────────────────── */
.sel-header {
  text-align: center;
  margin-bottom: 40px;
}

.sel-eyebrow-row {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 22px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 100px;
  padding: 6px 18px;
  backdrop-filter: blur(10px);
}

.sel-step-tag {
  font-size: 0.64rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: rgba(255, 255, 255, 0.95);
}

.sel-step-of {
  font-weight: 400;
  opacity: 0.5;
}

.sel-divider-line {
  width: 1px;
  height: 12px;
  background: rgba(255, 255, 255, 0.25);
}

.sel-step-label {
  font-size: 0.64rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: rgba(255, 255, 255, 0.55);
}

.sel-title {
  font-size: 3.4rem;
  font-weight: 200;
  color: #ffffff;
  letter-spacing: -0.03em;
  margin-bottom: 14px;
  line-height: 1.05;
  text-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
}

.sel-title em {
  font-style: italic;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.75);
}

.sel-subtitle {
  font-size: 0.88rem;
  color: rgba(255, 255, 255, 0.55);
  font-weight: 300;
  letter-spacing: 0.02em;
}

/* ── Form Card ────────────────────────────────────── */
.sel-form-card {
  max-width: 900px;
  margin: 0 auto 24px auto;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.sel-form {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
}

.sel-field {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sel-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: rgba(255, 255, 255, 0.55);
}

.sel-label svg {
  flex-shrink: 0;
  opacity: 0.7;
}

/* Inputs */
.sel-input {
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  border-radius: 12px;
  padding: 14px 16px;
  font-family: inherit;
  font-size: 0.92rem;
  width: 100%;
  color: #fff !important;
  transition: all 0.25s ease;
  backdrop-filter: blur(10px);
}

.sel-input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.sel-input:focus {
  outline: none !important;
  background: rgba(255, 255, 255, 0.18) !important;
  border-color: rgba(255, 255, 255, 0.45) !important;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.08) !important;
}

/* Date input text color fix */
.sel-input[type="date"] {
  color-scheme: dark;
}

/* Select wrapper */
.sel-select-wrap {
  position: relative;
}

.sel-select {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 14px 40px 14px 16px;
  font-family: inherit;
  font-size: 0.92rem;
  width: 100%;
  color: #fff;
  transition: all 0.25s ease;
  cursor: pointer;
  appearance: none;
  backdrop-filter: blur(10px);
}

.sel-select option {
  background: #1a2a1a;
  color: #fff;
}

.sel-select:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.18);
  border-color: rgba(255, 255, 255, 0.45);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.08);
}

.sel-arrow {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: rgba(255, 255, 255, 0.45);
}

/* ── Availability Strip ───────────────────────────── */
.sel-avail-strip {
  max-width: 900px;
  margin: 0 auto 32px auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all 0.4s ease;
}

.sel-avail-strip.has-date {
  background: rgba(56, 161, 105, 0.12);
  border-color: rgba(56, 161, 105, 0.3);
}

.sel-avail-left {
  flex: 1;
  min-height: 22px;
  display: flex;
  align-items: center;
}

.sel-avail-info {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.83rem;
  color: rgba(255, 255, 255, 0.75);
}

.sel-avail-empty {
  color: rgba(255, 255, 255, 0.35);
  font-size: 0.78rem;
}

.sel-avail-pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4ADE80;
  flex-shrink: 0;
  box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.2);
  animation: avail-pulse 2s infinite;
}

@keyframes avail-pulse {
  0%, 100% { box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.2); }
  50%       { box-shadow: 0 0 0 6px rgba(74, 222, 128, 0.08); }
}

.sel-avail-num {
  font-size: 1.05rem;
  font-weight: 600;
  color: #4ADE80;
}

.sel-avail-desc {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.8rem;
}

.sel-avail-day {
  font-weight: 500;
  color: rgba(255, 255, 255, 0.75);
}

.sel-back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: rgba(255, 255, 255, 0.6);
  padding: 9px 18px;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border-radius: 100px;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.sel-back-btn:hover {
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  transform: none;
  box-shadow: none;
}

/* ── Cottage Grid ─────────────────────────────────── */
.sel-grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 16px;
  min-height: 180px;
}

.sel-grid-overlay {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(6px);
  border-radius: 16px;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.8rem;
  letter-spacing: 0.03em;
  pointer-events: none;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/* ── Transitions ──────────────────────────────────── */
.fade-slot-enter-active,
.fade-slot-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}
.fade-slot-enter-from { opacity: 0; transform: translateY(4px); }
.fade-slot-leave-to   { opacity: 0; transform: translateY(-4px); }

/* ── Responsive ───────────────────────────────────── */
@media (max-width: 760px) {
  .sel-root { padding: 0 20px; }
  .sel-form { grid-template-columns: 1fr; }
  .sel-title { font-size: 2.4rem; }
  .sel-avail-strip { flex-direction: column; align-items: flex-start; gap: 14px; }
  .sel-form-card { padding: 20px; }
}
</style>
