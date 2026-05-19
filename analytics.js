/** Analytics dashboard styles (bundled by Vite on production build) */
import './analytics.css';

/**
 * analytics.js — SDG Engagement Analytics
 * Fetches view_goal clicks from Supabase, aggregates per SDG (1–17),
 * renders Chart.js pie chart + summary + full legend. Auto-refreshes on interval & custom event.
 */

import { supabase } from './js/supabaseClient.js';

/* ==========================================================================
   SDG metadata — official UN colors & short titles for labels/legend
   ========================================================================== */
const SDG_META = [
  { id: 1, title: 'No Poverty', color: '#E5243B' },
  { id: 2, title: 'Zero Hunger', color: '#DDA63A' },
  { id: 3, title: 'Good Health', color: '#4C9F38' },
  { id: 4, title: 'Quality Education', color: '#C5192D' },
  { id: 5, title: 'Gender Equality', color: '#FF3A21' },
  { id: 6, title: 'Clean Water', color: '#26BDE2' },
  { id: 7, title: 'Clean Energy', color: '#FCC30B' },
  { id: 8, title: 'Decent Work', color: '#A21942' },
  { id: 9, title: 'Industry & Innovation', color: '#FD6925' },
  { id: 10, title: 'Reduced Inequalities', color: '#DD1367' },
  { id: 11, title: 'Sustainable Cities', color: '#FD9D24' },
  { id: 12, title: 'Responsible Consumption', color: '#BF8B2E' },
  { id: 13, title: 'Climate Action', color: '#3F7E44' },
  { id: 14, title: 'Life Below Water', color: '#0A97D9' },
  { id: 15, title: 'Life on Land', color: '#56C02B' },
  { id: 16, title: 'Peace & Justice', color: '#00689D' },
  { id: 17, title: 'Partnerships', color: '#19486A' }
];

const SDG_COUNT = 17;
const REFRESH_MS = 45000; // periodic Supabase refresh for live demo

/** Chart.js instance — recreated on first load, updated on refresh */
let engagementChart = null;
let refreshTimer = null;
let isFetching = false;

/** Cached click counts & total for tooltips between chart updates */
let lastCounts = Array(SDG_COUNT).fill(0);
let lastTotal = 0;

/* DOM references (set on init) */
const els = {};

/**
 * Supabase fetching — single efficient query for all SDG card visits.
 * Filters action_type = 'view_goal' (logged when users click an SDG card).
 */
async function fetchSdgClickRows() {
  const { data, error } = await supabase
    .from('user_sdg_progress')
    .select('goal_id')
    .eq('action_type', 'view_goal');

  if (error) throw error;
  return data ?? [];
}

/**
 * Data aggregation — count clicks per SDG 1–17 from goal_id values.
 * Ignores invalid or missing goal_id entries.
 */
function aggregateClicks(rows) {
  const counts = Array(SDG_COUNT).fill(0);

  for (const row of rows) {
    const n = parseInt(String(row.goal_id ?? '').trim(), 10);
    if (Number.isFinite(n) && n >= 1 && n <= SDG_COUNT) {
      counts[n - 1] += 1;
    }
  }

  const total = counts.reduce((sum, c) => sum + c, 0);
  return { counts, total };
}

/** Find SDG index with max/min clicks; ties favor lowest SDG number */
function extremaIndices(counts) {
  let maxIdx = 0;
  let minIdx = 0;

  for (let i = 1; i < SDG_COUNT; i++) {
    if (counts[i] > counts[maxIdx]) maxIdx = i;
    if (counts[i] <= counts[minIdx]) minIdx = i;
  }

  return { maxIdx, minIdx };
}

function percent(count, total) {
  if (!total) return 0;
  return (count / total) * 100;
}

function formatPct(value) {
  return `${value.toFixed(1)}%`;
}

/** UI state helpers — loading / error / dashboard */
function showLoading() {
  els.loading?.removeAttribute('hidden');
  els.error?.setAttribute('hidden', '');
  els.dashboard?.setAttribute('hidden', '');
}

function showError(message) {
  els.loading?.setAttribute('hidden', '');
  els.dashboard?.setAttribute('hidden', '');
  els.error?.removeAttribute('hidden');
  if (els.errorMessage) els.errorMessage.textContent = message;
}

function showDashboard() {
  els.loading?.setAttribute('hidden', '');
  els.error?.setAttribute('hidden', '');
  els.dashboard?.removeAttribute('hidden');
}

