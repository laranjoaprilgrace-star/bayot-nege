import { state, navigate } from '../state.js';
import { bookings, admin, cottages, addons } from '../api.js';

export function renderAdmin() {
  const activeTab = state.adminTab || 'home';

  const navBtn = (tab, icon, label) => `
    <button data-tab="${tab}" class="admin-tab-btn w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' : 'text-slate-400 hover:bg-slate-50'}">
      ${icon} ${label}
    </button>`;

  const homeIcon  = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>`;
  const usersIcon = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>`;
  const prodIcon  = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>`;
  const sysIcon   = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>`;

  return `
    <!-- Mobile Header -->
    <div class="md:hidden fixed top-0 left-0 right-0 z-[250] flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100 shadow-sm">
      <h1 class="text-xl font-black text-slate-900 tracking-tighter italic">Resort.<span class="text-rose-500">Admin</span></h1>
      <button id="mobileMenuBtn" class="p-2 rounded-xl hover:bg-slate-50 transition-colors">
        <svg class="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 12h16M4 18h16"></path></svg>
      </button>
    </div>

    <!-- Mobile Overlay Backdrop -->
    <div id="mobileMenuOverlay" class="md:hidden fixed inset-0 bg-slate-900/50 z-[300] hidden backdrop-blur-sm"></div>

    <div class="min-h-screen bg-slate-50 flex pt-14 md:pt-0">
      <!-- Sidebar -->
      <aside id="adminSidebar" class="fixed md:relative top-0 left-0 h-full z-[350] w-72 md:w-80 bg-white border-r border-slate-100 flex flex-col p-8 transition-transform duration-300 transform -translate-x-full md:translate-x-0 shadow-2xl md:shadow-none">
        <div class="mb-8 flex items-center justify-between">
          <h1 class="text-2xl font-black text-slate-900 tracking-tighter italic">Resort.<span class="text-rose-500">Admin</span></h1>
          <button id="closeSidebar" class="md:hidden p-2 hover:bg-slate-50 rounded-xl transition-colors">
            <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <nav class="flex-1 space-y-2">
          ${navBtn('home',  homeIcon,  'Dashboard')}
          ${navBtn('users', usersIcon, 'Manage Users')}
          ${navBtn('products', prodIcon, 'Products')}
          ${navBtn('system', sysIcon, 'System Data')}
        </nav>

        <div class="mt-auto">
          <button id="logoutBtn" class="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Sign Out
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-6 md:p-12 overflow-y-auto">
        ${renderActiveTab(activeTab)}
      </main>
    </div>
  `;
}

function renderActiveTab(tab) {
  switch (tab) {
    case 'users': return renderUsersView();
    case 'products': return renderProductsView();
    case 'system': return renderSystemView();
    default: return renderHomeView();
  }
}

function renderHomeView() {
  return `
    <div class="max-w-6xl mx-auto space-y-16 animate-fade-in">
      <header class="space-y-4">
        <h2 class="text-7xl font-black text-slate-900 tracking-tighter italic">Overview.</h2>
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] ml-1">Platform performance and activity</p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div class="bg-white p-12 rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-50 transition-all hover:shadow-2xl group">
          <div class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-slate-900 group-hover:text-white transition-all">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Revenue</p>
          <h3 class="text-4xl font-black text-slate-900 tracking-tighter italic">₱0.00</h3>
        </div>

        <div class="bg-white p-12 rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-50 transition-all hover:shadow-2xl group">
          <div class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-slate-900 group-hover:text-white transition-all">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          </div>
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Bookings</p>
          <h3 class="text-4xl font-black text-slate-900 tracking-tighter italic">${state.bookings?.length || 0}</h3>
        </div>

        <div class="bg-white p-12 rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-2 border-rose-50 transition-all hover:shadow-2xl group relative overflow-hidden">
          <div class="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-bl-[4rem]"></div>
          <div class="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-rose-500 group-hover:text-white transition-all">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <p class="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-2">Approvals</p>
          <h3 class="text-4xl font-black text-rose-500 tracking-tighter italic">${state.users.filter(u => u.status === 'pending').length}</h3>
        </div>
      </div>
    </div>
  `;
}

