<script setup>
import { state, showView } from '../store';
import CottageCard from '../components/CottageCard.vue';

const today = new Date().toISOString().split('T')[0];

const selectCottage = (cottage) => {
  state.bookingDate = today;
  state.selectedCottage = cottage;
  showView('addons');
};
</script>

<template>
  <section id="view-home" class="container fade-in">
    <div style="text-align: center; max-width: 800px; margin: 0 auto; margin-bottom: 80px;">
      <h1 style="font-size: 3.5rem; margin-bottom: 24px; color: white; text-shadow: 0 4px 20px rgba(0,0,0,0.5);">
         The Art of <span style="font-weight: 500;">Escape</span>
      </h1>
      <p style="font-size: 1.25rem; color: white; font-weight: 300; line-height: 1.8; text-shadow: 0 2px 10px rgba(0,0,0,0.5); margin-bottom: 40px;">
         Experience curated tranquility in our architectural cottages. Simple. Elegant. Quiet.
      </p>
      <button 
        id="btn-early-booking" 
        class="secondary" 
        style="border-radius: 100px; padding: 12px 32px; font-size: 0.85rem; font-weight: 600; letter-spacing: 0.1em;"
        @click="showView('selection')"
      >
        EARLY BOOKING
      </button>
    </div>
    
    <div style="border-top: 1px solid var(--border-color); margin-bottom: 60px;"></div>
    
    <h2 style="text-align: center; margin-bottom: 40px; font-size: 1.75rem; font-weight: 400; color: white; text-shadow: 0 2px 10px rgba(0,0,0,0.5);">
       Available Today
    </h2>
    <div id="home-cottage-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 32px; margin-bottom: 80px;">
       <CottageCard 
         v-for="c in state.cottages" 
         :key="'home-'+c.id" 
         :cottage="c" 
         :date="today"
         @select="selectCottage"
       />
    </div>
  </section>
</template>
