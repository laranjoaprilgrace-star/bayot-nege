<script setup>
import { state, showView } from '../store';
import { computed } from 'vue';

const cottagePrice = computed(() => state.selectedCottage?.price || 0);
const grillPrice = computed(() => state.hasGrill ? 300 : 0);
const total = computed(() => cottagePrice.value + grillPrice.value);
</script>

<template>
  <section id="view-addons" class="container fade-in">

    <!-- Header -->
    <div class="addon-header">
      <p class="addon-eyebrow">Step 2 of 4</p>
      <h2 class="addon-title">Personalise Your Stay</h2>
      <p class="addon-subtitle">Tell us a bit about your group and choose any extras.</p>
    </div>

    <!-- Two-column layout -->
    <div class="addon-body">

      <!-- LEFT: Guest Info -->
      <div class="addon-section">
        <p class="addon-section-label">Guest Information</p>

        <div class="addon-field">
          <label class="addon-label">Group / Customer Name</label>
          <input type="text" v-model="state.groupName" placeholder="e.g. Santos Family, Batch 2020" />
        </div>

        <div class="addon-field">
          <label class="addon-label">What's the Event?</label>
          <select v-model="state.eventType" class="addon-select">
            <option value="" disabled>Select an event type</option>
            <option>Birthday Celebration</option>
            <option>Family Reunion</option>
            <option>Barkada Outing</option>
            <option>Team Building</option>
            <option>Anniversary</option>
            <option>Beach Party</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      <!-- Vertical Divider -->
      <div class="addon-divider"></div>

      <!-- RIGHT: Add-ons -->
      <div class="addon-section">
        <p class="addon-section-label">Add-ons</p>

        <!-- Grill Toggle Card -->
        <div class="addon-card" :class="{ active: state.hasGrill }" @click="state.hasGrill = !state.hasGrill">
          <div class="addon-card-icon">🔥</div>
          <div class="addon-card-info">
            <div class="addon-card-name">Modern Grill</div>
            <div class="addon-card-desc">Charcoal grill setup for the whole day</div>
          </div>
          <div class="addon-card-right">
            <div class="addon-card-price">+₱300</div>
            <div class="addon-toggle" :class="{ on: state.hasGrill }">
              <div class="addon-toggle-knob"></div>
            </div>
          </div>
        </div>

        <!-- Running Total -->
        <div class="addon-total">
          <span class="addon-total-label">Running Total</span>
          <span class="addon-total-value">₱{{ total.toLocaleString() }}</span>
        </div>
      </div>
    </div>

    <!-- Footer Actions -->
    <div class="addon-footer">
      <button @click="showView('selection')" class="addon-back-btn">← Back</button>
      <button @click="showView('summary')" class="addon-next-btn">Review Summary →</button>
    </div>

  </section>
</template>

<style scoped>
/* ── Header ───────────────────────────────────────── */
.addon-header {
  text-align: center;
  margin-bottom: 52px;
}

.addon-eyebrow {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--text-muted);
  margin-bottom: 12px;
  opacity: 0.6;
}

.addon-title {
  font-size: 2.75rem;
  font-weight: 300;
  color: var(--text-main);
  letter-spacing: -0.02em;
  margin-bottom: 12px;
  line-height: 1.1;
}

.addon-subtitle {
  font-size: 0.95rem;
  color: var(--text-muted);
  font-weight: 300;
  opacity: 0.7;
}

/* ── Body Layout ──────────────────────────────────── */
.addon-body {
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  gap: 48px;
  max-width: 820px;
  margin: 0 auto 48px auto;
  align-items: start;
}

.addon-divider {
  background: rgba(0, 0, 0, 0.08);
  height: 100%;
  min-height: 200px;
}

/* ── Section ──────────────────────────────────────── */
.addon-section-label {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--text-muted);
  opacity: 0.5;
  margin-bottom: 24px;
}

/* ── Fields ───────────────────────────────────────── */
.addon-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.addon-label {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-muted);
}

.addon-select {
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 16px;
  font-family: inherit;
  font-size: 1rem;
  width: 100%;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23000' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  padding-right: 40px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.addon-select:focus {
  outline: none;
  background-color: white;
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.05);
}

/* ── Add-on Card ──────────────────────────────────── */
.addon-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.09);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.25s ease;
  background: rgba(255,255,255,0.3);
  margin-bottom: 24px;
  user-select: none;
}

.addon-card:hover {
  background: rgba(255,255,255,0.6);
  border-color: rgba(0,0,0,0.15);
}

.addon-card.active {
  background: white;
  border-color: var(--primary);
  box-shadow: 0 4px 20px rgba(0,0,0,0.07);
}

.addon-card-icon {
  font-size: 1.75rem;
  flex-shrink: 0;
}

.addon-card-info {
  flex: 1;
}

.addon-card-name {
  font-weight: 500;
  font-size: 0.95rem;
  margin-bottom: 2px;
}

.addon-card-desc {
  font-size: 0.78rem;
  color: var(--text-muted);
  font-weight: 300;
}

.addon-card-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  flex-shrink: 0;
}

.addon-card-price {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted);
}

/* ── Toggle Switch ────────────────────────────────── */
.addon-toggle {
  width: 40px;
  height: 22px;
  background: rgba(0, 0, 0, 0.12);
  border-radius: 100px;
  position: relative;
  transition: background 0.25s ease;
  flex-shrink: 0;
}

.addon-toggle.on {
  background: var(--primary);
}

.addon-toggle-knob {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.on .addon-toggle-knob {
  transform: translateX(18px);
}

/* ── Running Total ────────────────────────────────── */
.addon-total {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-top: 20px;
  border-top: 1px solid rgba(0,0,0,0.08);
}

.addon-total-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  opacity: 0.7;
}

.addon-total-value {
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--text-main);
}

/* ── Footer ───────────────────────────────────────── */
.addon-footer {
  max-width: 820px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(0,0,0,0.08);
  padding-top: 32px;
}

.addon-back-btn {
  background: transparent;
  border: 1px solid rgba(0,0,0,0.15);
  color: var(--text-muted);
  padding: 12px 24px;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  border-radius: 100px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.addon-back-btn:hover {
  background: rgba(0,0,0,0.04);
  color: var(--text-main);
  transform: none;
}

.addon-next-btn {
  background: var(--primary);
  color: white;
  border: 1px solid var(--primary);
  padding: 14px 32px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-radius: 100px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.addon-next-btn:hover {
  background: transparent;
  color: var(--primary);
  transform: translateY(-2px);
}

/* ── Responsive ───────────────────────────────────── */
@media (max-width: 680px) {
  .addon-body {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .addon-divider {
    height: 1px;
    min-height: unset;
    width: 100%;
    margin: 8px 0;
  }

  .addon-title {
    font-size: 2rem;
  }

  .addon-footer {
    flex-direction: column-reverse;
    gap: 12px;
  }

  .addon-back-btn,
  .addon-next-btn {
    width: 100%;
    text-align: center;
  }
}
</style>
