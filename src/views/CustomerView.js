import { state, navigate } from '../state.js';
import { bookings, payments } from '../api.js';

// Removed local booking variables - now using state.js

export function renderCustomer() {
  if (!state.user) return ''; // Safety check to prevent white screen
  
  const today = new Date().toISOString().split('T')[0];
  const activeSubView = state.customerSubView || 'home';
  const displayDate = activeSubView === 'home' ? today : (state.selectedDate || today);
  const bookedOnDate = state.bookings.filter(b => b.date === displayDate && b.status === 'Confirmed').map(b => Number(b.cottageId));

  return `
    <div class="min-h-screen py-6 px-4 sm:py-12 sm:px-6 md:py-20 md:px-8 flex flex-col items-center">
      
      <!-- High-Visibility Sanctuary Container -->
      <div class="w-full max-w-5xl bg-white rounded-[2rem] sm:rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.3)] p-6 sm:p-10 md:p-12 lg:p-20 space-y-10 md:space-y-20 border-2 border-slate-100 animate-scale-up">
        
        <!-- Header -->
        <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-8 md:pb-12 border-b-2 border-slate-50 gap-4">
           <div>
              <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tighter italic">Hi, ${state.user ? state.user.name.split(' ')[0] : 'Guest'}!</h1>
              <p class="text-xs font-black text-slate-900 uppercase tracking-widest mt-1">
                 ${activeSubView === 'home' ? 'AVAILABLE COTTAGE TODAY' : `SANCTUARY AVAILABILITY: ${state.selectedDate || 'SELECT DATE'}`}
              </p>
           </div>
           <div class="flex flex-col items-start sm:items-end gap-3 w-full sm:w-auto">
              <button id="logoutBtn" class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-rose-600 transition-colors">Logout</button>
              <div class="flex gap-2">
                 <button id="viewHistory" class="text-[10px] font-black uppercase tracking-[0.2em] ${activeSubView === 'history' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900 border-2 border-slate-100'} px-4 py-2 rounded-xl hover:opacity-90 transition-all shadow-sm">
                    History
                 </button>
                 <button id="navEarly" class="text-[10px] font-black uppercase tracking-[0.2em] ${activeSubView === 'early' ? 'bg-slate-900 text-white' : 'bg-emerald-500 text-white shadow-emerald-500/20'} px-4 py-2 rounded-xl hover:opacity-90 transition-all shadow-lg active:scale-95">
                    ${activeSubView === 'home' ? 'EARLY BOOKING' : activeSubView === 'history' ? 'NEW BOOKING' : 'CHANGE DATE'}
                 </button>
              </div>
           </div>
        </header>

        ${activeSubView === 'early' && !state.selectedDate ? `
          <!-- Date Selection Step -->
          <div class="bg-slate-50 p-20 rounded-[3rem] border border-slate-100 shadow-inner text-center space-y-12 animate-fade-in">
             <div class="space-y-4">
                <h2 class="text-4xl font-black text-slate-900 tracking-tighter italic text-center">When are you coming?</h2>
                <p class="text-slate-400 text-xs font-black uppercase tracking-[0.3em]">Select your future arrival date</p>
             </div>
             <div class="max-w-xs mx-auto relative group">
                <input type="text" id="earlyDatePicker" class="w-full bg-white border-2 border-slate-100 rounded-2xl px-12 py-6 text-xl font-black text-slate-900 text-center focus:border-slate-900 transition-all shadow-xl cursor-pointer" placeholder="YYYY-MM-DD" readonly>
                <svg class="w-6 h-6 absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
             </div>
             <button id="backToHome" class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-slate-900 transition-colors">Cancel and return to today</button>
          </div>
        ` : activeSubView === 'history' ? `
          <!-- Booking History View -->
          <div class="space-y-10 animate-fade-in">
            <div class="flex justify-between items-end">
              <div>
                <h2 class="text-4xl font-black text-slate-900 tracking-tighter italic">My Bookings.</h2>
                <p class="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-2">All your sanctuary reservations</p>
              </div>
            </div>

            <div class="grid gap-6">
              ${state.bookings.filter(b => b.userId === (state.user?.id)).length === 0 ? `
                <div class="bg-slate-50 p-20 rounded-[3rem] text-center border-2 border-dashed border-slate-200">
                  <p class="text-slate-400 font-black uppercase tracking-widest text-xs">No bookings found yet</p>
                </div>
              ` : state.bookings.filter(b => b.userId === (state.user?.id)).sort((a, b) => b.date.localeCompare(a.date)).map(b => `
                <div class="bg-white border-2 border-slate-100 rounded-3xl p-8 flex flex-wrap items-center justify-between gap-6 hover:border-slate-900 transition-all group">
                  <div class="flex items-center gap-8">
                    <div class="w-16 h-16 bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-white">
                      <span class="text-[10px] font-black uppercase opacity-60">Cottage</span>
                      <span class="text-2xl font-black">#${b.cottageId}</span>
                    </div>
                    <div>
                      <p class="text-xl font-black text-slate-900 tracking-tighter">${b.date}</p>
                      <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">${b.id} • ₱${b.total.toLocaleString()}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-6">
                    <div class="text-right">
                      <span class="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${b.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-600' : b.status === 'Pending' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'}">
                        ${b.status}
                      </span>
                    </div>
                    <button class="view-receipt-btn bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-black transition-all shadow-lg active:scale-95" data-id="${b.id}">
                      View Pass
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : `
          <!-- Cottage Grid -->
          <div class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
            ${state.cottages.filter(c => c.active).map(c => {
    const isBooked = bookedOnDate.includes(c.id);
    return `
                <div 
                  class="cottage-card group transition-all ${isBooked ? 'opacity-20 cursor-not-allowed grayscale pointer-events-none' : 'cursor-pointer hover:-translate-y-2'}"
                  ${isBooked ? '' : `data-id="${c.id}" data-price="${c.price}" data-date="${displayDate}"`}
                >
                  <div class="aspect-square bg-slate-50 rounded-3xl flex items-center justify-center border-2 border-slate-100 transition-all group-hover:bg-slate-900 group-hover:border-slate-900 group-hover:shadow-xl group-hover:shadow-slate-900/20">
                     <span class="text-2xl font-black text-slate-400 group-hover:text-white transition-colors">${c.id}</span>
                  </div>
                  <div class="mt-4 flex justify-between items-center px-1">
                     <span class="text-[10px] font-black text-slate-900 uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">${c.category.split(' ')[0]}</span>
                     <span class="text-[10px] font-black text-slate-900">₱${c.price.toLocaleString()}</span>
                  </div>
                </div>
              `;
  }).join('')}
          </div>
          
          ${activeSubView === 'early' ? `
             <div class="pt-10 flex justify-center">
                <button id="backToHome" class="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] border-b-2 border-slate-900 pb-1">Reset to Today</button>
             </div>
          ` : ''}
        `}


        <div class="pt-10 text-center">
           <p class="text-[10px] font-black text-slate-200 uppercase tracking-[0.6em]">CottageEase Managed Sanctuary</p>
        </div>
      </div>

      <!-- Multi-Step Booking Modal -->
      <div id="bookingModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[200] ${state.bookingStep === 'idle' ? 'hidden' : ''} flex items-center justify-center p-6">
        <div class="bg-white max-w-md w-full p-8 md:p-12 rounded-[3.5rem] shadow-3xl animate-scale-up border-2 border-white overflow-hidden relative">
           
           ${renderModalContent()}

        </div>
      </div>
    </div>
  `;
}

function renderModalContent() {
  switch (state.bookingStep) {
    case 'addons':
      return `
        <div class="space-y-8">
          <div class="text-center">
            <h3 class="text-3xl font-black text-slate-900 tracking-tighter italic">Enhance Your Stay.</h3>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Cottage #${state.currentBooking.cottageId} • ${state.currentBooking.date}</p>
          </div>
          
          <div class="space-y-4">
            ${state.addons.map(addon => {
        // Ensure comparison works regardless of type (string vs number)
        const isSelected = state.currentBooking.selectedAddons.some(id => String(id) === String(addon.id));
        return `
                <div class="addon-toggle p-6 rounded-3xl border-2 transition-all cursor-pointer flex justify-between items-center ${isSelected ? 'border-slate-900 bg-slate-900 text-white shadow-lg' : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-300'}" data-id="${addon.id}">
                  <div>
                    <p class="font-black text-lg">${addon.name}</p>
                    <p class="text-[10px] uppercase font-bold opacity-60">Add ₱${addon.price.toLocaleString()}</p>
                  </div>
                  <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-white bg-white' : 'border-slate-300'}">
                    ${isSelected ? '<svg class="w-4 h-4 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>' : ''}
                  </div>
                </div>
              `;
      }).join('')}
          </div>

          <div class="pt-4 space-y-4">
            <button id="goToPayment" class="w-full bg-slate-900 text-white font-black py-6 rounded-2xl hover:bg-black transition-all active:scale-95 shadow-2xl shadow-slate-900/20">Review & Pay</button>
            <button id="closeModal" class="w-full text-xs font-black text-slate-400 uppercase tracking-[0.2em] hover:text-slate-900 transition-colors text-center">Cancel</button>
          </div>
        </div>
      `;

    case 'payment':
      const addonsTotal = state.currentBooking.selectedAddons.reduce((sum, id) => {
        const addon = state.addons.find(a => a.id === id);
        return sum + (addon ? addon.price : 0);
      }, 0);
      state.currentBooking.total = state.currentBooking.price + addonsTotal;

      return `
        <div class="space-y-8 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
          <div class="text-center">
            <h3 class="text-3xl font-black text-slate-900 tracking-tighter italic">Payment Details.</h3>
          </div>

          <div class="bg-slate-50 rounded-[2.5rem] p-8 space-y-4 border border-slate-100">
            <div class="flex justify-between items-center">
              <span class="text-[10px] font-black text-slate-400 uppercase">Cottage #${state.currentBooking.cottageId}</span>
              <span class="font-black text-slate-900">₱${state.currentBooking.price.toLocaleString()}</span>
            </div>
            ${state.currentBooking.selectedAddons.map(id => {
        const addon = state.addons.find(a => a.id === id);
        return `
                <div class="flex justify-between items-center text-slate-500">
                  <span class="text-[10px] font-black uppercase">+ ${addon.name}</span>
                  <span class="font-bold text-sm">₱${addon.price.toLocaleString()}</span>
                </div>
              `;
      }).join('')}
            <div class="h-px bg-slate-200 w-full my-2"></div>
            <div class="flex justify-between items-center pt-2">
              <span class="text-xs font-black text-slate-900 uppercase tracking-widest">Total Amount</span>
              <span class="text-3xl font-black text-slate-900 tracking-tighter">₱${state.currentBooking.total.toLocaleString()}</span>
            </div>
          </div>

          <div class="space-y-6">
            <button id="payGCash" class="w-full bg-[#0055ff] text-white font-black py-6 rounded-2xl hover:bg-[#0044cc] transition-all active:scale-95 shadow-2xl shadow-blue-500/20 flex items-center justify-center gap-3">
              Proceed to GCash Checkout
            </button>
            <button id="backToAddons" class="w-full text-xs font-black text-slate-400 uppercase tracking-[0.2em] hover:text-slate-900 transition-colors text-center">Back to Add-ons</button>
          </div>
        </div>
      `;

    case 'receipt':
      const qrData = state.currentBooking.transactionId;
      const booking = state.bookings.find(b => b.id === state.currentBooking.transactionId);

      return `
        <div class="space-y-8 max-h-[80vh] overflow-y-auto pr-2">
          <div class="text-center">
             <div class="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-emerald-500/20">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
             </div>
             <h3 class="text-3xl font-black text-slate-900 tracking-tighter italic">Digital Pass Ready</h3>
             <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Show this to the guard upon arrival</p>
          </div>

          <div id="receiptToDownload" class="bg-white border-2 border-slate-900 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 space-y-6 md:space-y-8 relative overflow-hidden text-center shadow-2xl">
             <!-- Ticket Notches -->
             <div class="absolute -left-4 md:-left-5 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-slate-100 rounded-full border-r-2 border-slate-900"></div>
             <div class="absolute -right-4 md:-right-5 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-slate-100 rounded-full border-l-2 border-slate-900"></div>

             <div class="space-y-2">
                <p class="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">OFFICIAL QR PASS</p>
                <div class="bg-white p-2 md:p-4 rounded-2xl md:rounded-3xl inline-block border-2 border-slate-100">
                   <canvas id="qrCanvas"></canvas>
                </div>
                <p class="text-[10px] md:text-xs font-black text-slate-900 mt-4 tracking-widest break-all">${qrData}</p>
             </div>

             <div class="grid grid-cols-2 gap-4 pt-4 border-t-2 border-dashed border-slate-100">
                <div class="text-left">
                   <p class="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-tighter">Cottage No.</p>
                   <p class="text-lg md:text-xl font-black text-slate-900">#${state.currentBooking.cottageId}</p>
                </div>
                <div class="text-right">
                   <p class="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-tighter">Reservation Date</p>
                   <p class="text-lg md:text-xl font-black text-slate-900">${state.currentBooking.date}</p>
                </div>
             </div>

             <div class="pt-2 md:pt-4">
                <div class="bg-slate-900 text-white rounded-xl md:rounded-2xl py-2 md:py-3 px-4 md:px-6 inline-block">
                   <p class="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Status: ${state.currentBooking.status || 'Verified'}</p>
                </div>
             </div>
          </div>

          <div class="space-y-4">
            <button id="downloadPass" class="w-full bg-emerald-500 text-white font-black py-6 rounded-2xl hover:bg-emerald-600 transition-all active:scale-95 shadow-2xl shadow-emerald-500/20 flex items-center justify-center gap-3">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              Download Pass (PNG)
            </button>
            <button id="finishBooking" class="w-full bg-slate-900 text-white font-black py-6 rounded-2xl hover:bg-black transition-all active:scale-95 shadow-2xl shadow-slate-900/20">Return to Home</button>
          </div>
        </div>
      `;

    default:
      return '';
  }
}

export function attachCustomerListeners(renderFn) {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.onclick = () => {
    state.user = null;
    state.token = null;
    state.bookings = [];
    state.cottages = [];
    state.users = [];
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('login', renderFn);
  };

  const navEarly = document.getElementById('navEarly');
  if (navEarly) navEarly.onclick = () => {
    if (state.customerSubView === 'early' || state.customerSubView === 'history') {
      state.customerSubView = 'home';
      state.selectedDate = null;
    } else {
      state.customerSubView = 'early';
      state.selectedDate = null;
    }
    renderFn();
  };

  const viewHistory = document.getElementById('viewHistory');
  if (viewHistory) viewHistory.onclick = () => {
    state.customerSubView = 'history';
    renderFn();
  };

  const backBtn = document.getElementById('backToHome');
  if (backBtn) backBtn.onclick = () => {
    state.customerSubView = 'home';
    state.selectedDate = null;
    renderFn();
  };

  const datePicker = document.getElementById('earlyDatePicker');
  if (datePicker) {
    flatpickr(datePicker, {
      minDate: "today",
      dateFormat: "Y-m-d",
      onChange: (selectedDates, dateStr) => {
        state.selectedDate = dateStr;
        renderFn();
      }
    });
  }

  // Cottage selection
  const cottageCards = document.querySelectorAll('.cottage-card[data-id]');
  cottageCards.forEach(card => {
    card.onclick = () => {
      state.currentBooking = {
        cottageId: Number(card.dataset.id),
        date: card.dataset.date,
        price: Number(card.dataset.price),
        selectedAddons: [],
        total: 0,
        transactionId: ''
      };
      state.bookingStep = 'addons';
      renderFn();
    };
  });

  // Modal actions
  const closeBtn = document.getElementById('closeModal');
  if (closeBtn) closeBtn.onclick = () => {
    state.bookingStep = 'idle';
    renderFn();
  };

  // Addon toggles
  const addonToggles = document.querySelectorAll('.addon-toggle');
  addonToggles.forEach(toggle => {
    toggle.onclick = () => {
      const id = Number(toggle.dataset.id); // Convert to Number
      if (state.currentBooking.selectedAddons.includes(id)) {
        state.currentBooking.selectedAddons = state.currentBooking.selectedAddons.filter(a => a !== id);
      } else {
        state.currentBooking.selectedAddons.push(id);
      }
      renderFn();
    };
  });

  const goToPayment = document.getElementById('goToPayment');
  if (goToPayment) goToPayment.onclick = () => {
    state.bookingStep = 'payment';
    renderFn();
  };

  const backToAddons = document.getElementById('backToAddons');
  if (backToAddons) backToAddons.onclick = () => {
    state.bookingStep = 'addons';
    renderFn();
  };

  const payGCash = document.getElementById('payGCash');
  if (payGCash) payGCash.onclick = async () => {
    try {
      // 1. Create booking in DB first
      const bookingRes = await bookings.create({
        cottageId: state.currentBooking.cottageId,
        date: state.currentBooking.date,
        addons: state.currentBooking.selectedAddons,
        total: state.currentBooking.total,
        paymentMethod: 'GCash'
      });

      // Save transaction ID to state
      state.currentBooking.transactionId = bookingRes.data.id;

      // 2. Create PayMongo checkout session
      const checkoutRes = await payments.createCheckout({
        amount: state.currentBooking.total,
        description: `Cottage #${state.currentBooking.cottageId} Reservation`,
        bookingId: bookingRes.data.id,
        origin: window.location.origin
      });

      if (checkoutRes.data.checkout_url) {
        window.location.href = checkoutRes.data.checkout_url;
      } else {
        alert("Payment gateway error");
      }
    } catch (error) {
      console.error("Booking Error:", error);
      alert("Failed to create booking.");
    }
  };

  const viewReceiptBtns = document.querySelectorAll('.view-receipt-btn, #viewLatestReceipt');
  viewReceiptBtns.forEach(btn => {
    btn.onclick = () => {
      let bookingId = btn.dataset.id;
      let targetBooking;
      
      if (bookingId) {
        targetBooking = state.bookings.find(b => b.id === bookingId);
      } else {
        // Fallback for viewLatestReceipt button
        targetBooking = state.bookings.find(b => b.userId === (state.user?.id));
      }

      if (targetBooking) {
        state.currentBooking = {
          cottageId: targetBooking.cottageId,
          date: targetBooking.date,
          price: targetBooking.total, // Using total as price here
          selectedAddons: targetBooking.addons || [],
          total: targetBooking.total,
          transactionId: targetBooking.id,
          status: targetBooking.status
        };
        state.bookingStep = 'receipt';
        renderFn();
      }
    };
  });

  const finishBooking = document.getElementById('finishBooking');
  if (finishBooking) finishBooking.onclick = () => {
    state.bookingStep = 'idle';
    renderFn();
  };

  const downloadBtn = document.getElementById('downloadPass');
  if (downloadBtn) {
    // Generate QR code if we are in receipt step
    if (state.bookingStep === 'receipt') {
      const qrCanvas = document.getElementById('qrCanvas');
      if (qrCanvas && typeof QRious !== 'undefined') {
        new QRious({
          element: qrCanvas,
          value: state.currentBooking.transactionId,
          size: 160,
          level: 'H'
        });
      }
    }

    downloadBtn.onclick = async () => {
      // Safety check for libraries
      if (typeof html2canvas === 'undefined') {
        alert("System still loading components... Please wait 3 seconds and try again.");
        return;
      }

      const receipt = document.getElementById('receiptToDownload');
      if (!receipt) return;
      
      const btn = downloadBtn;
      btn.disabled = true;
      btn.innerHTML = "Generating Image...";

      try {
        // Prepare for capture
        const originalTransform = receipt.style.transform;
        receipt.style.transform = 'none';

        const canvas = await html2canvas(receipt, {
          backgroundColor: '#ffffff',
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          imageTimeout: 0
        });
        
        const link = document.createElement('a');
        link.download = `Booking_Pass_${state.currentBooking.transactionId}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        btn.innerHTML = "Download Pass (PNG)";
      } catch (err) {
        console.error("Download Error:", err);
        alert("Failed to download. Please take a screenshot for now.");
        btn.innerHTML = "Download Pass (PNG)";
      } finally {
        btn.disabled = false;
        const receipt = document.getElementById('receiptToDownload');
        if (receipt) receipt.style.transform = '';
      }
    };
  }
}
