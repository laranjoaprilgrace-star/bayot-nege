import { state, navigate } from '../state.js';

export function renderHeader(title, subtitle) {
  return `
    <header class="flex justify-between items-center mb-12 animate-fade-in">
      <div class="flex items-center gap-4">
        ${state.user?.role === 'customer' ? `
          <div class="w-14 h-14 rounded-2xl overflow-hidden shadow-lg border-2 border-white">
            <img src="${state.user.avatar}" class="w-full h-full object-cover">
          </div>
        ` : `
          <div class="w-14 h-14 bg-gradient-to-tr from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white">
             <span class="text-white text-xl font-black italic">C</span>
          </div>
        `}
        <div>
          <h2 class="text-3xl font-black text-slate-900 tracking-tight">${title}</h2>
          <p class="text-slate-500 font-medium">${subtitle}</p>
        </div>
      </div>
      <div class="flex items-center gap-6">
        ${state.user?.role !== 'customer' ? `
          <div class="hidden sm:flex flex-col text-right">
             <span class="text-sm font-black text-slate-900">${state.user?.name || 'Admin'}</span>
             <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">${state.user?.role || 'Staff'}</span>
          </div>
        ` : ''}
        <button id="logoutBtn" class="p-3 rounded-2xl bg-white shadow-lg text-slate-400 hover:text-red-500 transition-all border border-slate-100 group">
          <svg class="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
        </button>
      </div>
    </header>
  `;
}

export function attachHeaderListeners(renderFn) {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.onclick = () => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('login', renderFn);
    };
  }
}
