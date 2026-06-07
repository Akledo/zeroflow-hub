/**
 * ZeroFlow — Cloud Exit ROI Calculator
 * Calculates break-even point and 5-year ROI for running local AI/homelab vs cloud services.
 * LIGHTWEIGHT — no dependencies.
 */
(function () {
  'use strict';

  // --- Default constants ---
  const DEFAULT_KWH_RATE = 0.16;
  const HOURS_PER_MONTH = 720; // 30 days × 24h

  // --- Hardware presets ---
  const HARDWARE_PRESETS = {
    'local-titan': { name: 'The Local Titan AI Rig', cost: 5200, idleW: 60, loadW: 450 },
    'privacy-nas': { name: 'The Privacy NAS', cost: 800, idleW: 25, loadW: 80 },
    'rtx5090-cluster': { name: 'RTX 5090 4x Cluster', cost: 16800, idleW: 240, loadW: 1800 },
    'custom': { name: 'Custom Build', cost: 3000, idleW: 100, loadW: 350 },
  };

  // --- Cloud services input defaults ---
  const CLOUD_DEFAULTS = {
    icloud: { label: 'iCloud+', default: 2.99 },
    googlePhotos: { label: 'Google Photos/Drive', default: 1.99 },
    dropbox: { label: 'Dropbox', default: 9.99 },
    openai: { label: 'OpenAI API (monthly)', default: 20 },
    claude: { label: 'Claude API (monthly)', default: 20 },
    githubCopilot: { label: 'GitHub Copilot', default: 10 },
    otherCloud: { label: 'Other Cloud Services', default: 0 },
  };

  // --- DOM refs ---
  let els = {};

  function $(sel) { return document.querySelector(sel); }

  function init() {
    // Bail if not on calculator page
    const container = $('#cloud-exit-calc');
    if (!container) return;

    // Cache elements
    els.container = container;
    els.form = container.querySelector('.calc-form');
    els.results = container.querySelector('.calc-results');
    els.breakEven = container.querySelector('.result-breakeven');
    els.roi5yr = container.querySelector('.result-roi5yr');
    els.monthlySavings = container.querySelector('.result-monthly');
    els.totalCloud = container.querySelector('.result-total-cloud');
    els.operatingCost = container.querySelector('.result-operating');
    els.detailRows = container.querySelector('.detail-rows');

    // Populate cloud inputs
    const cloudList = container.querySelector('.cloud-service-list');
    if (cloudList) {
      Object.keys(CLOUD_DEFAULTS).forEach(key => {
        const svc = CLOUD_DEFAULTS[key];
        const row = document.createElement('div');
        row.className = 'cloud-row';
        row.innerHTML = `
          <label for="cloud-${key}">${svc.label}</label>
          <span class="input-group">
            <span class="currency-symbol">$</span>
            <input type="number" id="cloud-${key}" class="cloud-input" data-key="${key}" step="0.01" min="0" value="${svc.default}">
            <span class="input-suffix">/mo</span>
          </span>
        `;
        cloudList.appendChild(row);
      });
    }

    // Populate hardware presets
    const presetSelect = container.querySelector('#hardware-preset');
    if (presetSelect) {
      Object.keys(HARDWARE_PRESETS).forEach(key => {
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = HARDWARE_PRESETS[key].name + ' ($' + HARDWARE_PRESETS[key].cost.toLocaleString() + ')';
        presetSelect.appendChild(opt);
      });

      presetSelect.addEventListener('change', function () {
        const preset = HARDWARE_PRESETS[this.value];
        if (!preset) return;
        container.querySelector('#hardware-cost').value = preset.cost;
        container.querySelector('#idle-watts').value = preset.idleW;
        container.querySelector('#load-watts').value = preset.loadW;
      });

      // Trigger default
      presetSelect.value = 'local-titan';
      presetSelect.dispatchEvent(new Event('change'));
    }

    // Set default kWh rate
    const kwhInput = container.querySelector('#kwh-rate');
    if (kwhInput) kwhInput.value = DEFAULT_KWH_RATE;

    // Bind calculate
    els.form.addEventListener('submit', function (e) {
      e.preventDefault();
      calculate();
    });

    // Auto-calculate on input change
    els.form.addEventListener('input', function () {
      calculate();
    });

    // Initial calc
    calculate();
  }

  function calculate() {
    // Gather cloud spend
    let totalCloudMonthly = 0;
    els.container.querySelectorAll('.cloud-input').forEach(inp => {
      totalCloudMonthly += parseFloat(inp.value) || 0;
    });

    // Hardware investment
    const hardwareCost = parseFloat(els.container.querySelector('#hardware-cost').value) || 3000;
    const idleW = parseFloat(els.container.querySelector('#idle-watts').value) || 100;
    const loadW = parseFloat(els.container.querySelector('#load-watts').value) || 350;
    const kwhRate = parseFloat(els.container.querySelector('#kwh-rate').value) || DEFAULT_KWH_RATE;
    const loadHours = parseFloat(els.container.querySelector('#load-hours').value) || 8;

    // Operating cost: idle (24-load) + load hours
    const idleHours = HOURS_PER_MONTH - loadHours * 30; // assume load hours daily
    const monthlyKwh = (idleW * idleHours + loadW * loadHours * 30) / 1000;
    const operatingMonthly = monthlyKwh * kwhRate;

    // Savings
    const netMonthlySavings = totalCloudMonthly - operatingMonthly;

    // Break-even
    const breakEvenMonths = netMonthlySavings > 0 ? hardwareCost / netMonthlySavings : Infinity;

    // 5-year ROI
    const totalSaved5yr = netMonthlySavings * 60 - hardwareCost;

    // Render results
    els.totalCloud.textContent = '$' + totalCloudMonthly.toFixed(2);
    els.operatingCost.textContent = '$' + operatingMonthly.toFixed(2);
    els.monthlySavings.textContent = netMonthlySavings > 0 ? '+$' + netMonthlySavings.toFixed(2) : '-$' + Math.abs(netMonthlySavings).toFixed(2);
    els.monthlySavings.className = 'value-' + (netMonthlySavings > 0 ? 'positive' : 'negative');

    if (netMonthlySavings > 0) {
      const years = breakEvenMonths / 12;
      const monthsRem = Math.round(breakEvenMonths % 12);
      const yrStr = years >= 1 ? Math.floor(years) + ' yr ' : '';
      els.breakEven.textContent = yrStr + monthsRem + ' months';
      els.roi5yr.textContent = totalSaved5yr > 0 ? '+$' + totalSaved5yr.toLocaleString(undefined, { maximumFractionDigits: 0 }) : '-$' + Math.abs(totalSaved5yr).toLocaleString(undefined, { maximumFractionDigits: 0 });
      els.roi5yr.className = totalSaved5yr > 0 ? 'value-positive' : 'value-negative';
    } else {
      els.breakEven.textContent = 'N/A (no savings)';
      els.roi5yr.textContent = 'N/A';
      els.roi5yr.className = '';
    }

    // Detail rows
    els.detailRows.innerHTML = `
      <tr><td>Cloud Spend (Monthly)</td><td>$${totalCloudMonthly.toFixed(2)}</td></tr>
      <tr><td>Power Cost (Monthly)</td><td>$${operatingMonthly.toFixed(2)}</td></tr>
      <tr><td>Monthly kWh Used</td><td>${monthlyKwh.toFixed(1)} kWh</td></tr>
      <tr><td>Hardware Investment</td><td>$${hardwareCost.toLocaleString()}</td></tr>
    `;
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();