/** Animate summary total number for presentation polish */
function animateTotal(el, target) {
  if (!el) return;
  const duration = 800;
  const start = parseInt(el.textContent, 10) || 0;
  const startTime = performance.now();

  function tick(now) {
    const t = Math.min((now - startTime) / duration, 1);
    const eased = 1 - (1 - t) ** 3;
    el.textContent = Math.round(start + (target - start) * eased);
    if (t < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

/** Update summary cards: total, most visited, least visited */
function updateSummary(counts, total) {
  const { maxIdx, minIdx } = extremaIndices(counts);
  const most = SDG_META[maxIdx];
  const least = SDG_META[minIdx];

  animateTotal(els.total, total);

  if (els.mostPill) {
    els.mostPill.textContent = total ? `SDG ${most.id}` : '—';
    els.mostPill.style.setProperty('--sdg-pill-color', most.color);
    els.mostPill.style.background = most.color;
  }
  if (els.mostLabel) els.mostLabel.textContent = total ? most.title : 'No data yet';
  if (els.mostCount) els.mostCount.textContent = String(counts[maxIdx]);

  if (els.leastPill) {
    els.leastPill.textContent = total ? `SDG ${least.id}` : '—';
    els.leastPill.style.background = least.color;
  }
  if (els.leastLabel) els.leastLabel.textContent = total ? least.title : 'No data yet';
  if (els.leastCount) els.leastCount.textContent = String(counts[minIdx]);
}

/**
 * Custom legend — always renders all 17 SDGs (including zero clicks).
 * Hover highlights matching chart segment when Chart.js is active.
 */
function renderLegend(counts, total) {
  if (!els.legend) return;
  els.legend.innerHTML = '';

  SDG_META.forEach((sdg, i) => {
    const count = counts[i];
    const pct = formatPct(percent(count, total));
    const item = document.createElement('div');
    item.className = `analytics-legend-item${count === 0 ? ' is-zero' : ''}`;
    item.dataset.sdgIndex = String(i);
    item.setAttribute('role', 'listitem');
    item.innerHTML = `
      <span class="legend-swatch" style="background:${sdg.color}" aria-hidden="true"></span>
      <span class="legend-label">SDG ${sdg.id}: ${sdg.title}</span>
      <span class="legend-count" title="Total clicks on this SDG card">${count}</span>
      <span class="legend-pct" title="Share of all SDG clicks">${pct}</span>
    `;

    item.addEventListener('mouseenter', () => highlightChartSegment(i));
    item.addEventListener('mouseleave', () => resetChartHighlight());
    els.legend.appendChild(item);
  });
}

function highlightChartSegment(index) {
  if (!engagementChart) return;
  engagementChart.setActiveElements([{ datasetIndex: 0, index }]);
  engagementChart.tooltip?.setActiveElements([{ datasetIndex: 0, index }], { x: 0, y: 0 });
  engagementChart.update('none');

  document.querySelectorAll('.analytics-legend-item').forEach((el, i) => {
    el.classList.toggle('is-highlighted', i === index);
  });
}

function resetChartHighlight() {
  if (!engagementChart) return;
  engagementChart.setActiveElements([]);
  engagementChart.tooltip?.setActiveElements([], { x: 0, y: 0 });
  engagementChart.update('none');
  document.querySelectorAll('.analytics-legend-item').forEach((el) => {
    el.classList.remove('is-highlighted');
  });
}

/**
 * Chart generation — Chart.js doughnut/pie with UN colors & animated updates.
 * Tooltips show SDG number, clicks, and percentage of total.
 */
function buildChartConfig(counts, total) {
  const labels = SDG_META.map((s) => `SDG ${s.id}`);
  const colors = SDG_META.map((s) => s.color);
  // Chart.js hides true zero slices; use tiny weight so all 17 segments exist for legend sync
  const chartData = counts.map((c) => (c > 0 ? c : 0.0001));

  return {
    type: 'doughnut',
    data: {
      labels,
      datasets: [
        {
          data: chartData,
          backgroundColor: colors,
          borderColor: 'rgba(255,255,255,0.9)',
          borderWidth: 2,
          hoverBorderWidth: 3,
          hoverOffset: 12
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '52%',
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 1200,
        easing: 'easeOutQuart'
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.92)',
          titleFont: { size: 14, weight: 'bold' },
          bodyFont: { size: 13 },
          padding: 14,
          cornerRadius: 10,
          callbacks: {
            title(context) {
              const idx = context[0]?.dataIndex ?? 0;
              return `SDG ${SDG_META[idx]?.id ?? '?'}: ${SDG_META[idx]?.title ?? ''}`;
            },
            label(context) {
              const idx = context.dataIndex;
              const clicks = lastCounts[idx] ?? 0;
              const pct = formatPct(percent(clicks, lastTotal));
              return [`Clicks: ${clicks}`, `Share: ${pct}`];
            }
          }
        }
      },
      onHover(_event, elements) {
        const canvas = els.canvas;
        if (canvas) canvas.style.cursor = elements.length ? 'pointer' : 'default';
      }
    }
  };
}

/** Create chart on first successful fetch; update data on subsequent fetches */
function renderOrUpdateChart(counts, total) {
  if (typeof Chart === 'undefined') {
    showError('Chart.js failed to load. Check your network connection.');
    return;
  }

  const ctx = els.canvas?.getContext('2d');
  if (!ctx) return;

  const config = buildChartConfig(counts, total);

  if (total === 0) {
    if (engagementChart) {
      engagementChart.destroy();
      engagementChart = null;
    }
    if (els.chartEmpty) els.chartEmpty.removeAttribute('hidden');
    return;
  }

  if (els.chartEmpty) els.chartEmpty.setAttribute('hidden', '');

  if (!engagementChart) {
    engagementChart = new Chart(ctx, config);
  } else {
    engagementChart.data.datasets[0].data = counts.map((c) => (c > 0 ? c : 0.0001));
    engagementChart.update('active');
  }
}

/** Main pipeline: fetch → aggregate → update UI & chart */
async function loadAnalytics({ silent = false } = {}) {
  if (!els.section || isFetching) return;
  isFetching = true;

  if (!silent) showLoading();

  if (els.refreshBtn) els.refreshBtn.classList.add('is-spinning');

  try {
    const rows = await fetchSdgClickRows();
    const { counts, total } = aggregateClicks(rows);

    lastCounts = counts;
    lastTotal = total;

    showDashboard();
    updateSummary(counts, total);
    renderLegend(counts, total);
    renderOrUpdateChart(counts, total);
  } catch (err) {
    console.error('[Analytics] Supabase error:', err);
    const msg =
      err?.message?.includes('row-level security') || err?.message?.includes('policy')
        ? 'Analytics unavailable: check Supabase read policies for user_sdg_progress.'
        : err?.message || 'Unable to load analytics. Please try again.';
    showError(msg);
  } finally {
    isFetching = false;
    if (els.refreshBtn) els.refreshBtn.classList.remove('is-spinning');
  }
}

/** Wire DOM, listeners, and auto-refresh */
function cacheElements() {
  els.section = document.getElementById('sdg-analytics');
  if (!els.section) return false;

  els.loading = document.getElementById('analytics-loading');
  els.error = document.getElementById('analytics-error');
  els.errorMessage = document.getElementById('analytics-error-message');
  els.dashboard = document.getElementById('analytics-dashboard');
  els.total = document.getElementById('analytics-total');
  els.mostPill = document.getElementById('analytics-most-pill');
  els.mostLabel = document.getElementById('analytics-most-label');
  els.mostCount = document.getElementById('analytics-most-count');
  els.leastPill = document.getElementById('analytics-least-pill');
  els.leastLabel = document.getElementById('analytics-least-label');
  els.leastCount = document.getElementById('analytics-least-count');
  els.legend = document.getElementById('analytics-legend');
  els.canvas = document.getElementById('sdg-engagement-chart');
  els.chartEmpty = document.getElementById('analytics-chart-empty');
  els.refreshBtn = document.getElementById('analytics-refresh-btn');
  els.retryBtn = document.getElementById('analytics-retry-btn');

  return true;
}

function initAnalytics() {
  if (!cacheElements()) return;

  els.retryBtn?.addEventListener('click', () => loadAnalytics());
  els.refreshBtn?.addEventListener('click', () => loadAnalytics({ silent: true }));

  // Refresh when another part of the app logs a new SDG click
  window.addEventListener('sdg-analytics-refresh', () => {
    loadAnalytics({ silent: true });
  });

  // Responsive: Chart.js listens to resize; debounced update on narrow layouts
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      engagementChart?.resize();
    }, 200);
  });

  loadAnalytics();

  if (refreshTimer) clearInterval(refreshTimer);
  refreshTimer = setInterval(() => loadAnalytics({ silent: true }), REFRESH_MS);
}

document.addEventListener('DOMContentLoaded', initAnalytics);

export { loadAnalytics, aggregateClicks, fetchSdgClickRows };
