import { state } from './store';

// --- Availability Logic ---
export function isDateAvailable(cottageId, dateStr) {
  const cottage = state.cottages.find(c => c.id === cottageId);
  if (!cottage) return true;
  return !cottage.bookings.includes(dateStr);
}

// --- Pricing Logic ---
export function calculateTotal() {
  if (!state.selectedCottage) return 0;
  return state.selectedCottage.price + (state.hasGrill ? 300 : 0);
}

// --- Finalization ---
export function finalizeBooking(ref) {
  const cottage = state.cottages.find(c => c.id === state.selectedCottage.id);
  if (cottage) {
    cottage.bookings.push(state.bookingDate);
  }
  state.refNumber = ref;
}
