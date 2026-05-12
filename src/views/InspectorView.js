import { state, navigate } from '../state.js';
import { renderHeader, attachHeaderListeners } from '../components/Header.js';

export function renderInspector() {
  return `
    <div class="max-w-4xl mx-auto px-4 py-8">
      ${renderHeader("Access Scan", "Digital pass verification system")}

      <div class="max-w-xl mx-auto space-y-8 animate-fade-in">
        <!-- Scanner Interface -->
        <div id="scannerContainer" class="relative group">
           <div class="absolute -inset-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-[3rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
           <div class="relative glass p-3 rounded-[3rem] overflow-hidden aspect-square shadow-2xl bg-black">
              <video id="scanVideo" class="w-full h-full object-cover rounded-[2.5rem] opacity-80"></video>
              
              <!-- Scanning HUD -->
              <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div class="w-64 h-64 border-2 border-white/20 rounded-[2rem] relative">
                    <div class="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-teal-400 rounded-tl-xl"></div>
                    <div class="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-teal-400 rounded-tr-xl"></div>
                    <div class="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-teal-400 rounded-bl-xl"></div>
                    <div class="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-teal-400 rounded-br-xl"></div>
                    
                    <!-- Scan Line Animation -->
                    <div class="absolute left-0 right-0 h-1 bg-teal-400/50 shadow-[0_0_15px_rgba(45,212,191,0.5)] animate-scan-line"></div>
                 </div>
              </div>
              
              <div class="absolute bottom-10 left-0 right-0 text-center">
                 <span class="bg-black/60 backdrop-blur-md px-6 py-2 rounded-full text-white text-xs font-black uppercase tracking-[0.2em] border border-white/10">Align QR Code</span>
              </div>
           </div>
           <canvas id="scanCanvas" class="hidden"></canvas>
        </div>
        
        <!-- Result Display -->
        <div id="scanResult" class="glass p-10 rounded-[3rem] text-center hidden border border-white/40 shadow-3xl animate-scale-up">
           <div id="statusIcon" class="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl transform scale-110">
              <!-- Icon will be injected -->
           </div>
           <h3 id="statusTitle" class="text-3xl font-black text-slate-900 mb-2">Status</h3>
           <p class="text-slate-400 font-mono text-sm mb-8 tracking-widest" id="resultId"></p>
           
           <div id="resultDetails" class="bg-slate-50/80 p-6 rounded-[2rem] text-left space-y-4 mb-8 hidden border border-slate-100">
              <div class="flex justify-between items-center pb-3 border-b border-slate-200">
                <span class="text-xs font-black text-slate-400 uppercase tracking-widest">Customer</span>
                <span class="font-bold text-slate-900" id="resName">Unknown</span>
              </div>
              <div class="flex justify-between items-center pb-3 border-b border-slate-200">
                <span class="text-xs font-black text-slate-400 uppercase tracking-widest">Reserved Unit</span>
                <span class="px-3 py-1 rounded-lg bg-blue-100 text-blue-600 font-black text-xs" id="resCottage">#0</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-xs font-black text-slate-400 uppercase tracking-widest">Validity</span>
                <span class="font-black text-emerald-500" id="resDate">Today</span>
              </div>
           </div>
           
           <button id="resetScan" class="w-full bg-slate-900 hover:bg-black text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-slate-900/20">Resume Scanner</button>
        </div>

        <div class="flex justify-center gap-8 text-slate-400">
           <div class="flex flex-col items-center gap-2">
             <div class="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center">
               <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
             </div>
             <span class="text-[10px] font-black uppercase tracking-widest">Encrypted</span>
           </div>
           <div class="flex flex-col items-center gap-2">
             <div class="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center text-teal-500">
               <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
             </div>
             <span class="text-[10px] font-black uppercase tracking-widest">Real-time</span>
           </div>
        </div>
      </div>
    </div>
  `;
}

export function attachInspectorListeners(renderFn) {
  attachHeaderListeners(renderFn);

  const video = document.getElementById('scanVideo');
  const canvas = document.getElementById('scanCanvas');
  const context = canvas.getContext('2d');
  let scanning = true;

  navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(stream => {
    video.srcObject = stream;
    video.setAttribute("playsinline", true);
    video.play();
    requestAnimationFrame(tick);
  }).catch(err => {
    console.error("Camera access denied:", err);
  });

  function tick() {
    if (!scanning) return;
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = typeof jsQR !== 'undefined' ? jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      }) : null;
      if (code) {
        handleScan(code.data);
      }
    }
    requestAnimationFrame(tick);
  }

  function handleScan(data) {
    scanning = false;
    const resultDiv = document.getElementById('scanResult');
    const scannerDiv = document.getElementById('scannerContainer');
    const statusIcon = document.getElementById('statusIcon');
    const details = document.getElementById('resultDetails');
    
    resultDiv.classList.remove('hidden');
    scannerDiv.classList.add('hidden');
    document.getElementById('resultId').innerText = data;

    // Check against real data
    const booking = state.bookings.find(b => b.id === data);

    if (booking) {
       const isConfirmed = booking.status === 'Confirmed';
       
       statusIcon.className = `w-24 h-24 ${isConfirmed ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'} rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl transform scale-110`;
       statusIcon.innerHTML = isConfirmed 
         ? `<svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7"></path></svg>`
         : `<svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
       
       document.getElementById('statusTitle').innerText = isConfirmed ? "Access Granted" : "Payment Pending";
       document.getElementById('statusTitle').className = `text-3xl font-black ${isConfirmed ? 'text-emerald-600' : 'text-amber-600'} mb-2`;
       
       document.getElementById('resName').innerText = `User ID: ${booking.userId}`;
       document.getElementById('resCottage').innerText = `#${booking.cottageId}`;
       document.getElementById('resDate').innerText = booking.date;
       details.classList.remove('hidden');
    } else {
       statusIcon.className = "w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl transform scale-110";
       statusIcon.innerHTML = `<svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M6 18L18 6M6 6l12 12"></path></svg>`;
       document.getElementById('statusTitle').innerText = "Access Denied";
       details.classList.add('hidden');
    }
  }

  document.getElementById('resetScan').onclick = () => {
    scanning = true;
    document.getElementById('scanResult').classList.add('hidden');
    document.getElementById('scannerContainer').classList.remove('hidden');
    requestAnimationFrame(tick);
  };
}
