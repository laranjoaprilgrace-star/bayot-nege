<script setup>
import { computed } from 'vue';
import { state } from '../store';

const today = new Date().toISOString().split('T')[0];

// ── Summary Stats ─────────────────────────────────────────
const totalBookings  = computed(() => state.bookingsList.length);
const totalRevenue   = computed(() => state.bookingsList.reduce((s, b) => s + b.total, 0));
const reservedToday  = computed(() => state.bookingsList.filter(b => b.bookingDate === today).length);
const availableToday = computed(() => state.cottages.filter(c => !c.bookings.includes(today)).length);
const avgRevenue     = computed(() => totalBookings.value ? Math.round(totalRevenue.value / totalBookings.value) : 0);
const grillRate      = computed(() => {
  if (!totalBookings.value) return 0;
  return Math.round((state.bookingsList.filter(b => b.hasGrill).length / totalBookings.value) * 100);
});

// ── Cottage Bar Chart ────────────────────────────────────
const cottageBars = computed(() => {
  const counts = {};
  state.bookingsList.forEach(b => {
    const key = `C${b.cottageId}`;
    counts[key] = (counts[key] || 0) + 1;
  });
  const sorted = Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
  const max = sorted[0]?.count || 1;
  return sorted.map(c => ({ ...c, pct: Math.round((c.count / max) * 100) }));
});

// ── Event Bar Chart ──────────────────────────────────────
const eventBars = computed(() => {
  const counts = {};
  state.bookingsList.forEach(b => {
    if (b.eventType) counts[b.eventType] = (counts[b.eventType] || 0) + 1;
  });
  const sorted = Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
  const max = sorted[0]?.count || 1;
  return sorted.map(e => ({ ...e, pct: Math.round((e.count / max) * 100) }));
});

// ── Tier Breakdown ───────────────────────────────────────
const tierBreakdown = computed(() => {
  const premium  = state.bookingsList.filter(b => b.cottageTier === 'Premium').length;
  const standard = state.bookingsList.filter(b => b.cottageTier === 'Standard').length;
  const total = premium + standard || 1;
  return [
    { label: 'Premium',  count: premium,  pct: Math.round(premium  / total * 100), color: '#c5a059' },
    { label: 'Standard', count: standard, pct: Math.round(standard / total * 100), color: '#718096' },
  ];
});

// ── Cottage Status ───────────────────────────────────────
const cottageStatus = computed(() =>
  state.cottages.map(c => ({ ...c, bookedToday: c.bookings.includes(today) }))
);

const logout = () => {
  state.adminAuthenticated = false;
  state.isAdminMode = false;
};
</script>