function renderUsersView() {
  const activeSubTab = state.adminUserTab || 'customers';
  const sortedUsers = [...state.users].sort((a, b) => b.id - a.id);
  
  const customers = sortedUsers.filter(u => u.role === 'customer' && u.status === 'approved');
  const staff = sortedUsers.filter(u => u.role === 'inspector');
  const pending = sortedUsers.filter(u => u.role === 'customer' && u.status === 'pending');
  const rejected = sortedUsers.filter(u => u.role === 'customer' && u.status === 'rejected');
  
  let displayUsers = [];
  if (activeSubTab === 'customers') displayUsers = customers;
  else if (activeSubTab === 'staff') displayUsers = staff;
  else if (activeSubTab === 'pending') displayUsers = pending;
  else if (activeSubTab === 'rejected') displayUsers = rejected;

  return `
    <div class="space-y-10 animate-fade-in">
      <header class="flex justify-between items-end">
        <div>
          <h2 class="text-5xl font-black text-slate-900 tracking-tighter italic">Manage Users.</h2>
          <p class="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mt-2">Database of all platform members</p>
        </div>
        ${activeSubTab === 'staff' ? `
          <button id="openAddStaff" class="bg-slate-900 text-white font-black px-8 py-5 rounded-3xl text-xs uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:scale-105 transition-all">+ Add New Staff</button>
        ` : ''}
      </header>

      <div class="flex flex-wrap gap-4 p-2 bg-white rounded-3xl w-fit shadow-sm border border-slate-100">
        <button data-subtab="customers" class="admin-subtab-btn px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'customers' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}">Customers (${customers.length})</button>
        <button data-subtab="pending" class="admin-subtab-btn px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'pending' ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}">Pending (${pending.length})</button>
        <button data-subtab="rejected" class="admin-subtab-btn px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'rejected' ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}">Rejected (${rejected.length})</button>
        <button data-subtab="staff" class="admin-subtab-btn px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'staff' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}">Staff (${staff.length})</button>
      </div>

      <div class="bg-white rounded-[2rem] md:rounded-[3.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-slate-50 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-slate-50/50 border-b border-slate-100">
                <th class="px-6 md:px-10 py-6 md:py-8 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Member Info</th>
                <th class="px-6 md:px-10 py-6 md:py-8 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Account Status</th>
                <th class="px-6 md:px-10 py-6 md:py-8 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              ${displayUsers.length === 0 ? `
                <tr>
                  <td colspan="3" class="px-6 md:px-10 py-12 md:py-20 text-center text-slate-300 font-black uppercase tracking-widest text-xs italic">No members found</td>
                </tr>
              ` : displayUsers.map(u => `
                <tr class="hover:bg-slate-50/50 transition-colors">
                  <td class="px-6 md:px-10 py-4 md:py-6">
                    <div class="flex items-center gap-3 md:gap-4">
                      <img src="${u.avatar || `https://i.pravatar.cc/150?u=${u.email}`}" class="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl border border-slate-100 shadow-sm">
                      <div>
                        <p class="font-black text-slate-900 text-sm">${u.name}</p>
                        <p class="text-[10px] font-bold text-slate-400">${u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 md:px-10 py-4 md:py-6">
                    <span class="px-3 md:px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${u.status === 'pending' ? 'bg-amber-100 text-amber-600' : (u.status === 'rejected' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600')}">
                      ${u.status}
                    </span>
                  </td>
                  <td class="px-6 md:px-10 py-4 md:py-6 text-right">
                    ${activeSubTab === 'pending' || activeSubTab === 'rejected' ? `
                      <button class="review-user-btn text-[10px] font-black text-slate-900 border-2 border-slate-100 px-4 md:px-6 py-2 rounded-xl hover:bg-slate-900 hover:text-white transition-all" data-id="${u.id}">Review</button>
                    ` : `
                      <div class="flex flex-col items-end">
                        <p class="text-[10px] font-black text-slate-900 uppercase tracking-widest">${u.phone || 'NO PHONE'}</p>
                      </div>
                    `}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <div id="addStaffModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] hidden flex items-center justify-center p-4 md:p-6">
      <div class="bg-white w-full max-w-lg rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 shadow-3xl animate-scale-up">
        <h3 class="text-3xl font-black text-slate-900 mb-8 tracking-tighter italic">New Staff Member.</h3>
        <form id="addStaffForm" class="space-y-4">
          <input type="text" id="staffName" class="input-field" placeholder="Full Name" required>
          <input type="email" id="staffEmail" class="input-field" placeholder="Gmail Address" required>
          <input type="tel" id="staffPhone" class="input-field" placeholder="Phone Number" required>
          <input type="password" id="staffPass" class="input-field" placeholder="Assign Password" required>
          <div class="flex gap-4 pt-4">
            <button type="button" id="closeStaffModal" class="flex-1 py-4 bg-slate-50 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest">Cancel</button>
            <button type="submit" class="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">Create Staff</button>
          </div>
        </form>
      </div>
    </div>

    <div id="reviewUserModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] hidden flex items-center justify-center p-4 md:p-6">
      <div class="bg-white w-full max-w-2xl rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 shadow-3xl animate-scale-up max-h-[90vh] overflow-y-auto">
        <div id="reviewContent"></div>
      </div>
    </div>

    <!-- ID Zoom Modal -->
    <div id="imageZoomModal" class="fixed inset-0 bg-black/95 z-[300] hidden flex flex-col items-center justify-center p-10 backdrop-blur-xl">
       <button id="closeZoom" class="absolute top-10 right-10 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all">
          <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
       </button>
       <div class="w-full h-full flex items-center justify-center">
          <img id="zoomedImage" class="max-w-full max-h-full object-contain rounded-2xl shadow-2xl">
       </div>
       <p class="mt-8 text-white/40 font-black uppercase tracking-[0.5em] text-[10px]">Original Resolution ID View</p>
    </div>
  `;
}

function renderProductsView() {
  const sortedCottages = [...state.cottages].sort((a, b) => a.id - b.id);

  return `
    <div class="max-w-6xl mx-auto space-y-16 animate-fade-in">
      
      <!-- Cottages Section -->
      <section class="space-y-10">
        <header class="flex justify-between items-end">
          <div>
            <h2 class="text-6xl font-black text-slate-900 tracking-tighter italic">Inventory.</h2>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] ml-1">Asset management and status</p>
          </div>
          <button id="openAddCottage" class="bg-slate-900 text-white font-black px-10 py-6 rounded-[2rem] text-[10px] uppercase tracking-widest shadow-2xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all">+ Add Cottage</button>
        </header>

        <div class="bg-white rounded-[2rem] md:rounded-[3.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-slate-50 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="bg-slate-50/50 border-b border-slate-100">
                  <th class="px-6 md:px-12 py-6 md:py-8 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Cottage Info</th>
                  <th class="px-6 md:px-12 py-6 md:py-8 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                  <th class="px-6 md:px-12 py-6 md:py-8 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
            <tbody class="divide-y divide-slate-50">
              ${sortedCottages.length === 0 ? `
                <tr><td colspan="3" class="p-24 text-center text-slate-300 font-black uppercase tracking-[0.3em] text-xs italic">Inventory is empty</td></tr>
              ` : sortedCottages.map(c => `
                <tr class="hover:bg-slate-50/30 transition-colors group">
                  <td class="px-12 py-8">
                    <div class="flex items-center gap-6">
                      <div class="w-14 h-14 bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-white shadow-lg">
                        <span class="text-[9px] font-black uppercase opacity-40">#</span>
                        <span class="text-xl font-black">${c.id}</span>
                      </div>
                      <div>
                        <p class="font-black text-slate-900 text-base tracking-tight">${c.category}</p>
                        <p class="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1">₱${c.price.toLocaleString()}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-12 py-8">
                    <span class="px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${c.active ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600 shadow-sm'}">
                      ${c.active ? 'Operational' : 'On Maintenance'}
                    </span>
                  </td>
                  <td class="px-12 py-8 text-right">
                    <div class="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button class="update-price-btn p-3 bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white rounded-xl transition-all" data-id="${c.id}" data-price="${c.price}" title="Update Price">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      </button>
                      <button class="toggle-maintenance-btn p-3 bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white rounded-xl transition-all" data-id="${c.id}" data-active="${c.active}" title="Toggle Maintenance">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      </button>
                      <button class="delete-cottage-btn p-3 bg-slate-50 text-slate-400 hover:bg-rose-500 hover:text-white rounded-xl transition-all" data-id="${c.id}" title="Delete">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>

      <!-- Add-ons Section -->
      <section class="space-y-10 pt-16 border-t-2 border-slate-50">
        <header class="flex justify-between items-end">
          <div>
            <h2 class="text-5xl font-black text-slate-900 tracking-tighter italic">Add-ons.</h2>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] ml-1">Additional resort services</p>
          </div>
          <button id="openAddAddon" class="bg-slate-900 text-white font-black px-10 py-6 rounded-[2rem] text-[10px] uppercase tracking-widest shadow-2xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all">+ Add Service</button>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          ${state.addons.length === 0 ? `
            <div class="col-span-2 p-20 bg-white rounded-[3.5rem] border border-dashed border-slate-200 text-center text-slate-300 font-black uppercase tracking-widest text-xs">No services defined</div>
          ` : state.addons.map(a => `
            <div class="bg-white p-10 rounded-[3rem] shadow-[0_15px_40px_rgba(0,0,0,0.02)] border border-slate-50 flex items-center justify-between group hover:shadow-xl transition-all">
              <div class="flex items-center gap-6">
                <div class="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                  <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                </div>
                <div>
                  <h4 class="font-black text-slate-900 text-lg tracking-tight">${a.name}</h4>
                  <p class="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">₱${a.price.toLocaleString()}</p>
                </div>
              </div>
              <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button class="update-addon-price-btn p-3 bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white rounded-xl transition-all" data-id="${a.id}" data-name="${a.name}" data-price="${a.price}">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </button>
                <button class="delete-addon-btn p-3 bg-slate-50 text-slate-400 hover:bg-rose-500 hover:text-white rounded-xl transition-all" data-id="${a.id}">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

    </div>

    <!-- Modals (Add Cottage) -->
    <div id="addCottageModal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[110] hidden flex items-center justify-center p-6">
      <div class="bg-white w-full max-w-lg rounded-[3.5rem] p-12 shadow-3xl animate-scale-up border-2 border-white">
        <h3 class="text-4xl font-black text-slate-900 mb-10 tracking-tighter italic">New Asset.</h3>
        <form id="addCottageForm" class="space-y-6">
          <div class="space-y-2">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Type</label>
            <select id="cottageCategory" class="input-field py-5 text-sm" required>
              <option value="Premium Seafront">Premium Seafront</option>
              <option value="Deluxe Garden">Deluxe Garden</option>
              <option value="Standard Cozy">Standard Cozy</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Rate / Day (₱)</label>
            <input type="number" id="cottagePrice" class="input-field py-5 text-sm" placeholder="2500" required>
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Amenities</label>
            <input type="text" id="cottageAmenities" class="input-field py-5 text-sm" placeholder="e.g. Wi-Fi, AC">
          </div>
          <div class="flex gap-4 pt-6">
            <button type="button" id="closeCottageModal" class="flex-1 py-5 bg-slate-50 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100">Cancel</button>
            <button type="submit" class="flex-1 py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/20">Add Cottage</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modals (Add Addon) -->
    <div id="addAddonModal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[110] hidden flex items-center justify-center p-6">
      <div class="bg-white w-full max-w-lg rounded-[3.5rem] p-12 shadow-3xl animate-scale-up border-2 border-white">
        <h3 class="text-4xl font-black text-slate-900 mb-10 tracking-tighter italic">New Service.</h3>
        <form id="addAddonForm" class="space-y-6">
          <div class="space-y-2">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Service Name</label>
            <input type="text" id="addonName" class="input-field py-5 text-sm" placeholder="e.g. Extra Bed" required>
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Price (₱)</label>
            <input type="number" id="addonPrice" class="input-field py-5 text-sm" placeholder="500" required>
          </div>
          <div class="flex gap-4 pt-6">
            <button type="button" id="closeAddonModal" class="flex-1 py-4 bg-slate-50 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest">Cancel</button>
            <button type="submit" class="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">Add Service</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function renderSystemView() {
  const bks = state.bookings || [];
  const confirmed = bks.filter(b => b.status === 'Confirmed');
  const pending   = bks.filter(b => b.status === 'Pending');
  const cancelled = bks.filter(b => b.status === 'Cancelled');
  const totalRevenue = confirmed.reduce((s, b) => s + (b.total || 0), 0);
  const avgValue = confirmed.length ? Math.round(totalRevenue / confirmed.length) : 0;

  return `
    <div class="space-y-10 animate-fade-in">
      <!-- Header -->
      <header class="flex justify-between items-end">
        <div>
          <h2 class="text-5xl font-black text-slate-900 tracking-tighter italic">Analytics.</h2>
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2">Booking insights & performance data</p>
        </div>
        <button id="refreshData" class="p-4 bg-white rounded-full border border-slate-100 shadow-sm hover:rotate-180 transition-all duration-500">
          <svg class="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
        </button>
      </header>

      <!-- KPI Row -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-900/20">
          <p class="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 mb-3">Total Revenue</p>
          <h3 class="text-3xl font-black tracking-tighter">₱${totalRevenue.toLocaleString()}</h3>
          <p class="text-[10px] mt-2 opacity-40 font-bold">${confirmed.length} confirmed bookings</p>
        </div>
        <div class="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm">
          <p class="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Total Bookings</p>
          <h3 class="text-3xl font-black tracking-tighter text-slate-900">${bks.length}</h3>
          <p class="text-[10px] mt-2 text-slate-300 font-bold">${pending.length} still pending</p>
        </div>
        <div class="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm">
          <p class="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Avg. Booking Value</p>
          <h3 class="text-3xl font-black tracking-tighter text-slate-900">₱${avgValue.toLocaleString()}</h3>
          <p class="text-[10px] mt-2 text-slate-300 font-bold">confirmed only</p>
        </div>
        <div class="bg-white border-2 border-rose-50 p-8 rounded-[2.5rem] shadow-sm">
          <p class="text-[9px] font-black uppercase tracking-[0.3em] text-rose-400 mb-3">Cancelled</p>
          <h3 class="text-3xl font-black tracking-tighter text-rose-500">${cancelled.length}</h3>
          <p class="text-[10px] mt-2 text-rose-200 font-bold">out of ${bks.length} total</p>
        </div>
      </div>

      <!-- Charts Row 1: Monthly Bookings + Status Doughnut -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 bg-white rounded-[3rem] shadow-sm border border-slate-100 p-10">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Monthly Overview</p>
          <h3 class="text-2xl font-black text-slate-900 tracking-tight mb-8">Bookings per Month</h3>
          <div class="relative h-56">
            <canvas id="chartMonthly"></canvas>
          </div>
        </div>
        <div class="bg-white rounded-[3rem] shadow-sm border border-slate-100 p-10">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Breakdown</p>
          <h3 class="text-2xl font-black text-slate-900 tracking-tight mb-8">Booking Status</h3>
          <div class="relative h-56 flex items-center justify-center">
            <canvas id="chartStatus"></canvas>
          </div>
        </div>
      </div>

      <!-- Charts Row 2: Most Booked Cottage + Revenue Trend -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="bg-white rounded-[3rem] shadow-sm border border-slate-100 p-10">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Popularity</p>
          <h3 class="text-2xl font-black text-slate-900 tracking-tight mb-8">Most Booked Cottage Types</h3>
          <div class="relative h-52">
            <canvas id="chartCottages"></canvas>
          </div>
        </div>
        <div class="bg-white rounded-[3rem] shadow-sm border border-slate-100 p-10">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Earnings</p>
          <h3 class="text-2xl font-black text-slate-900 tracking-tight mb-8">Revenue by Month (₱)</h3>
          <div class="relative h-52">
            <canvas id="chartRevenue"></canvas>
          </div>
        </div>
      </div>

      <!-- Charts Row 3: Top Add-ons -->
      <div class="bg-white rounded-[3rem] shadow-sm border border-slate-100 p-10">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Services</p>
        <h3 class="text-2xl font-black text-slate-900 tracking-tight mb-8">Top Add-ons Used</h3>
        <div class="relative h-44">
          <canvas id="chartAddons"></canvas>
        </div>
      </div>

      <!-- System Documentation -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-xl transition-all">
          <div class="flex items-center gap-6">
            <div class="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2a2 2 0 00-2-2H5a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v8m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            </div>
            <div>
              <h4 class="font-black text-slate-900 text-lg tracking-tight">Data Flow Diagram</h4>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">DFD.pdf | System Logic</p>
            </div>
          </div>
          <a href="/docs/DFD.pdf" download class="p-4 bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white rounded-2xl transition-all shadow-sm">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          </a>
        </div>

        <div class="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-xl transition-all">
          <div class="flex items-center gap-6">
            <div class="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
              <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3zm0 0h16M12 4v16m-4-8h8"></path></svg>
            </div>
            <div>
              <h4 class="font-black text-slate-900 text-lg tracking-tight">Entity Relationship</h4>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ERD.pdf | DB Schema</p>
            </div>
          </div>
          <a href="/docs/ERD.pdf" download class="p-4 bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white rounded-2xl transition-all shadow-sm">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          </a>
        </div>
      </div>

      <!-- Bookings Log Table -->
      <div class="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
        <div class="px-10 py-8 border-b border-slate-50">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Live Feed</p>
          <h3 class="text-xl font-black text-slate-900 tracking-tight">Transaction Log</h3>
        </div>
        <table class="w-full text-left">
          <thead>
            <tr class="bg-slate-50/60 border-b border-slate-100">
              <th class="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Booking ID</th>
              <th class="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Cottage</th>
              <th class="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Date</th>
              <th class="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Payment</th>
              <th class="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th class="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Total</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            ${bks.length === 0
              ? `<tr><td colspan="6" class="p-16 text-center text-slate-300 font-black uppercase tracking-widest text-xs italic">No transactions yet</td></tr>`
              : [...bks].reverse().map(b => {
                  const cottage = state.cottages?.find(c => c.id == b.cottageId);
                  const statusColor = b.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-600'
                    : b.status === 'Cancelled' ? 'bg-rose-100 text-rose-500'
                    : 'bg-amber-100 text-amber-600';
                  return `
                  <tr class="hover:bg-slate-50/40 transition-colors">
                    <td class="px-10 py-5 font-black text-slate-900 text-[10px] tracking-widest">${b.id}</td>
                    <td class="px-10 py-5 text-xs font-bold text-slate-600">${cottage ? cottage.category : 'Cottage #' + b.cottageId}</td>
                    <td class="px-10 py-5 text-xs font-bold text-slate-400">${b.date || '—'}</td>
                    <td class="px-10 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">${b.paymentMethod || '—'}</td>
                    <td class="px-10 py-5"><span class="px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${statusColor}">${b.status}</span></td>
                    <td class="px-10 py-5 font-black text-slate-900 text-right">₱${(b.total || 0).toLocaleString()}</td>
                  </tr>`;
                }).join('')
            }
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function loadChartJs(cb) {
  if (window.Chart) { cb(); return; }
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js';
  s.onload = cb;
  document.head.appendChild(s);
}

export function attachSystemCharts() {
  loadChartJs(() => {
    const bks = state.bookings || [];

    // ── 1. MONTHLY BOOKINGS ───────────────────────────────────────────
    const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const monthlyCount   = Array(12).fill(0);
    const monthlyRevenue = Array(12).fill(0);
    bks.forEach(b => {
      if (!b.date) return;
      const m = parseInt(b.date.split('-')[1]) - 1;
      if (m >= 0 && m < 12) {
        monthlyCount[m]++;
        if (b.status === 'Confirmed') monthlyRevenue[m] += (b.total || 0);
      }
    });

    const ctxM = document.getElementById('chartMonthly');
    if (ctxM) {
      if (ctxM._chartInstance) ctxM._chartInstance.destroy();
      ctxM._chartInstance = new Chart(ctxM, {
        type: 'bar',
        data: {
          labels: MONTHS,
          datasets: [{
            label: 'Bookings',
            data: monthlyCount,
            backgroundColor: monthlyCount.map((_, i) =>
              `hsla(${220 - i * 5}, 70%, ${55 + i * 1}%, 0.85)`
            ),
            borderRadius: 10,
            borderSkipped: false,
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { font: { weight: '900', size: 10 }, color: '#94a3b8' } },
            y: { grid: { color: '#f1f5f9' }, ticks: { font: { weight: '700', size: 10 }, color: '#94a3b8', stepSize: 1 }, beginAtZero: true }
          }
        }
      });
    }

    // ── 2. STATUS DOUGHNUT ────────────────────────────────────────────
    const confirmed = bks.filter(b => b.status === 'Confirmed').length;
    const pending   = bks.filter(b => b.status === 'Pending').length;
    const cancelled = bks.filter(b => b.status === 'Cancelled').length;
    const ctxS = document.getElementById('chartStatus');
    if (ctxS) {
      if (ctxS._chartInstance) ctxS._chartInstance.destroy();
      ctxS._chartInstance = new Chart(ctxS, {
        type: 'doughnut',
        data: {
          labels: ['Confirmed', 'Pending', 'Cancelled'],
          datasets: [{ data: [confirmed, pending, cancelled],
            backgroundColor: ['#10b981', '#f59e0b', '#f43f5e'],
            borderWidth: 0, hoverOffset: 8 }]
        },
        options: {
          responsive: true, maintainAspectRatio: false, cutout: '70%',
          plugins: { legend: { position: 'bottom', labels: { font: { weight: '900', size: 10 }, color: '#475569', padding: 16, usePointStyle: true } } }
        }
      });
    }

    // ── 3. MOST BOOKED COTTAGE TYPES ─────────────────────────────────
    const categoryMap = {};
    bks.forEach(b => {
      const c = state.cottages?.find(ct => ct.id == b.cottageId);
      const cat = c ? c.category : 'Unknown';
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });
    const catLabels = Object.keys(categoryMap);
    const catData   = Object.values(categoryMap);
    const ctxC = document.getElementById('chartCottages');
    if (ctxC) {
      if (ctxC._chartInstance) ctxC._chartInstance.destroy();
      ctxC._chartInstance = new Chart(ctxC, {
        type: 'bar',
        data: {
          labels: catLabels,
          datasets: [{ label: 'Bookings', data: catData,
            backgroundColor: ['#0f172a','#334155','#64748b'],
            borderRadius: 12, borderSkipped: false }]
        },
        options: {
          indexAxis: 'y',
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: '#f1f5f9' }, ticks: { font: { weight: '700', size: 10 }, color: '#94a3b8', stepSize: 1 }, beginAtZero: true },
            y: { grid: { display: false }, ticks: { font: { weight: '900', size: 11 }, color: '#334155' } }
          }
        }
      });
    }

    // ── 4. REVENUE BY MONTH ───────────────────────────────────────────
    const ctxR = document.getElementById('chartRevenue');
    if (ctxR) {
      if (ctxR._chartInstance) ctxR._chartInstance.destroy();
      const gradient = ctxR.getContext('2d').createLinearGradient(0, 0, 0, 180);
      gradient.addColorStop(0, 'rgba(16,185,129,0.3)');
      gradient.addColorStop(1, 'rgba(16,185,129,0)');
      ctxR._chartInstance = new Chart(ctxR, {
        type: 'line',
        data: {
          labels: MONTHS,
          datasets: [{ label: 'Revenue (₱)', data: monthlyRevenue,
            borderColor: '#10b981', backgroundColor: gradient,
            borderWidth: 3, pointRadius: 5, pointBackgroundColor: '#10b981',
            tension: 0.4, fill: true }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { font: { weight: '900', size: 10 }, color: '#94a3b8' } },
            y: { grid: { color: '#f1f5f9' }, ticks: { font: { weight: '700', size: 10 }, color: '#94a3b8', callback: v => '₱' + v.toLocaleString() }, beginAtZero: true }
          }
        }
      });
    }

    // ── 5. TOP ADD-ONS ────────────────────────────────────────────────
    const addonMap = {};
    bks.forEach(b => {
      const ads = Array.isArray(b.addons) ? b.addons : (b.addons ? b.addons.split(',') : []);
      ads.forEach(a => { a = a.trim(); if (a) addonMap[a] = (addonMap[a] || 0) + 1; });
    });

    // Sort add-ons by usage frequency (descending)
    const sortedAddons = Object.entries(addonMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const addonLabels = sortedAddons.map(a => a.name);
    const addonData   = sortedAddons.map(a => a.count);
    const ctxA = document.getElementById('chartAddons');
    if (ctxA) {
      if (ctxA._chartInstance) ctxA._chartInstance.destroy();
      ctxA._chartInstance = new Chart(ctxA, {
        type: 'bar',
        data: {
          labels: addonLabels.length ? addonLabels : ['No data'],
          datasets: [{ label: 'Times Used', data: addonData.length ? addonData : [0],
            backgroundColor: '#f59e0b', borderRadius: 10, borderSkipped: false }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { font: { weight: '900', size: 11 }, color: '#334155' } },
            y: { grid: { color: '#f1f5f9' }, ticks: { font: { weight: '700', size: 10 }, color: '#94a3b8', stepSize: 1 }, beginAtZero: true }
          }
        }
      });
    }
  });
}

function renderPlaceholder(title) {
  return `<div class="p-20 text-center"><h2 class="text-2xl font-black text-slate-200 uppercase tracking-widest italic">${title} Coming Soon</h2></div>`;
}

export function attachAdminListeners(renderFn) {
  // Sidebar hamburger (mobile)
  const sidebar  = document.getElementById('adminSidebar');
  const overlay  = document.getElementById('mobileMenuOverlay');
  const openBtn  = document.getElementById('mobileMenuBtn');
  const closeBtn = document.getElementById('closeSidebar');
  const openSidebar  = () => { sidebar?.classList.remove('-translate-x-full'); overlay?.classList.remove('hidden'); };
  const closeSidebar = () => { sidebar?.classList.add('-translate-x-full');    overlay?.classList.add('hidden'); };
  if (openBtn)  openBtn.onclick  = openSidebar;
  if (closeBtn) closeBtn.onclick = closeSidebar;
  if (overlay)  overlay.onclick  = closeSidebar;

  // Tab Switching
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.onclick = () => { state.adminTab = btn.dataset.tab; closeSidebar(); renderFn(); if (btn.dataset.tab === 'system') attachSystemCharts(); };
  });

  // Draw charts if already on system tab
  if ((state.adminTab || 'home') === 'system') attachSystemCharts();

  document.querySelectorAll('.admin-subtab-btn').forEach(btn => {
    btn.onclick = () => { state.adminUserTab = btn.dataset.subtab; renderFn(); };
  });

  // Modal Control
  const openAddStaff = document.getElementById('openAddStaff');
  const addStaffModal = document.getElementById('addStaffModal');
  const closeStaffModal = document.getElementById('closeStaffModal');
  if (openAddStaff) openAddStaff.onclick = () => addStaffModal.classList.remove('hidden');
  if (closeStaffModal) closeStaffModal.onclick = () => addStaffModal.classList.add('hidden');

  // Add Staff Submit
  const addStaffForm = document.getElementById('addStaffForm');
  if (addStaffForm) {
    addStaffForm.onsubmit = async (e) => {
      e.preventDefault();
      const userData = {
        name: document.getElementById('staffName').value,
        email: document.getElementById('staffEmail').value,
        phone: document.getElementById('staffPhone').value,
        password: document.getElementById('staffPass').value,
        role: 'inspector',
        status: 'approved'
      };
      try {
        await admin.createStaff(userData);
        const res = await admin.getUsers();
        state.users = res.data;
        addStaffModal.classList.add('hidden');
        renderFn();
        alert("Staff Added Successfully!");
      } catch (err) { alert(err.response?.data?.error || "Error adding staff"); }
    };
  }

  // Review Modal Logic
  const reviewUserBtns = document.querySelectorAll('.review-user-btn');
  const reviewUserModal = document.getElementById('reviewUserModal');
  const reviewContent = document.getElementById('reviewContent');

  reviewUserBtns.forEach(btn => {
    btn.onclick = () => {
      const userId = parseInt(btn.dataset.id);
      const u = state.users.find(user => user.id === userId);
      if (!u) return;

      reviewContent.innerHTML = `
        <div class="space-y-8">
          <div class="flex justify-between items-center border-b border-slate-100 pb-6">
            <div>
              <h4 class="text-3xl font-black text-slate-900 tracking-tight italic">Identity Verification</h4>
              <p class="text-[10px] font-black text-rose-500 uppercase tracking-widest mt-1">Reviewing ID: ${u.id}</p>
            </div>
            <button id="closeReview" class="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-4">
               <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Provided ID / Photo (Click to Full View)</p>
               <div class="aspect-square bg-slate-100 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl cursor-zoom-in group relative" id="zoomTrigger">
                  <img src="${u.id_photo || u.avatar || `https://i.pravatar.cc/400?u=${u.email}`}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                  <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
                  </div>
               </div>
            </div>

            <div class="flex flex-col justify-center space-y-5">
              <div class="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Full Name</p>
                <p class="text-lg font-bold text-slate-900">${u.name}</p>
              </div>
              <div class="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Contact Details</p>
                <p class="text-sm font-bold text-slate-900">${u.email}</p>
                <p class="text-sm font-bold text-slate-600 mt-1">${u.phone || 'No Phone'}</p>
              </div>
              <div class="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Personal Info</p>
                <p class="text-sm font-bold text-slate-900"><span class="text-slate-400 font-medium">B-Day:</span> ${u.birthday || 'N/A'}</p>
                <p class="text-sm font-bold text-slate-900 mt-1"><span class="text-slate-400 font-medium">Address:</span> ${u.address || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div class="flex gap-4 pt-4">
            <button id="rejectUser" class="flex-1 py-5 bg-rose-50 text-rose-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all">Decline Account</button>
            <button id="approveUser" class="flex-1 py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-slate-900/20">Approve Access</button>
          </div>
        </div>
      `;
      reviewUserModal.classList.remove('hidden');

      // Zoom Logic
      const zoomTrigger = document.getElementById('zoomTrigger');
      const zoomModal = document.getElementById('imageZoomModal');
      const zoomedImg = document.getElementById('zoomedImage');
      const closeZoom = document.getElementById('closeZoom');

      if (zoomTrigger) {
        zoomTrigger.onclick = () => {
          zoomedImg.src = u.id_photo || u.avatar || `https://i.pravatar.cc/800?u=${u.email}`;
          zoomModal.classList.remove('hidden');
        };
      }
      if (closeZoom) closeZoom.onclick = () => zoomModal.classList.add('hidden');

      document.getElementById('closeReview').onclick = () => reviewUserModal.classList.add('hidden');
      document.getElementById('approveUser').onclick = async () => {
        try {
          await admin.updateUserStatus(u.id, 'approved');
          const res = await admin.getUsers();
          state.users = res.data;
          reviewUserModal.classList.add('hidden');
          renderFn();
        } catch (err) { alert("Failed to approve"); }
      };
      document.getElementById('rejectUser').onclick = async () => {
        if (!confirm("Reject this account?")) return;
        try {
          await admin.updateUserStatus(u.id, 'rejected');
          const res = await admin.getUsers();
          state.users = res.data;
          reviewUserModal.classList.add('hidden');
          renderFn();
        } catch (err) { alert("Failed to reject"); }
      };
    };
  });

  // Cottage Management Listeners
  const openAddCottage = document.getElementById('openAddCottage');
  const addCottageModal = document.getElementById('addCottageModal');
  const closeCottageModal = document.getElementById('closeCottageModal');
  if (openAddCottage) openAddCottage.onclick = () => addCottageModal.classList.remove('hidden');
  if (closeCottageModal) closeCottageModal.onclick = () => addCottageModal.classList.add('hidden');

  const addCottageForm = document.getElementById('addCottageForm');
  if (addCottageForm) {
    addCottageForm.onsubmit = async (e) => {
      e.preventDefault();
      const data = {
        category: document.getElementById('cottageCategory').value,
        price: parseInt(document.getElementById('cottagePrice').value),
        amenities: document.getElementById('cottageAmenities').value
      };
      try {
        await admin.createCottage(data);
        const res = await cottages.getAll();
        state.cottages = res.data;
        addCottageModal.classList.add('hidden');
        renderFn();
      } catch (err) { alert("Error adding cottage"); }
    };
  }

  const updatePriceBtns = document.querySelectorAll('.update-price-btn');
  updatePriceBtns.forEach(btn => {
    btn.onclick = async () => {
      const id = btn.dataset.id;
      const currentPrice = btn.dataset.price;
      const newPrice = prompt(`Enter new price for Cottage #${id}:`, currentPrice);
      
      if (newPrice !== null && !isNaN(newPrice) && newPrice !== "") {
        try {
          await admin.updateCottage(id, { price: parseInt(newPrice) });
          const res = await cottages.getAll();
          state.cottages = res.data;
          renderFn();
        } catch (err) { alert("Error updating price"); }
      }
    };
  });

  const toggleButtons = document.querySelectorAll('.toggle-maintenance-btn');
  toggleButtons.forEach(btn => {
    btn.onclick = async () => {
      const id = btn.dataset.id;
      const currentActive = btn.dataset.active === 'true' || btn.dataset.active === '1';
      try {
        await admin.updateCottage(id, { active: !currentActive });
        const { cottages: cottageApi } = await import('../api.js');
        const res = await cottageApi.getAll();
        state.cottages = res.data;
        renderFn();
      } catch (err) { alert("Error updating status"); }
    };
  });

  // Add-on Management Listeners
  const openAddAddon = document.getElementById('openAddAddon');
  const addAddonModal = document.getElementById('addAddonModal');
  const closeAddonModal = document.getElementById('closeAddonModal');
  if (openAddAddon) openAddAddon.onclick = () => addAddonModal.classList.remove('hidden');
  if (closeAddonModal) closeAddonModal.onclick = () => addAddonModal.classList.add('hidden');

  const addAddonForm = document.getElementById('addAddonForm');
  if (addAddonForm) {
    addAddonForm.onsubmit = async (e) => {
      e.preventDefault();
      const data = {
        name: document.getElementById('addonName').value,
        price: parseInt(document.getElementById('addonPrice').value)
      };
      try {
        await admin.createAddon(data);
        const res = await addons.getAll();
        state.addons = res.data;
        addAddonModal.classList.add('hidden');
        renderFn();
      } catch (err) { alert("Error adding add-on"); }
    };
  }

  const updateAddonPriceBtns = document.querySelectorAll('.update-addon-price-btn');
  updateAddonPriceBtns.forEach(btn => {
    btn.onclick = async () => {
      const id = btn.dataset.id;
      const name = btn.dataset.name;
      const currentPrice = btn.dataset.price;
      const newPrice = prompt(`Enter new price for ${name}:`, currentPrice);
      
      if (newPrice !== null && !isNaN(newPrice) && newPrice !== "") {
        try {
          await admin.updateAddon(id, { price: parseInt(newPrice) });
          const res = await addons.getAll();
          state.addons = res.data;
          renderFn();
        } catch (err) { alert("Error updating price"); }
      }
    };
  });

  const deleteAddonBtns = document.querySelectorAll('.delete-addon-btn');
  deleteAddonBtns.forEach(btn => {
    btn.onclick = async () => {
      if (!confirm("Remove this add-on from services?")) return;
      const id = btn.dataset.id;
      try {
        await admin.deleteAddon(id);
        const res = await addons.getAll();
        state.addons = res.data;
        renderFn();
      } catch (err) { alert("Error removing add-on"); }
    };
  });

  const deleteButtons = document.querySelectorAll('.delete-cottage-btn');
  deleteButtons.forEach(btn => {
    btn.onclick = async () => {
      if (!confirm("Are you sure you want to delete this cottage? This cannot be undone.")) return;
      const id = btn.dataset.id;
      try {
        await admin.deleteCottage(id);
        const { cottages: cottageApi } = await import('../api.js');
        const res = await cottageApi.getAll();
        state.cottages = res.data;
        renderFn();
      } catch (err) { alert("Error deleting cottage"); }
    };
  });

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.onclick = () => {
    state.user = null;
    state.token = null;
    state.bookings = [];
    state.cottages = [];
    state.users = [];
    state.addons = [];
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('login', renderFn);
  };

  const refreshBtn = document.getElementById('refreshData');
  if (refreshBtn) refreshBtn.onclick = async () => {
    const res = await bookings.getAll();
    state.bookings = res.data;
    const userRes = await admin.getUsers();
    state.users = userRes.data;
    renderFn();
  };
}
