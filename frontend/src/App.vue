<script setup>
import { computed } from 'vue';
import { state } from './store';
import Stepper from './components/Stepper.vue';
import Home from './views/Home.vue';
import Selection from './views/Selection.vue';
import Addons from './views/Addons.vue';
import Summary from './views/Summary.vue';
import Payment from './views/Payment.vue';
import Receipt from './views/Receipt.vue';
import AdminLogin from './views/AdminLogin.vue';
import Admin from './views/Admin.vue';

const cottagePrice = computed(() => state.selectedCottage?.price || 0);
const grillPrice = computed(() => state.hasGrill ? 300 : 0);
const total = computed(() => cottagePrice.value + grillPrice.value);

const showTotalPill = computed(() => {
  return total.value > 0 && ['selection', 'addons', 'summary', 'payment'].includes(state.currentView);
});
</script>

<template>
  <!-- Admin Portal -->
  <div v-if="state.isAdminMode">
    <AdminLogin v-if="!state.adminAuthenticated" />
    <Admin v-else />
  </div>

  <!-- Main Booking App -->
  <div v-else id="app-inner">
    <div class="live-total-bar">
      <div class="live-total-pill" :class="{ visible: showTotalPill }">
        Total: ₱{{ total.toLocaleString() }}
      </div>
    </div>

    <main id="main-content">
      <Stepper />

      <Home v-if="state.currentView === 'home'" />
      <Selection v-else-if="state.currentView === 'selection'" />
      <Addons v-else-if="state.currentView === 'addons'" />
      <Summary v-else-if="state.currentView === 'summary'" />
      <Payment v-else-if="state.currentView === 'payment'" />
      <Receipt v-else-if="state.currentView === 'receipt'" />
    </main>

    <!-- Hidden Admin Trigger -->
    <button class="admin-trigger" @click="state.isAdminMode = true" title="Admin Portal">
      ⚙
    </button>
  </div>
</template>

<style>
.admin-trigger {
  position: fixed;
  bottom: 24px;
  left: 24px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.3);
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  z-index: 999;
  text-transform: none;
  letter-spacing: 0;
}

.admin-trigger:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transform: rotate(60deg);
  box-shadow: none;
}
</style>