<template>
  <div class="adm-wrap fade-in">

    <!-- ── Top Bar ── -->
    <div class="adm-topbar">
      <div class="adm-brand">
        <span class="adm-brand-dot"></span>
        <span class="adm-brand-name">Admin Dashboard</span>
        <span class="adm-live-badge">● Live</span>
      </div>
      <div class="adm-topbar-right">
        <span class="adm-date-label">{{ today }}</span>
        <button class="adm-logout-btn" @click="logout">Sign Out</button>
      </div>
    </div>

    <div class="adm-content">

      <!-- ── KPI Cards ── -->
      <div class="adm-kpi-grid">
        <div class="adm-kpi">
          <div class="adm-kpi-icon">📋</div>
          <div class="adm-kpi-val">{{ totalBookings }}</div>
          <div class="adm-kpi-label">Total Bookings</div>
        </div>
        <div class="adm-kpi adm-kpi--accent">
          <div class="adm-kpi-icon">💰</div>
          <div class="adm-kpi-val">₱{{ totalRevenue.toLocaleString() }}</div>
          <div class="adm-kpi-label">Total Revenue</div>
        </div>
        <div class="adm-kpi">
          <div class="adm-kpi-icon">📅</div>
          <div class="adm-kpi-val">{{ reservedToday }}</div>
          <div class="adm-kpi-label">Reserved Today</div>
        </div>
        <div class="adm-kpi">
          <div class="adm-kpi-icon">🏠</div>
          <div class="adm-kpi-val">{{ availableToday }}</div>
          <div class="adm-kpi-label">Available Today</div>
        </div>
        <div class="adm-kpi">
          <div class="adm-kpi-icon">📊</div>
          <div class="adm-kpi-val">₱{{ avgRevenue.toLocaleString() }}</div>
          <div class="adm-kpi-label">Avg per Booking</div>
        </div>
        <div class="adm-kpi">
          <div class="adm-kpi-icon">🍖</div>
          <div class="adm-kpi-val">{{ grillRate }}%</div>
          <div class="adm-kpi-label">Grill Add-on Rate</div>
        </div>
      </div>

      <!-- ── Charts Row ── -->
      <div v-if="totalBookings > 0" class="adm-charts-row">

        <!-- Cottage Bar Chart -->
        <div class="adm-card adm-chart-card">
          <div class="adm-card-header">
            <div>
              <div class="adm-card-title">Most Booked Cottages</div>
              <div class="adm-card-sub">Bookings per cottage, top {{ cottageBars.length }}</div>
            </div>
            <div class="adm-chart-legend">
              <span class="adm-legend-dot" style="background: linear-gradient(135deg,#667eea,#764ba2)"></span>
              Bookings
            </div>
          </div>
          <div class="adm-vbar-chart">
            <div class="adm-vbar-grid">
              <div class="adm-grid-line"></div>
              <div class="adm-grid-line"></div>
              <div class="adm-grid-line"></div>
              <div class="adm-grid-line"></div>
            </div>
            <div class="adm-vbar-group">
              <div v-for="item in cottageBars" :key="item.name" class="adm-vbar-col">
                <div class="adm-vbar-val">{{ item.count }}</div>
                <div class="adm-vbar-bar-wrap">
                  <div
                    class="adm-vbar-bar adm-bar-purple"
                    :style="{ height: item.pct + '%' }"
                  >
                    <div class="adm-vbar-tooltip">{{ item.name }}: {{ item.count }}x</div>
                  </div>
                </div>
                <div class="adm-vbar-label">{{ item.name }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Event Bar Chart -->
        <div class="adm-card adm-chart-card">
          <div class="adm-card-header">
            <div>
              <div class="adm-card-title">Popular Event Types</div>
              <div class="adm-card-sub">Frequency of each event</div>
            </div>
            <div class="adm-chart-legend">
              <span class="adm-legend-dot" style="background: linear-gradient(135deg,#f6ad55,#e53e3e)"></span>
              Events
            </div>
          </div>
          <div class="adm-hbar-chart">
            <div v-for="(item, i) in eventBars" :key="item.name" class="adm-hbar-row">
              <div class="adm-hbar-rank">{{ i + 1 }}</div>
              <div class="adm-hbar-label">{{ item.name }}</div>
              <div class="adm-hbar-track">
                <div class="adm-hbar-fill adm-bar-orange" :style="{ width: item.pct + '%' }">
                  <span class="adm-hbar-count">{{ item.count }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- ── Second Charts Row ── -->
      <div v-if="totalBookings > 0" class="adm-charts-row adm-charts-row--3">

        <!-- Tier Donut -->
        <div class="adm-card">
          <div class="adm-card-title" style="margin-bottom:24px">Tier Split</div>
          <div class="adm-donut-wrap">
            <svg class="adm-donut" viewBox="0 0 36 36">
              <circle class="adm-donut-ring" cx="18" cy="18" r="15.9" />
              <circle
                class="adm-donut-seg adm-donut-premium"
                cx="18" cy="18" r="15.9"
                :stroke-dasharray="`${tierBreakdown[0].pct} ${100 - tierBreakdown[0].pct}`"
                stroke-dashoffset="25"
              />
              <circle
                class="adm-donut-seg adm-donut-standard"
                cx="18" cy="18" r="15.9"
                :stroke-dasharray="`${tierBreakdown[1].pct} ${100 - tierBreakdown[1].pct}`"
                :stroke-dashoffset="String(25 - tierBreakdown[0].pct)"
              />
            </svg>
            <div class="adm-donut-center">
              <div class="adm-donut-total">{{ totalBookings }}</div>
              <div class="adm-donut-sub">total</div>
            </div>
          </div>
          <div class="adm-donut-legend">
            <div v-for="t in tierBreakdown" :key="t.label" class="adm-donut-legend-row">
              <span class="adm-legend-dot" :style="{ background: t.color }"></span>
              <span class="adm-donut-legend-label">{{ t.label }}</span>
              <span class="adm-donut-legend-pct" :style="{ color: t.color }">{{ t.pct }}%</span>
              <span class="adm-donut-legend-count">({{ t.count }})</span>
            </div>
          </div>
        </div>

        <!-- Grill Gauge -->
        <div class="adm-card">
          <div class="adm-card-title" style="margin-bottom:24px">🍖 Grill Add-on</div>
          <div class="adm-radial-wrap">
            <svg class="adm-radial" viewBox="0 0 36 36">
              <circle class="adm-donut-ring" cx="18" cy="18" r="15.9" />
              <circle
                class="adm-radial-seg"
                cx="18" cy="18" r="15.9"
                :stroke-dasharray="`${grillRate} ${100 - grillRate}`"
                stroke-dashoffset="25"
              />
            </svg>
            <div class="adm-donut-center">
              <div class="adm-radial-val">{{ grillRate }}%</div>
              <div class="adm-donut-sub">with grill</div>
            </div>
          </div>
          <p class="adm-gauge-note">
            {{ state.bookingsList.filter(b => b.hasGrill).length }} of {{ totalBookings }} bookings included the grill add-on (₱300).
          </p>
        </div>

        <!-- Revenue Breakdown -->
        <div class="adm-card">
          <div class="adm-card-title" style="margin-bottom:24px">Revenue Breakdown</div>
          <div class="adm-rev-list">
            <div class="adm-rev-row">
              <span class="adm-rev-dot adm-rev-cottage"></span>
              <span class="adm-rev-label">Cottage fees</span>
              <span class="adm-rev-val">
                ₱{{ state.bookingsList.reduce((s,b)=>s+(b.total-(b.hasGrill?300:0)),0).toLocaleString() }}
              </span>
            </div>
            <div class="adm-rev-row">
              <span class="adm-rev-dot adm-rev-grill"></span>
              <span class="adm-rev-label">Grill add-ons</span>
              <span class="adm-rev-val">
                ₱{{ state.bookingsList.reduce((s,b)=>s+(b.hasGrill?300:0),0).toLocaleString() }}
              </span>
            </div>
            <div class="adm-rev-total-row">
              <span class="adm-rev-label" style="font-weight:700">Total</span>
              <span class="adm-rev-total">₱{{ totalRevenue.toLocaleString() }}</span>
            </div>
          </div>

          <!-- Revenue stacked bar -->
          <div class="adm-stacked-track">
            <div
              class="adm-stacked-cottage"
              :style="{ flex: totalRevenue - state.bookingsList.reduce((s,b)=>s+(b.hasGrill?300:0),0) }"
            ></div>
            <div
              class="adm-stacked-grill"
              :style="{ flex: state.bookingsList.reduce((s,b)=>s+(b.hasGrill?300:0),0) }"
            ></div>
          </div>
        </div>

      </div>

      <!-- ── Empty Analytics State ── -->
      <div v-if="totalBookings === 0" class="adm-analytics-empty">
        <div class="adm-empty-icon">📊</div>
        <p>Analytics will appear here once bookings are confirmed.</p>
      </div>

      <!-- ── Bookings Table ── -->
      <div class="adm-card" style="margin-bottom:28px">
        <div class="adm-card-header" style="margin-bottom:20px">
          <div class="adm-card-title">All Bookings</div>
          <span class="adm-pill">{{ totalBookings }} records</span>
        </div>

        <div v-if="state.bookingsList.length === 0" class="adm-empty">
          <div class="adm-empty-icon">📋</div>
          <p>No bookings yet this session.</p>
          <p class="adm-empty-sub">Confirmed bookings will appear here.</p>
        </div>

        <div v-else class="adm-table-wrap">
          <table class="adm-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Group / Customer</th>
                <th>Event</th>
                <th>Cottage</th>
                <th>Tier</th>
                <th>Date</th>
                <th>Grill</th>
                <th>Total</th>
                <th>GCash Ref</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(b, i) in state.bookingsList" :key="b.id">
                <td class="adm-td-muted">{{ i + 1 }}</td>
                <td class="adm-td-bold">{{ b.groupName || '—' }}</td>
                <td>{{ b.eventType || '—' }}</td>
                <td class="adm-td-bold">Cottage {{ b.cottageId }}</td>
                <td>
                  <span class="adm-tier-badge" :class="b.cottageTier.toLowerCase()">
                    {{ b.cottageTier }}
                  </span>
                </td>
                <td>{{ b.bookingDate }}</td>
                <td>
                  <span class="adm-grill-badge" :class="b.hasGrill ? 'yes' : 'no'">
                    {{ b.hasGrill ? '✓ Yes' : '✗ No' }}
                  </span>
                </td>
                <td class="adm-td-bold">₱{{ b.total.toLocaleString() }}</td>
                <td class="adm-td-ref">{{ b.refNumber }}</td>
                <td><span class="adm-status-badge confirmed">Confirmed</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ── Cottage Grid ── -->
      <div class="adm-card">
        <div class="adm-card-header" style="margin-bottom:20px">
          <div class="adm-card-title">Cottage Availability — Today</div>
          <span class="adm-pill">{{ today }}</span>
        </div>
        <div class="adm-cottage-grid">
          <div
            v-for="c in cottageStatus"
            :key="c.id"
            class="adm-cottage-tile"
            :class="{ booked: c.bookedToday }"
          >
            <div class="adm-cottage-tile-id">{{ c.id }}</div>
            <div class="adm-cottage-tile-tier">{{ c.tier }}</div>
            <div class="adm-cottage-tile-status">
              {{ c.bookedToday ? '🔴 Reserved' : '🟢 Open' }}
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* ── Wrap ────────────────────────────────────────── */
.adm-wrap {
  min-height: 100vh;
  background: #f0f2f5;
  font-family: 'Outfit', sans-serif;
}

/* ── Top Bar ─────────────────────────────────────── */
.adm-topbar {
  background: white;
  border-bottom: 1px solid rgba(0,0,0,0.07);
  padding: 0 40px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
}

.adm-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.adm-brand-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #000;
}

.adm-brand-name {
  font-size: 0.92rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #000;
}

.adm-live-badge {
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #38a169;
  background: #f0fdf4;
  padding: 3px 10px;
  border-radius: 100px;
}

.adm-topbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.adm-date-label {
  font-size: 0.72rem;
  color: #a0aec0;
  font-weight: 500;
}

.adm-logout-btn {
  background: transparent;
  border: 1px solid rgba(0,0,0,0.12);
  color: #718096;
  padding: 7px 16px;
  font-size: 0.72rem;
  font-weight: 600;
  border-radius: 100px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s ease;
}

.adm-logout-btn:hover {
  background: #000;
  color: white;
  border-color: #000;
  transform: none;
  box-shadow: none;
}

/* ── Content ─────────────────────────────────────── */
.adm-content {
  padding: 32px 40px;
  max-width: 1400px;
  margin: 0 auto;
}

/* ── KPI Grid ────────────────────────────────────── */
.adm-kpi-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.adm-kpi {
  background: white;
  border-radius: 16px;
  padding: 22px 20px;
  border: 1px solid rgba(0,0,0,0.055);
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}

.adm-kpi--accent {
  background: #000;
  color: white;
}

.adm-kpi-icon { font-size: 1.2rem; margin-bottom: 10px; }

.adm-kpi-val {
  font-size: 1.55rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  margin-bottom: 4px;
}

.adm-kpi-label {
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.45;
}

/* ── Card ────────────────────────────────────────── */
.adm-card {
  background: white;
  border-radius: 20px;
  padding: 28px 28px 24px;
  border: 1px solid rgba(0,0,0,0.055);
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}

.adm-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.adm-card-title {
  font-size: 0.92rem;
  font-weight: 700;
  color: #000;
  margin-bottom: 2px;
}

.adm-card-sub {
  font-size: 0.7rem;
  color: #a0aec0;
  font-weight: 400;
}

.adm-chart-legend {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.68rem;
  font-weight: 600;
  color: #718096;
  white-space: nowrap;
}

.adm-legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  display: inline-block;
}

