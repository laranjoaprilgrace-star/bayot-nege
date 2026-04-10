import { reactive } from 'vue';

// --- Centralized Reactive State ---
export const state = reactive({
  currentView: 'home',
  isAdminMode: false,
  adminAuthenticated: false,
  bookingsList: [],
  selectedCottage: null,
  bookingDate: new Date().toISOString().split('T')[0],
  hasGrill: false,
  groupName: '',
  eventType: '',
  refNumber: '',
  cottages: Array.from({ length: 20 }, (_, i) => {
    const cottage = {
      id: i + 1,
      tier: i < 10 ? 'Premium' : 'Standard',
      price: i < 10 ? 1000 : 500,
      bookings: []
    };
    
    // Seed some sample bookings
    if (i === 0) {
      const today = new Date().toISOString().split('T')[0];
      cottage.bookings.push(today);
    }
    
    return cottage;
  })
});

export function resetState() {
  state.isAdminMode = false;
  state.adminAuthenticated = false;
  state.selectedCottage = null;
  state.hasGrill = false;
  state.groupName = '';
  state.eventType = '';
  state.refNumber = '';
  state.bookingDate = new Date().toISOString().split('T')[0];
}

export function showView(viewName) {
  state.currentView = viewName;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
