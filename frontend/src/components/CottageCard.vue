<script setup>
import { computed } from 'vue';
import { state } from '../store';

const props = defineProps({
  cottage: Object,
  date: String
});

const emit = defineEmits(['select']);

const isAvailable = computed(() => !props.cottage.bookings.includes(props.date));
const isSelected  = computed(() => state.selectedCottage?.id === props.cottage.id);
</script>

<template>
  <div
    class="cottage-card"
    :class="{
      reserved: !isAvailable,
      selected: isSelected,
      available: isAvailable
    }"
    @click="isAvailable && emit('select', cottage)"
    :tabindex="isAvailable ? 0 : -1"
    @keydown.enter="isAvailable && emit('select', cottage)"
    role="button"
  >
    <!-- Tier badge -->
    <div class="cc-tier" :class="cottage.tier === 'Premium' ? 'cc-tier--premium' : 'cc-tier--standard'">
      <span class="cc-tier-dot"></span>
      {{ cottage.tier }}
    </div>

    <!-- Name -->
    <div class="cc-name">Cottage <span class="cc-num">{{ cottage.id }}</span></div>

    <!-- Separator -->
    <div class="cc-sep"></div>

    <!-- Price / Status -->
    <div class="cc-bottom">
      <template v-if="isAvailable">
        <div class="cc-price">
          <span class="cc-price-val">₱{{ cottage.price.toLocaleString() }}</span>
          <span class="cc-price-unit">/ day</span>
        </div>
        <div class="cc-cta" :class="{ 'cc-cta--on': isSelected }">
          {{ isSelected ? '✓ Selected' : 'Select →' }}
        </div>
      </template>
      <template v-else>
        <div class="cc-reserved-row">
          <span class="cc-price-strike">₱{{ cottage.price.toLocaleString() }}</span>
          <span class="cc-reserved-badge">Reserved</span>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.cottage-card {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 26px 26px 22px;
  border-radius: 18px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

/* Subtle inner glow top edge */
.cottage-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
}

.cottage-card.available:hover {
  background: rgba(255, 255, 255, 0.18);
  transform: translateY(-6px);
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.35);
  border-color: rgba(255, 255, 255, 0.3);
}

.cottage-card.selected {
  background: rgba(255, 255, 255, 0.22);
  border-color: rgba(255, 255, 255, 0.55);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.4);
  transform: translateY(-4px);
}

.cottage-card.reserved {
  opacity: 0.38;
  filter: grayscale(0.6);
  pointer-events: none;
  border-color: rgba(255, 255, 255, 0.06);
}

/* Tier */
.cc-tier {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 0.58rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  margin-bottom: 14px;
}
.cc-tier--premium { color: #F6C87A; }
.cc-tier--standard { color: rgba(255,255,255,0.45); }

.cc-tier-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
}

/* Name */
.cc-name {
  font-size: 1.5rem;
  font-weight: 200;
  color: rgba(255, 255, 255, 0.95);
  letter-spacing: -0.01em;
  margin-bottom: 18px;
}
.cc-num { font-weight: 400; }

/* Separator */
.cc-sep {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin-bottom: 18px;
}

/* Price */
.cc-price {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 12px;
}
.cc-price-val {
  font-size: 1.2rem;
  font-weight: 500;
  color: #fff;
}
.cc-price-unit {
  font-size: 0.75rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.4);
}

/* CTA */
.cc-cta {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.3);
  transition: color 0.2s ease;
}
.cottage-card.available:hover .cc-cta { color: rgba(255,255,255,0.85); }
.cc-cta--on { color: #4ADE80 !important; }

/* Reserved */
.cc-reserved-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.cc-price-strike {
  text-decoration: line-through;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.3);
}
.cc-reserved-badge {
  font-size: 0.58rem;
  font-weight: 800;
  background: rgba(229, 62, 62, 0.8);
  color: white;
  padding: 4px 10px;
  border-radius: 6px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  backdrop-filter: blur(4px);
}
</style>
