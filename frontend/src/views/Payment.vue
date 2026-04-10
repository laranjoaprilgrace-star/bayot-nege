<script setup>
import { computed, ref } from 'vue';
import { state, showView } from '../store';

const cottagePrice = computed(() => state.selectedCottage?.price || 0);
const grillPrice = computed(() => state.hasGrill ? 300 : 0);
const total = computed(() => cottagePrice.value + grillPrice.value);

const refNumber = ref('');
const copied = ref(false);

const copyNumber = () => {
  navigator.clipboard.writeText('09365553965').then(() => {
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 2000);
  });
};

const finalize = (ref) => {
  const cottage = state.cottages.find(c => c.id === state.selectedCottage.id);
  if (cottage) cottage.bookings.push(state.bookingDate);
  state.refNumber = ref;
  state.bookingsList.push({
    id:          Date.now(),
    groupName:   state.groupName,
    eventType:   state.eventType,
    cottageId:   state.selectedCottage.id,
    cottageTier: state.selectedCottage.tier,
    bookingDate: state.bookingDate,
    hasGrill:    state.hasGrill,
    refNumber:   ref,
    total:       state.selectedCottage.price + (state.hasGrill ? 300 : 0),
    createdAt:   new Date().toLocaleString('en-PH'),
  });
  showView('receipt');
};

const confirmPayment = () => {
  const gcashRefRegex = /^\d{13}$/;
  if (!gcashRefRegex.test(refNumber.value.trim())) {
    alert('Please enter a valid 13-digit GCash Reference Number.');
    return;
  }
  finalize(refNumber.value.trim());
};

// ── DEV BYPASS ──────────────────────────────────────
const devBypass = () => {
  const fakeRef = String(Date.now()).slice(0, 13).padEnd(13, '0');
  finalize(fakeRef);
};
</script>

<template>
  <section id="view-payment" class="container fade-in">
    <div style="max-width: 500px; margin: 0 auto; text-align: center;">
      <h2 style="margin-bottom: 32px;">Final Payment</h2>
      
      <div style="background: var(--ghost-white); padding: 32px; border-radius: 12px; margin-bottom: 40px; border: 1px solid var(--border-color);">
         <div style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); margin-bottom: 8px;">Amount to Pay</div>
         <div id="payment-total-display" style="font-size: 2.5rem; font-weight: 600; color: var(--text-main); margin-bottom: 16px;">
            ₱{{ total.toLocaleString() }}
         </div>
         <p style="font-size: 0.85rem; color: #e53e3e; font-weight: 500; margin: 0; line-height: 1.5;">
            ⚠ Please send the exact amount.<br>
            Incorrect payments will result in booking cancellation.
         </p>
      </div>

      <p style="color: var(--text-muted); margin-bottom: 8px; font-weight: 300;">Scan QR or pay to GCash number:</p>
      <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 32px;">
         <div id="gcash-number-text" style="font-size: 1.5rem; font-weight: 600; letter-spacing: 0.1em; color: var(--primary);">0936 555 3965</div>
         <button @click="copyNumber" class="secondary" style="padding: 4px 12px; font-size: 0.7rem; height: auto;">
            {{ copied ? 'Copied!' : 'Copy' }}
         </button>
      </div>
      <div id="gcash-qr-container" style="padding: 20px; border: 1px solid var(--border-color); margin-bottom: 16px; display: inline-block; background: white;">
         <img src="/gcash_qr.png" alt="GCash QR Code" style="width: 200px; height: auto; filter: grayscale(1);">
      </div>
      <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 40px; font-weight: 300; max-width: 300px; margin-left: auto; margin-right: auto;">
         Using the same device? Long-press the QR to save to gallery, or copy the number above.
      </p>
      <div style="text-align: left; margin-bottom: 40px;">
         <label style="display: block; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">GCash Reference Number</label>
         <input type="text" v-model="refNumber" placeholder="Enter 13-digit number">
      </div>
      <button @click="confirmPayment" style="width: 100%;">Confirm</button>

      <!-- DEV BYPASS -->
      <div style="margin-top: 16px; text-align: center;">
        <button
          @click="devBypass"
          style="
            background: transparent;
            border: 1px dashed rgba(255,255,255,0.25);
            color: rgba(255,255,255,0.35);
            font-size: 0.65rem;
            padding: 8px 20px;
            letter-spacing: 0.12em;
            border-radius: 100px;
            cursor: pointer;
          "
        >
          ⚡ Skip Payment (Dev)
        </button>
      </div>
    </div>
  </section>
</template>