.adm-pill {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: #f0f0f0;
  color: #555;
  padding: 4px 10px;
  border-radius: 100px;
  white-space: nowrap;
}

/* ── Charts Row ──────────────────────────────────── */
.adm-charts-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.adm-charts-row--3 {
  grid-template-columns: 1fr 1fr 1fr;
}

.adm-chart-card { /* height constraint for the chart area */ }

/* ── Vertical Bar Chart ──────────────────────────── */
.adm-vbar-chart {
  position: relative;
  margin-top: 20px;
  height: 200px;
}

.adm-vbar-grid {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  pointer-events: none;
}

.adm-grid-line {
  width: 100%;
  height: 1px;
  background: rgba(0,0,0,0.05);
}

.adm-vbar-group {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  gap: 10px;
  padding: 0 4px;
}

.adm-vbar-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  position: relative;
}

.adm-vbar-val {
  font-size: 0.65rem;
  font-weight: 700;
  color: #4a5568;
  margin-bottom: 4px;
  min-height: 16px;
  display: flex;
  align-items: flex-end;
}

.adm-vbar-bar-wrap {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-end;
}

.adm-vbar-bar {
  width: 100%;
  border-radius: 6px 6px 0 0;
  transition: height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  cursor: pointer;
  min-height: 4px;
}

