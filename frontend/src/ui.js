import { state } from './store';
import { isDateAvailable, calculateTotal } from './booking';

// --- DOM Elements ---
export const elements = {
  views: {
    home: document.getElementById('view-home'),
    selection: document.getElementById('view-selection'),
    addons: document.getElementById('view-addons'),
    summary: document.getElementById('view-summary'),
    payment: document.getElementById('view-payment'),
    receipt: document.getElementById('view-receipt')
  },
  homeCottageGrid: document.getElementById('home-cottage-grid'),
  searchCottageGrid: document.getElementById('cottage-grid'),
  summaryDetails: document.getElementById('summary-details'),
  receiptDetails: document.getElementById('receipt-details'),
  addonGrillInput: document.getElementById('addon-grill'),
  refNumberInput: document.getElementById('ref-number'),
  checkInInput: document.getElementById('check-in'),
  nightCountFeedback: document.getElementById('night-count-feedback'),
  liveTotalPill: document.getElementById('live-total-pill'),
  stepperContainer: document.getElementById('stepper-container'),
  paymentTotalDisplay: document.getElementById('payment-total-display'),
};

const viewToStep = {
  selection: 'step-selection',
  addons: 'step-addons',
  summary: 'step-summary',
  payment: 'step-summary'
};

// --- View Management ---
export function showView(viewName, onShow) {
  Object.values(elements.views).forEach(v => v ? v.classList.add('hidden') : null);
  if (elements.views[viewName]) elements.views[viewName].classList.remove('hidden');
  state.currentView = viewName;
  window.scrollTo({ top: 0, behavior: 'instant' });

  updateStepper();
  updateLiveTotal();
  
  if (onShow) onShow(viewName);
}

export function updateStepper() {
  const stepId = viewToStep[state.currentView];
  const steps = document.querySelectorAll('.step');
  
  if (!stepId) {
    elements.stepperContainer.classList.add('hidden');
    return;
  }
  
  elements.stepperContainer.classList.remove('hidden');
  steps.forEach(s => s.classList.remove('active'));
  
  const currentStep = document.getElementById(stepId);
  if (currentStep) currentStep.classList.add('active');
}

export function updateLiveTotal() {
  const total = calculateTotal();
  if (total > 0 && ['selection', 'addons', 'summary', 'payment'].includes(state.currentView)) {
    elements.liveTotalPill.classList.add('visible');
    elements.liveTotalPill.textContent = `Total: ₱${total.toLocaleString()}`;
  } else {
    elements.liveTotalPill.classList.remove('visible');
  }
}

// --- Specific View Renderers ---
export function renderCottageGrid(container, dateStr, onSelect) {
  if (!container) return;
  container.innerHTML = '';
  state.cottages.forEach(c => {
    const isAvailable = isDateAvailable(c.id, dateStr);
    const card = document.createElement('div');
    card.className = 'cottage-card';
    if (!isAvailable) card.classList.add('reserved');
    if (state.selectedCottage?.id === c.id) card.classList.add('selected');
    
    const priceDisplay = isAvailable 
      ? `₱${c.price.toLocaleString()} <span style="font-weight: 300; font-size: 0.8rem; color: var(--text-muted);">/ day</span>`
      : `<span style="text-decoration: line-through; color: var(--text-muted); opacity: 0.5;">₱${c.price.toLocaleString()}</span> <span style="font-size: 0.7rem; font-weight: 600; color: #e53e3e;">RESERVED</span>`;

    card.innerHTML = `
      <div style="font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); margin-bottom: 12px;">${c.tier}</div>
      <div style="font-size: 1.25rem; font-weight: 300; margin-bottom: 24px;">Cottage ${c.id}</div>
      <div style="font-size: 1rem; font-weight: 500;">${priceDisplay}</div>
    `;

    if (isAvailable) {
      card.addEventListener('click', () => {
        onSelect(c, dateStr);
      });
    }

    container.appendChild(card);
  });
}

export function updateSummary() {
  const cottageTotal = state.selectedCottage.price;
  const grillPrice = state.hasGrill ? 300 : 0;
  const total = cottageTotal + grillPrice;

  elements.summaryDetails.innerHTML = `
    <div style="margin-bottom: 32px;">
      <div style="font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); margin-bottom: 8px;">Accommodation</div>
      <div style="display: flex; justify-content: space-between; align-items: baseline;">
        <div style="font-weight: 300;">Cottage ${state.selectedCottage.id} (1 Day)</div>
        <div style="font-weight: 500;">₱${cottageTotal.toLocaleString()}</div>
      </div>
    </div>
    <div style="margin-bottom: 32px;">
      <div style="font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); margin-bottom: 8px;">Add-ons</div>
      <div style="display: flex; justify-content: space-between;">
        <div style="font-weight: 300;">Grill Service</div>
        <div style="font-weight: 500;">₱${grillPrice.toLocaleString()}</div>
      </div>
    </div>
    <div style="display: flex; justify-content: space-between; font-size: 1.5rem; margin-top: 40px; border-top: 1px solid var(--border-color); padding-top: 24px;">
      <div style="font-weight: 200;">Total</div>
      <div style="font-weight: 500;">₱${total.toLocaleString()}</div>
    </div>
  `;
}

export function updatePaymentDisplay() {
  const total = calculateTotal();
  if (elements.paymentTotalDisplay) {
    elements.paymentTotalDisplay.textContent = `₱${total.toLocaleString()}`;
  }
}

export function updateReceipt() {
  const total = calculateTotal();
  const timestamp = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const displayDate = new Date(state.bookingDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  elements.receiptDetails.innerHTML = `
    <div style="margin-bottom: 48px; border-bottom: 1px solid var(--border-color); padding-bottom: 24px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <span style="color: var(--text-muted); font-size: 0.8rem;">REF #</span>
        <span style="font-weight: 600; letter-spacing: 0.05em;">${state.refNumber.toUpperCase()}</span>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span style="color: var(--text-muted); font-size: 0.8rem;">TRANSACTION DATE</span>
        <span style="font-weight: 300;">${timestamp}</span>
      </div>
    </div>
    
    <div style="margin-bottom: 48px;">
      <div style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); margin-bottom: 16px;">Itinerary</div>
      <div style="font-weight: 300; line-height: 1.8;">
        Cottage ${state.selectedCottage.id}<br>
        Date: ${displayDate}<br>
        Duration: Full Day (12am - 11:59pm)<br>
        ${state.hasGrill ? `Grill Service (₱300)` : ''}
      </div>
    </div>

    <div style="border-top: 1px solid var(--border-color); padding-top: 24px; display: flex; justify-content: space-between; font-size: 1.25rem;">
      <span style="font-weight: 200;">Amount Paid</span>
      <span style="font-weight: 500;">₱${total.toLocaleString()}</span>
    </div>
  `;
}
