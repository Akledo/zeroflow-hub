/**
 * ZeroFlow — Off-Grid Survival Estimator
 * Physics-based solar/wind/battery sizing tool using geography data and appliance load profiles.
 * LIGHTWEIGHT — no dependencies.
 */
(function () {
  'use strict';

  // --- Constants ---
  const LFP_DOD = 0.8;        // Depth of Discharge for LFP batteries
  const INEFFICIENCY = 1.25;  // Solar inefficiency factor
  const AIR_DENSITY = 1.225;  // kg/m³ at sea level
  const TURBINE_DIAMETER = 1.5; // meters for standard small wind turbine
  const TURBINE_AREA = Math.PI * Math.pow(TURBINE_DIAMETER / 2, 2); // m²
  const TURBINE_CP = 0.35;    // Coefficient of performance (Betz limit adjusted for small turbines)

  // --- PSH lookup (approximate by US state/region) ---
  const PSH_DATA = {
    'az': { name: 'Arizona', psh: 6.5, wind: 3.5 },
    'ca': { name: 'California', psh: 5.5, wind: 4.0 },
    'co': { name: 'Colorado', psh: 5.8, wind: 5.0 },
    'fl': { name: 'Florida', psh: 5.0, wind: 4.5 },
    'ga': { name: 'Georgia', psh: 4.8, wind: 3.5 },
    'hi': { name: 'Hawaii', psh: 5.5, wind: 5.5 },
    'id': { name: 'Idaho', psh: 5.0, wind: 5.5 },
    'il': { name: 'Illinois', psh: 4.2, wind: 5.0 },
    'in': { name: 'Indiana', psh: 4.0, wind: 4.5 },
    'ia': { name: 'Iowa', psh: 4.5, wind: 6.0 },
    'ks': { name: 'Kansas', psh: 5.2, wind: 6.5 },
    'ky': { name: 'Kentucky', psh: 4.0, wind: 3.5 },
    'la': { name: 'Louisiana', psh: 4.8, wind: 4.0 },
    'me': { name: 'Maine', psh: 4.0, wind: 5.0 },
    'md': { name: 'Maryland', psh: 4.5, wind: 4.0 },
    'ma': { name: 'Massachusetts', psh: 4.2, wind: 4.5 },
    'mi': { name: 'Michigan', psh: 3.8, wind: 5.0 },
    'mn': { name: 'Minnesota', psh: 4.5, wind: 5.5 },
    'ms': { name: 'Mississippi', psh: 4.5, wind: 3.5 },
    'mo': { name: 'Missouri', psh: 4.5, wind: 4.5 },
    'mt': { name: 'Montana', psh: 5.0, wind: 6.5 },
    'ne': { name: 'Nebraska', psh: 5.0, wind: 6.0 },
    'nv': { name: 'Nevada', psh: 6.0, wind: 4.5 },
    'nh': { name: 'New Hampshire', psh: 4.0, wind: 4.5 },
    'nj': { name: 'New Jersey', psh: 4.2, wind: 4.0 },
    'nm': { name: 'New Mexico', psh: 6.2, wind: 5.0 },
    'ny': { name: 'New York', psh: 3.8, wind: 4.5 },
    'nc': { name: 'North Carolina', psh: 4.5, wind: 3.5 },
    'nd': { name: 'North Dakota', psh: 4.5, wind: 6.5 },
    'oh': { name: 'Ohio', psh: 3.8, wind: 4.5 },
    'ok': { name: 'Oklahoma', psh: 5.2, wind: 6.0 },
    'or': { name: 'Oregon', psh: 4.5, wind: 5.0 },
    'pa': { name: 'Pennsylvania', psh: 3.8, wind: 4.0 },
    'ri': { name: 'Rhode Island', psh: 4.2, wind: 5.5 },
    'sc': { name: 'South Carolina', psh: 4.8, wind: 3.5 },
    'sd': { name: 'South Dakota', psh: 5.0, wind: 6.5 },
    'tn': { name: 'Tennessee', psh: 4.5, wind: 3.5 },
    'tx': { name: 'Texas', psh: 5.5, wind: 5.5 },
    'ut': { name: 'Utah', psh: 5.8, wind: 4.0 },
    'vt': { name: 'Vermont', psh: 3.8, wind: 4.5 },
    'va': { name: 'Virginia', psh: 4.2, wind: 3.5 },
    'wa': { name: 'Washington', psh: 3.5, wind: 5.0 },
    'wv': { name: 'West Virginia', psh: 3.8, wind: 4.5 },
    'wi': { name: 'Wisconsin', psh: 4.0, wind: 5.0 },
    'wy': { name: 'Wyoming', psh: 5.5, wind: 7.0 },
    'default': { name: 'Default (US Avg)', psh: 4.5, wind: 4.0 },
  };

  // --- Common appliance presets for quick load building ---
  const LOAD_PRESETS = {
    'minimal': { items: [
      { name: 'Starlink Mini', w: 40, hrs: 24 },
      { name: 'LED Lights (5)', w: 30, hrs: 6 },
      { name: 'Laptop', w: 60, hrs: 6 },
      { name: 'Phone Charging', w: 15, hrs: 4 },
      { name: 'Router', w: 15, hrs: 24 },
    ]},
    'remote-work': { items: [
      { name: 'Starlink Standard', w: 75, hrs: 24 },
      { name: 'Laptop', w: 60, hrs: 10 },
      { name: 'Monitor (27")', w: 50, hrs: 10 },
      { name: 'LED Lights (8)', w: 50, hrs: 8 },
      { name: 'Mini Fridge', w: 60, hrs: 24 },
      { name: 'Phone Charging', w: 15, hrs: 4 },
      { name: 'Ceiling Fan', w: 60, hrs: 8 },
    ]},
    'homelab-ai': { items: [
      { name: 'AI Workstation (RTX 5090)', w: 750, hrs: 12 },
      { name: 'NAS (4-bay)', w: 50, hrs: 24 },
      { name: 'Router + Switch', w: 40, hrs: 24 },
      { name: 'Monitor (32")', w: 65, hrs: 12 },
      { name: 'Starlink Standard', w: 75, hrs: 24 },
      { name: 'LED Lights (4)', w: 25, hrs: 8 },
      { name: 'Server Cooling Fan', w: 30, hrs: 12 },
    ]},
    'full-home': { items: [
      { name: 'Refrigerator (Energy Star)', w: 120, hrs: 24 },
      { name: 'Heat Pump Mini-Split (12k)', w: 900, hrs: 10 },
      { name: 'Starlink Standard', w: 75, hrs: 24 },
      { name: 'LED Lights (15)', w: 100, hrs: 8 },
      { name: 'Laptop + Monitor', w: 110, hrs: 8 },
      { name: 'Washing Machine', w: 500, hrs: 1.5 },
      { name: 'Router + Switch', w: 40, hrs: 24 },
      { name: 'Ceiling Fans (2)', w: 120, hrs: 8 },
      { name: 'TV (55" LED)', w: 100, hrs: 5 },
    ]},
  };

  // --- State ---
  let loadItems = [];

  function $(sel) { return document.querySelector(sel); }

  function init() {
    const container = $('#offgrid-estimator');
    if (!container) return;

    // Populate state dropdown
    const stateSel = container.querySelector('.og-state');
    if (stateSel) {
      Object.keys(PSH_DATA).forEach(key => {
        const d = PSH_DATA[key];
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = d.name;
        if (key === 'default') opt.selected = true;
        stateSel.appendChild(opt);
      });
    }

    // Load presets
    const presetSel = container.querySelector('.og-preset');
    if (presetSel) {
      presetSel.addEventListener('change', function () {
        const preset = LOAD_PRESETS[this.value];
        if (!preset) return;
        loadItems = preset.items.map(i => ({ ...i }));
        renderLoadTable(container);
        calculate(container);
      });
    }

    // Manual add
    container.querySelector('.og-add-btn').addEventListener('click', function () {
      const name = container.querySelector('.og-custom-name').value.trim();
      const w = parseFloat(container.querySelector('.og-custom-watts').value);
      const hrs = parseFloat(container.querySelector('.og-custom-hours').value);
      if (!name || !w || !hrs) return;
      loadItems.push({ name, w, hrs });
      renderLoadTable(container);
      calculate(container);
      container.querySelector('.og-custom-name').value = '';
      container.querySelector('.og-custom-watts').value = '';
      container.querySelector('.og-custom-hours').value = '';
    });

    // Remove items (event delegation)
    container.addEventListener('click', function (e) {
      if (e.target.classList.contains('og-remove-item')) {
        const idx = parseInt(e.target.dataset.index);
        loadItems.splice(idx, 1);
        renderLoadTable(container);
        calculate(container);
      }
    });

    // Days of autonomy
    container.querySelector('.og-autonomy').addEventListener('input', function () {
      calculate(container);
    });

    // Calculate button
    container.querySelector('.og-calc-btn').addEventListener('click', function () {
      calculate(container);
    });

    // Initial preset load
    if (presetSel) {
      presetSel.value = 'remote-work';
      presetSel.dispatchEvent(new Event('change'));
    }
  }

  function renderLoadTable(container) {
    const tbody = container.querySelector('.og-load-tbody');
    if (!tbody) return;

    if (loadItems.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="empty">No loads added. Select a preset or add manually.</td></tr>';
      return;
    }

    tbody.innerHTML = loadItems.map((item, i) => `
      <tr>
        <td>${item.name}</td>
        <td>${item.w} W</td>
        <td>${item.hrs} h/day</td>
        <td>${(item.w * item.hrs).toLocaleString()} Wh</td>
        <td><button class="btn btn-sm btn-remove og-remove-item" data-index="${i}">✕</button></td>
      </tr>
    `).join('');
  }

  function calculate(container) {
    if (loadItems.length === 0) {
      container.querySelector('.og-daily-wh').textContent = '0';
      container.querySelector('.og-solar-kw').textContent = '0';
      container.querySelector('.og-battery-kwh').textContent = '0';
      container.querySelector('.og-wind-kwh').textContent = '0';
      container.querySelector('.og-wind-viability').textContent = '—';
      return;
    }

    // Get geography
    const stateKey = container.querySelector('.og-state').value || 'default';
    const geo = PSH_DATA[stateKey] || PSH_DATA['default'];
    const psh = geo.psh;
    const windSpeed = geo.wind;

    // Custom override
    const pshOverride = parseFloat(container.querySelector('.og-psh-override').value);
    const windOverride = parseFloat(container.querySelector('.og-wind-override').value);
    const effectivePSH = pshOverride > 0 ? pshOverride : psh;
    const effectiveWind = windOverride > 0 ? windOverride : windSpeed;

    // Daily total Wh
    const dailyWh = loadItems.reduce((sum, item) => sum + item.w * item.hrs, 0);
    container.querySelector('.og-daily-wh').textContent = Math.round(dailyWh).toLocaleString();

    // Days of autonomy
    const autonomy = parseFloat(container.querySelector('.og-autonomy').value) || 3;

    // Solar array sizing (W): (Daily Wh × 1.25 inefficiency) / PSH
    const solarW = (dailyWh * INEFFICIENCY) / effectivePSH;
    container.querySelector('.og-solar-kw').textContent = (solarW / 1000).toFixed(2);

    // Battery bank sizing (Wh): (Daily Wh × Autonomy) / DoD
    const batteryWh = (dailyWh * autonomy) / LFP_DOD;
    container.querySelector('.og-battery-kwh').textContent = (batteryWh / 1000).toFixed(1);

    // Wind supplement
    let windDailyKwh = 0;
    let windViability = 'Not viable (< 4 m/s)';

    if (effectiveWind >= 4) {
      // P = 0.5 × ρ × A × v³ × Cp
      const powerW = 0.5 * AIR_DENSITY * TURBINE_AREA * Math.pow(effectiveWind, 3) * TURBINE_CP;
      windDailyKwh = (powerW * 24) / 1000; // kWh per day
      
      const pctContribution = dailyWh > 0 ? (windDailyKwh * 1000 / dailyWh) * 100 : 0;
      if (effectiveWind >= 6) {
        windViability = `Excellent — ~${Math.round(pctContribution)}% of daily load`;
      } else if (effectiveWind >= 5) {
        windViability = `Good — ~${Math.round(pctContribution)}% of daily load`;
      } else {
        windViability = `Moderate — ~${Math.round(pctContribution)}% of daily load`;
      }
    }

    container.querySelector('.og-wind-kwh').textContent = windDailyKwh.toFixed(2);
    container.querySelector('.og-wind-viability').textContent = windViability;

    // Geography display
    container.querySelector('.og-geo-psh').textContent = effectivePSH;
    container.querySelector('.og-geo-wind').textContent = effectiveWind;

    // Affiliate recommendations
    const solarRec = container.querySelector('.og-solar-rec');
    const battRec = container.querySelector('.og-batt-rec');
    const windRec = container.querySelector('.og-wind-rec');

    if (solarRec) {
      solarRec.innerHTML = `<a href="https://signaturesolar.com" class="btn btn-primary btn-sm" rel="nofollow sponsored" target="_blank">Shop Solar Panels</a> — ${(solarW / 1000).toFixed(1)} kW array recommended`;
    }
    if (battRec) {
      const battKwh = batteryWh / 1000;
      battRec.innerHTML = `<a href="/category/energy-storage/" class="btn btn-primary btn-sm">LTO / Na-Ion Batteries</a> — ${battKwh.toFixed(1)} kWh bank recommended`;
    }
    if (windRec && effectiveWind >= 4) {
      windRec.innerHTML = `<a href="/category/off-grid-systems/" class="btn btn-primary btn-sm">Micro-Wind Guides</a> — ${windDailyKwh.toFixed(1)} kWh/day expected from 1.5m turbine`;
    } else if (windRec) {
      windRec.innerHTML = `<span class="text-muted">Wind supplement not recommended at ${effectiveWind} m/s</span>`;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();