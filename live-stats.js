/**
 * live-stats.js — Live Global SDG Statistics (World Bank Open Data API)
 * Fetches real indicators for India (IN) and updates glassmorphism stat cards.
 * Vanilla JS only — uses fetch(), no frameworks.
 */

(function () {
  'use strict';

  /** ISO country code used for all API requests */
  const COUNTRY_CODE = 'IN';

  /** Base URL pattern: /v2/country/{code}/indicator/{id}?format=json */
  const API_BASE = 'https://api.worldbank.org/v2/country';

  /**
   * Stat definitions: primary indicator + optional fallback if archived/unavailable.
   * Units and decimals are applied when rendering.
   */
  const STAT_CONFIG = {
    co2: {
      cardSelector: '[data-stat-id="co2"]',
      indicators: ['EN.ATM.CO2E.PC', 'EN.GHG.CO2.MT.CE.AR5'],
      unitPrimary: 'metric tons per capita',
      unitFallback: 'Mt CO₂e (total)',
      decimals: 2,
      formatLarge: true
    },
    forest: {
      cardSelector: '[data-stat-id="forest"]',
      indicators: ['AG.LND.FRST.ZS'],
      unit: '% of land area',
      decimals: 1
    },
    renewable: {
      cardSelector: '[data-stat-id="renewable"]',
      indicators: ['EG.FEC.RNEW.ZS'],
      unit: '% of total fuel consumption',
      decimals: 1
    },
    water: {
      cardSelector: '[data-stat-id="water"]',
      indicators: ['SH.H2O.BASW.ZS'],
      unit: '% of population',
      decimals: 1
    }
  };

  /**
   * Build World Bank indicator URL for a country.
   * @param {string} indicatorId - e.g. EN.ATM.CO2E.PC
   * @returns {string}
   */
  function buildIndicatorUrl(indicatorId) {
    return `${API_BASE}/${COUNTRY_CODE}/indicator/${indicatorId}?format=json&per_page=30`;
  }

  /**
   * Fetch JSON from World Bank API.
   * @param {string} url
   * @returns {Promise<object[]>} Data rows (second element of API array)
   */
  async function fetchIndicatorData(url) {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const json = await response.json();

    // API error messages live in first object when indicator invalid
    if (json[0] && json[0].message && !json[1]) {
      const msg = json[0].message[0]?.value || 'Indicator unavailable';
      throw new Error(msg);
    }

    if (!Array.isArray(json) || !json[1] || !Array.isArray(json[1])) {
      throw new Error('Unexpected API response format');
    }

    return json[1];
  }

  /**
   * Pick the latest year with a non-null numeric value.
   * World Bank returns newest years first; recent years may be empty.
   * @param {object[]} rows
   * @returns {{ value: number, date: string } | null}
   */
  function getLatestValue(rows) {
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const raw = row.value;
      if (raw === null || raw === undefined || raw === '') continue;
      const num = Number(raw);
      if (!Number.isFinite(num)) continue;
      return { value: num, date: String(row.date) };
    }
    return null;
  }

  /**
   * Try primary indicator, then fallbacks in order.
   * @param {string[]} indicatorIds
   * @returns {Promise<{ value: number, date: string, indicatorUsed: string }>}
   */
  async function fetchLatestForIndicators(indicatorIds) {
    let lastError = new Error('No data available');

    for (let i = 0; i < indicatorIds.length; i++) {
      const id = indicatorIds[i];
      try {
        const rows = await fetchIndicatorData(buildIndicatorUrl(id));
        const latest = getLatestValue(rows);
        if (!latest) {
          lastError = new Error('No published values for this indicator');
          continue;
        }
        return { ...latest, indicatorUsed: id };
      } catch (err) {
        lastError = err;
      }
    }

    throw lastError;
  }

  /**
   * Format number for display (locale-aware grouping).
   * @param {number} value
   * @param {number} decimals
   * @param {boolean} useCompact - use compact notation for very large values
   */
  function formatNumber(value, decimals, useCompact) {
    if (useCompact && value >= 1000) {
      return new Intl.NumberFormat('en-IN', {
        notation: 'compact',
        maximumFractionDigits: decimals
      }).format(value);
    }
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals
    }).format(value);
  }

  /**
   * Animated count-up from 0 to target (lightweight requestAnimationFrame).
   * @param {HTMLElement} el
   * @param {number} target
   * @param {number} decimals
   * @param {boolean} useCompact
   * @param {number} durationMs
   */
  function animateValue(el, target, decimals, useCompact, durationMs) {
    const start = performance.now();
    const from = 0;

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / durationMs, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = from + (target - from) * eased;
      el.textContent = formatNumber(current, decimals, useCompact);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = formatNumber(target, decimals, useCompact);
      }
    }

    requestAnimationFrame(tick);
  }

  /**
   * Update a single stat card DOM.
   * @param {HTMLElement} card
   * @param {'loading'|'success'|'error'} state
   * @param {object} [payload]
   */
  function setCardState(card, state, payload) {
    const valueEl = card.querySelector('[data-value-el]');
    const unitEl = card.querySelector('[data-unit-el]');
    const yearEl = card.querySelector('[data-year-el]');

    valueEl.classList.remove('is-loading', 'is-error');

    if (state === 'loading') {
      valueEl.textContent = 'Loading...';
      valueEl.classList.add('is-loading');
      if (unitEl) unitEl.textContent = '';
      if (yearEl) yearEl.textContent = '';
      return;
    }

    if (state === 'error') {
      valueEl.textContent = payload?.message || 'Data unavailable';
      valueEl.classList.add('is-error');
      if (unitEl) unitEl.textContent = 'Please try again later';
      if (yearEl) yearEl.textContent = '';
      card.classList.add('live-stat-ready');
      return;
    }

    // success
    valueEl.classList.remove('is-loading');
    const { value, date, unit, decimals, useCompact } = payload;
    animateValue(valueEl, value, decimals, useCompact, 1400);

    if (unitEl) unitEl.textContent = unit;
    if (yearEl) yearEl.textContent = `Source year: ${date}`;
    card.classList.add('live-stat-ready');
  }

  /**
   * Load one statistic and bind to its card.
   * @param {string} statKey - key in STAT_CONFIG
   */
  async function loadStat(statKey) {
    const config = STAT_CONFIG[statKey];
    const card = document.querySelector(config.cardSelector);
    if (!card) return;

    setCardState(card, 'loading');

    try {
      const result = await fetchLatestForIndicators(config.indicators);
      let unit = config.unit;

      // CO₂: per-capita vs total fallback uses different units
      if (statKey === 'co2') {
        unit =
          result.indicatorUsed === 'EN.ATM.CO2E.PC'
            ? config.unitPrimary
            : config.unitFallback;
      }

      setCardState(card, 'success', {
        value: result.value,
        date: result.date,
        unit,
        decimals: config.decimals,
        useCompact: Boolean(config.formatLarge && result.value >= 1000)
      });
    } catch (err) {
      setCardState(card, 'error', {
        message: 'Unable to load live data'
      });
      console.warn(`[live-stats] ${statKey}:`, err.message || err);
    }
  }

  /**
   * Initialize all live stat cards when the section exists.
   */
  function initLiveStats() {
    const section = document.getElementById('live-stats');
    if (!section) return;

    const keys = Object.keys(STAT_CONFIG);
    keys.forEach((key) => loadStat(key));
  }

  document.addEventListener('DOMContentLoaded', initLiveStats);
})();