.adm-vbar-bar:hover { filter: brightness(1.1); }

.adm-vbar-tooltip {
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  background: #1a202c;
  color: white;
  font-size: 0.65rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
  z-index: 10;
}

.adm-vbar-bar:hover .adm-vbar-tooltip { opacity: 1; }

.adm-vbar-label {
  font-size: 0.62rem;
  font-weight: 600;
  color: #a0aec0;
  margin-top: 8px;
  text-align: center;
}

.adm-bar-purple { background: linear-gradient(180deg, #764ba2, #667eea); }
.adm-bar-orange { background: linear-gradient(90deg, #f6ad55, #e53e3e); }

/* ── Horizontal Bar Chart ────────────────────────── */
.adm-hbar-chart {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.adm-hbar-row {
  display: grid;
  grid-template-columns: 22px 140px 1fr;
  align-items: center;
  gap: 10px;
}

.adm-hbar-rank {
  font-size: 0.62rem;
  font-weight: 700;
  background: #f0f0f0;
  color: #888;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.adm-hbar-label {
  font-size: 0.78rem;
  font-weight: 500;
  color: #2d3748;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.adm-hbar-track {
  height: 28px;
  background: #f7f7f7;
  border-radius: 6px;
  overflow: hidden;
}

.adm-hbar-fill {
  height: 100%;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 8px;
  transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  min-width: 28px;
}

.adm-hbar-count {
  font-size: 0.65rem;
  font-weight: 700;
  color: white;
}

/* ── Donut Chart ─────────────────────────────────── */
.adm-donut-wrap, .adm-radial-wrap {
  position: relative;
  width: 130px;
  margin: 0 auto 20px auto;
}

.adm-donut, .adm-radial {
  width: 100%;
  transform: rotate(-90deg);
}

.adm-donut-ring {
  fill: none;
  stroke: #f0f0f0;
  stroke-width: 3.5;
}

.adm-donut-seg {
  fill: none;
  stroke-width: 3.5;
  stroke-linecap: round;
  transition: stroke-dasharray 0.8s ease;
}

.adm-donut-premium  { stroke: #c5a059; }
.adm-donut-standard { stroke: #718096; }

.adm-radial-seg {
  fill: none;
  stroke: #48bb78;
  stroke-width: 3.5;
  stroke-linecap: round;
  transition: stroke-dasharray 0.8s ease;
}

.adm-donut-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.adm-donut-total, .adm-radial-val {
  font-size: 1.4rem;
  font-weight: 700;
  color: #000;
  line-height: 1;
}

.adm-radial-val { color: #38a169; }

.adm-donut-sub {
  font-size: 0.6rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #a0aec0;
  margin-top: 2px;
}

.adm-donut-legend {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.adm-donut-legend-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
}

.adm-donut-legend-label { flex: 1; color: #4a5568; font-weight: 500; }
.adm-donut-legend-pct   { font-weight: 700; }
.adm-donut-legend-count { color: #a0aec0; font-size: 0.72rem; }

.adm-gauge-note {
  font-size: 0.72rem;
  color: #a0aec0;
  text-align: center;
  line-height: 1.5;
  margin-top: 4px;
}

/* ── Revenue Breakdown ───────────────────────────── */
.adm-rev-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }

.adm-rev-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.82rem;
}

.adm-rev-dot {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  flex-shrink: 0;
}

.adm-rev-cottage { background: #667eea; }
.adm-rev-grill   { background: #f6ad55; }

.adm-rev-label { flex: 1; color: #4a5568; font-weight: 500; }
.adm-rev-val   { font-weight: 700; color: #000; }

.adm-rev-total-row {
  display: flex;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid rgba(0,0,0,0.07);
  font-size: 0.85rem;
}

.adm-rev-total { font-size: 1.2rem; font-weight: 700; color: #000; }

.adm-stacked-track {
  height: 10px;
  border-radius: 100px;
  overflow: hidden;
  display: flex;
}

.adm-stacked-cottage {
  background: #667eea;
  transition: flex 0.6s ease;
}

.adm-stacked-grill {
  background: #f6ad55;
  transition: flex 0.6s ease;
}

/* ── Analytics Empty ─────────────────────────────── */
.adm-analytics-empty {
  background: white;
  border-radius: 20px;
  border: 1px solid rgba(0,0,0,0.055);
  padding: 60px;
  text-align: center;
  color: #a0aec0;
  margin-bottom: 24px;
  font-size: 0.88rem;
}

.adm-analytics-empty .adm-empty-icon { font-size: 2rem; margin-bottom: 12px; }

/* ── Bookings Table ──────────────────────────────── */
.adm-empty {
  text-align: center;
  padding: 48px 20px;
  color: #a0aec0;
}
.adm-empty-icon { font-size: 2rem; margin-bottom: 10px; }
.adm-empty p    { font-size: 0.9rem; margin-bottom: 4px; }
.adm-empty-sub  { font-size: 0.75rem; font-weight: 300; }

.adm-table-wrap { overflow-x: auto; }

.adm-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
}

.adm-table th {
  text-align: left;
  font-size: 0.63rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #a0aec0;
  padding: 0 12px 12px;
  border-bottom: 1px solid rgba(0,0,0,0.06);
  white-space: nowrap;
}

.adm-table td {
  padding: 13px 12px;
  border-bottom: 1px solid rgba(0,0,0,0.04);
  color: #4a5568;
  vertical-align: middle;
}

.adm-table tr:last-child td { border-bottom: none; }
.adm-table tr:hover td      { background: #fafafa; }

.adm-td-muted { color: #a0aec0 !important; }
.adm-td-bold  { font-weight: 600; color: #000 !important; }
.adm-td-ref   { font-family: monospace; font-size: 0.72rem; letter-spacing: 0.05em; }

.adm-status-badge {
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 4px 10px;
  border-radius: 100px;
}
.adm-status-badge.confirmed { background: #ebfaf1; color: #276749; }

.adm-tier-badge {
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 3px 8px;
  border-radius: 100px;
}
.adm-tier-badge.premium  { background: #fef9ec; color: #b7791f; }
.adm-tier-badge.standard { background: #f0f0f0;  color: #555; }

.adm-grill-badge { font-size: 0.75rem; font-weight: 500; }
.adm-grill-badge.yes { color: #276749; }
.adm-grill-badge.no  { color: #a0aec0; }

/* ── Cottage Availability Grid ───────────────────── */
.adm-cottage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 10px;
}

.adm-cottage-tile {
  background: #f0fdf4;
  border: 1px solid rgba(56,161,105,0.18);
  border-radius: 10px;
  padding: 12px 8px;
  text-align: center;
  transition: all 0.2s ease;
}

.adm-cottage-tile.booked {
  background: #fff5f5;
  border-color: rgba(229,62,62,0.18);
}

.adm-cottage-tile-id   { font-size: 1rem;  font-weight: 700; color: #000; margin-bottom: 2px; }
.adm-cottage-tile-tier { font-size: 0.55rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #a0aec0; margin-bottom: 5px; }
.adm-cottage-tile-status { font-size: 0.62rem; font-weight: 500; }

/* ── Responsive ──────────────────────────────────── */
@media (max-width: 1200px) {
  .adm-kpi-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 900px) {
  .adm-charts-row     { grid-template-columns: 1fr; }
  .adm-charts-row--3  { grid-template-columns: 1fr; }
  .adm-kpi-grid       { grid-template-columns: repeat(2, 1fr); }
  .adm-content        { padding: 20px; }
  .adm-topbar         { padding: 0 20px; }
}
</style>
