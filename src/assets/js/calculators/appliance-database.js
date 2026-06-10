/**
 * ZeroFlow — Appliance Thermal Load Map (Technical Database)
 * Searchable database of 100+ appliance power draws with BTU/hr and Wh/day calculations.
 * LIGHTWEIGHT — no dependencies.
 */
(function () {
  'use strict';

  const WATTS_TO_BTU = 3.412;

  const DB = [
    // --- Kitchen ---
    { name: 'Refrigerator (Energy Star)', cat: 'Kitchen', runningW: 120, startingW: 720, usageHrs: 24, btuHr: 409, notes: 'Modern 20 cu ft, inverter compressor' },
    { name: 'Refrigerator (Old, 15+ yr)', cat: 'Kitchen', runningW: 400, startingW: 1200, usageHrs: 24, btuHr: 1365, notes: 'Non-inverter, inefficient' },
    { name: 'Refrigerator (Mini)', cat: 'Kitchen', runningW: 60, startingW: 180, usageHrs: 24, btuHr: 205 },
    { name: 'Chest Freezer (7 cu ft)', cat: 'Kitchen', runningW: 100, startingW: 500, usageHrs: 24, btuHr: 341 },
    { name: 'Induction Hob (Single)', cat: 'Kitchen', runningW: 1800, startingW: 1800, usageHrs: 1, btuHr: 6142 },
    { name: 'Induction Hob (Double)', cat: 'Kitchen', runningW: 3500, startingW: 3500, usageHrs: 1, btuHr: 11942 },
    { name: 'Electric Oven', cat: 'Kitchen', runningW: 2400, startingW: 2400, usageHrs: 1.5, btuHr: 8189 },
    { name: 'Microwave (Standard)', cat: 'Kitchen', runningW: 1200, startingW: 1200, usageHrs: 0.5, btuHr: 4094 },
    { name: 'Coffee Maker (Drip)', cat: 'Kitchen', runningW: 900, startingW: 900, usageHrs: 0.5, btuHr: 3071 },
    { name: 'Coffee Maker (Espresso)', cat: 'Kitchen', runningW: 1400, startingW: 1400, usageHrs: 0.3, btuHr: 4777 },
    { name: 'Dishwasher (Energy Star)', cat: 'Kitchen', runningW: 800, startingW: 1400, usageHrs: 2, btuHr: 2730 },
    { name: 'Electric Kettle', cat: 'Kitchen', runningW: 1500, startingW: 1500, usageHrs: 0.3, btuHr: 5118 },
    { name: 'Toaster', cat: 'Kitchen', runningW: 1200, startingW: 1200, usageHrs: 0.2, btuHr: 4094 },
    { name: 'Instant Pot', cat: 'Kitchen', runningW: 1000, startingW: 1000, usageHrs: 1, btuHr: 3412 },
    { name: 'Air Fryer', cat: 'Kitchen', runningW: 1500, startingW: 1500, usageHrs: 0.75, btuHr: 5118 },
    { name: 'Garbage Disposal', cat: 'Kitchen', runningW: 600, startingW: 1200, usageHrs: 0.1, btuHr: 2047 },
    { name: 'Range Hood', cat: 'Kitchen', runningW: 150, startingW: 300, usageHrs: 2, btuHr: 512 },

    // --- Climate / HVAC ---
    { name: 'Heat Pump (Inverter, 3 ton)', cat: 'Climate', runningW: 1500, startingW: 4500, usageHrs: 10, btuHr: 36000, notes: 'SEER2 > 20, variable speed' },
    { name: 'Heat Pump (Single-Stage, 3 ton)', cat: 'Climate', runningW: 3500, startingW: 7000, usageHrs: 10, btuHr: 36000, notes: 'Older model, constant run' },
    { name: 'Mini-Split (12,000 BTU)', cat: 'Climate', runningW: 900, startingW: 2700, usageHrs: 10, btuHr: 12000, notes: 'Inverter drive' },
    { name: 'Mini-Split (24,000 BTU)', cat: 'Climate', runningW: 1800, startingW: 5400, usageHrs: 10, btuHr: 24000, notes: 'Dual zone' },
    { name: 'Window AC (8,000 BTU)', cat: 'Climate', runningW: 800, startingW: 1600, usageHrs: 8, btuHr: 8000 },
    { name: 'Window AC (12,000 BTU)', cat: 'Climate', runningW: 1200, startingW: 2400, usageHrs: 8, btuHr: 12000 },
    { name: 'Dehumidifier (50 pt)', cat: 'Climate', runningW: 500, startingW: 500, usageHrs: 12, btuHr: 1706 },
    { name: 'Dehumidifier (70 pt)', cat: 'Climate', runningW: 700, startingW: 700, usageHrs: 12, btuHr: 2388 },
    { name: 'Ceiling Fan', cat: 'Climate', runningW: 60, startingW: 60, usageHrs: 8, btuHr: 205 },
    { name: 'Space Heater (Electric)', cat: 'Climate', runningW: 1500, startingW: 1500, usageHrs: 4, btuHr: 5118 },
    { name: 'Whole-House Fan', cat: 'Climate', runningW: 500, startingW: 500, usageHrs: 4, btuHr: 1706 },
    { name: 'Air Purifier (HEPA)', cat: 'Climate', runningW: 55, startingW: 55, usageHrs: 24, btuHr: 188 },
    { name: 'Humidifier (Ultrasonic)', cat: 'Climate', runningW: 40, startingW: 40, usageHrs: 10, btuHr: 136 },
    { name: 'HRV/ERV', cat: 'Climate', runningW: 120, startingW: 360, usageHrs: 24, btuHr: 409 },

    // --- Computing / AI ---
    { name: 'AI Workstation (Single RTX 5090)', cat: 'Computing', runningW: 750, startingW: 750, usageHrs: 12, btuHr: 2559, notes: 'Max load, single GPU' },
    { name: 'AI Workstation (Dual RTX 5090)', cat: 'Computing', runningW: 1400, startingW: 1400, usageHrs: 12, btuHr: 4777, notes: 'Dual GPU rendering' },
    { name: 'AI Workstation (4× RTX 5090)', cat: 'Computing', runningW: 2800, startingW: 2800, usageHrs: 12, btuHr: 9554, notes: 'Cluster node' },
    { name: 'Gaming PC (Mid-Range)', cat: 'Computing', runningW: 400, startingW: 400, usageHrs: 6, btuHr: 1365 },
    { name: 'Gaming PC (High-End)', cat: 'Computing', runningW: 700, startingW: 700, usageHrs: 6, btuHr: 2388 },
    { name: 'Mac Studio (M3 Ultra)', cat: 'Computing', runningW: 180, startingW: 180, usageHrs: 10, btuHr: 614 },
    { name: 'NAS (4-bay)', cat: 'Computing', runningW: 50, startingW: 80, usageHrs: 24, btuHr: 171 },
    { name: 'NAS (8-bay)', cat: 'Computing', runningW: 90, startingW: 150, usageHrs: 24, btuHr: 307 },
    { name: 'Server Rack (42U, Full)', cat: 'Computing', runningW: 3500, startingW: 5000, usageHrs: 24, btuHr: 11942, notes: 'Full load with cooling' },
    { name: 'Server (Single, Tower)', cat: 'Computing', runningW: 300, startingW: 500, usageHrs: 24, btuHr: 1024 },
    { name: 'Monitor (32" 4K)', cat: 'Computing', runningW: 65, startingW: 65, usageHrs: 10, btuHr: 222 },
    { name: 'Monitor (Ultrawide 49")', cat: 'Computing', runningW: 100, startingW: 100, usageHrs: 10, btuHr: 341 },
    { name: 'Laptop (Charging)', cat: 'Computing', runningW: 90, startingW: 90, usageHrs: 8, btuHr: 307 },
    { name: 'Switch (48-port PoE)', cat: 'Computing', runningW: 250, startingW: 250, usageHrs: 24, btuHr: 853 },
    { name: 'Router (WiFi 6E)', cat: 'Computing', runningW: 25, startingW: 25, usageHrs: 24, btuHr: 85 },

    // --- Connectivity / Comms ---
    { name: 'Starlink (Standard)', cat: 'Connectivity', runningW: 75, startingW: 100, usageHrs: 24, btuHr: 256, notes: 'Gen 3 dish + router' },
    { name: 'Starlink (FHP / High Performance)', cat: 'Connectivity', runningW: 150, startingW: 200, usageHrs: 24, btuHr: 512, notes: 'Flat High Performance' },
    { name: 'Starlink (Mini)', cat: 'Connectivity', runningW: 40, startingW: 60, usageHrs: 24, btuHr: 136 },
    { name: 'LoRa Gateway (Meshtastic)', cat: 'Connectivity', runningW: 3, startingW: 3, usageHrs: 24, btuHr: 10, notes: 'Solar-friendly' },
    { name: 'Cable Modem', cat: 'Connectivity', runningW: 10, startingW: 10, usageHrs: 24, btuHr: 34 },
    { name: 'Cellular Modem (5G)', cat: 'Connectivity', runningW: 20, startingW: 30, usageHrs: 24, btuHr: 68 },
    { name: 'Ubiquiti Dream Machine', cat: 'Connectivity', runningW: 30, startingW: 30, usageHrs: 24, btuHr: 102 },

    // --- Off-Grid / Energy ---
    { name: 'Solar Inverter (Grid-Tie, 5kW)', cat: 'Energy', runningW: 50, startingW: 50, usageHrs: 6, btuHr: 171, notes: 'Standby power' },
    { name: 'Solar Inverter (Off-Grid, 6kW)', cat: 'Energy', runningW: 60, startingW: 120, usageHrs: 24, btuHr: 205, notes: 'Idle draw' },
    { name: 'MPPT Charge Controller (60A)', cat: 'Energy', runningW: 5, startingW: 5, usageHrs: 24, btuHr: 17 },
    { name: 'Battery BMS (LFP, 48V)', cat: 'Energy', runningW: 3, startingW: 3, usageHrs: 24, btuHr: 10 },

    // --- Medical / Biohacking ---
    { name: 'HBOT Compressor (Mild)', cat: 'Medical', runningW: 600, startingW: 1200, usageHrs: 2, btuHr: 2047, notes: '1.3 ATA, soft shell' },
    { name: 'HBOT Compressor (Hard Shell)', cat: 'Medical', runningW: 1500, startingW: 3000, usageHrs: 1.5, btuHr: 5118, notes: '2.0 ATA' },
    { name: 'Oxygen Concentrator', cat: 'Medical', runningW: 350, startingW: 500, usageHrs: 12, btuHr: 1194 },
    { name: 'CPAP Machine', cat: 'Medical', runningW: 60, startingW: 100, usageHrs: 8, btuHr: 205 },
    { name: 'Red Light Therapy Panel', cat: 'Medical', runningW: 200, startingW: 200, usageHrs: 1, btuHr: 682 },
    { name: 'Cold Plunge Chiller', cat: 'Medical', runningW: 400, startingW: 700, usageHrs: 8, btuHr: 1365, notes: 'Maintains 39°F' },
    { name: 'Sauna Heater (Infrared)', cat: 'Medical', runningW: 1600, startingW: 1600, usageHrs: 1, btuHr: 5459 },

    // --- Workshop / Tools ---
    { name: 'Table Saw', cat: 'Workshop', runningW: 1800, startingW: 3600, usageHrs: 0.5, btuHr: 6142 },
    { name: 'Miter Saw', cat: 'Workshop', runningW: 1500, startingW: 3000, usageHrs: 0.5, btuHr: 5118 },
    { name: 'Air Compressor (2 HP)', cat: 'Workshop', runningW: 1500, startingW: 3000, usageHrs: 1, btuHr: 5118 },
    { name: 'Welder (MIG)', cat: 'Workshop', runningW: 4000, startingW: 4000, usageHrs: 1, btuHr: 13648 },
    { name: '3D Printer (FDM)', cat: 'Workshop', runningW: 250, startingW: 250, usageHrs: 6, btuHr: 853 },
    { name: '3D Printer (Resin)', cat: 'Workshop', runningW: 150, startingW: 150, usageHrs: 6, btuHr: 512 },
    { name: 'CNC Router (Desktop)', cat: 'Workshop', runningW: 500, startingW: 1000, usageHrs: 3, btuHr: 1706 },
    { name: 'Laser Cutter (40W CO2)', cat: 'Workshop', runningW: 400, startingW: 400, usageHrs: 3, btuHr: 1365 },
    { name: 'Laser Cutter (100W CO2)', cat: 'Workshop', runningW: 1200, startingW: 1200, usageHrs: 3, btuHr: 4094 },

    // --- Home Essentials ---
    { name: 'Washing Machine', cat: 'Home', runningW: 500, startingW: 500, usageHrs: 1.5, btuHr: 1706 },
    { name: 'Clothes Dryer (Electric)', cat: 'Home', runningW: 3000, startingW: 3000, usageHrs: 1.5, btuHr: 10236 },
    { name: 'Clothes Dryer (Heat Pump)', cat: 'Home', runningW: 800, startingW: 800, usageHrs: 2, btuHr: 2730 },
    { name: 'Water Heater (Electric, 50 gal)', cat: 'Home', runningW: 4500, startingW: 4500, usageHrs: 3, btuHr: 15354 },
    { name: 'Water Heater (Heat Pump)', cat: 'Home', runningW: 700, startingW: 700, usageHrs: 3, btuHr: 2388 },
    { name: 'Water Heater (Tankless Electric)', cat: 'Home', runningW: 12000, startingW: 12000, usageHrs: 1, btuHr: 40944 },
    { name: 'Vacuum Cleaner', cat: 'Home', runningW: 800, startingW: 1200, usageHrs: 0.5, btuHr: 2730 },
    { name: 'Robot Vacuum', cat: 'Home', runningW: 40, startingW: 40, usageHrs: 2, btuHr: 136 },
    { name: 'Treadmill', cat: 'Home', runningW: 600, startingW: 1200, usageHrs: 1, btuHr: 2047 },
    { name: 'EV Charger (Level 2, 48A)', cat: 'Home', runningW: 11500, startingW: 11500, usageHrs: 4, btuHr: 39238 },
    { name: 'EV Charger (Level 1)', cat: 'Home', runningW: 1440, startingW: 1440, usageHrs: 12, btuHr: 4913 },
    { name: 'Smart TV (65" OLED)', cat: 'Home', runningW: 150, startingW: 150, usageHrs: 6, btuHr: 512 },
    { name: 'Game Console (PS5/XSX)', cat: 'Home', runningW: 200, startingW: 200, usageHrs: 4, btuHr: 682 },
    { name: 'Soundbar + Sub', cat: 'Home', runningW: 50, startingW: 50, usageHrs: 6, btuHr: 171 },
  ];

  // --- State ---
  let filtered = [...DB];
  let selected = [];

  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return document.querySelectorAll(sel); }

  function init() {
    const container = $('#appliance-db');
    if (!container) return;

    renderTable(DB);
    bindEvents(container);
    updateCategoryCounts();
  }

  function bindEvents(container) {
    // Search
    const searchInput = container.querySelector('.db-search');
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        applyFilters(container);
      });
    }

    // Category filter
    const catFilter = container.querySelector('.db-category-filter');
    if (catFilter) {
      catFilter.addEventListener('change', function () {
        applyFilters(container);
      });
    }

    // Sort
    const sortSelect = container.querySelector('.db-sort');
    if (sortSelect) {
      sortSelect.addEventListener('change', function () {
        applyFilters(container);
      });
    }

    // Estimate button
    container.addEventListener('click', function (e) {
      if (e.target.classList.contains('db-add-btn')) {
        const idx = parseInt(e.target.dataset.index);
        const item = filtered[idx];
        if (item && !selected.find(s => s.name === item.name)) {
          selected.push({ ...item });
          updateEstimator(container);
        }
      }
      if (e.target.classList.contains('db-remove-item')) {
        const name = e.target.dataset.name;
        selected = selected.filter(s => s.name !== name);
        updateEstimator(container);
      }
    });

    // Hours adjustment
    container.addEventListener('change', function (e) {
      if (e.target.classList.contains('db-hours-input')) {
        const name = e.target.dataset.name;
        const hrs = parseFloat(e.target.value) || 0;
        const item = selected.find(s => s.name === name);
        if (item) item.usageHrs = hrs;
        updateEstimator(container);
      }
    });
  }

  function applyFilters(container) {
    const search = (container.querySelector('.db-search').value || '').toLowerCase();
    const category = container.querySelector('.db-category-filter').value;
    const sort = container.querySelector('.db-sort').value;

    filtered = DB.filter(item => {
      if (category && item.cat !== category) return false;
      if (search && !item.name.toLowerCase().includes(search) && !item.cat.toLowerCase().includes(search)) return false;
      return true;
    });

    // Sort
    if (sort === 'watts-asc') filtered.sort((a, b) => a.runningW - b.runningW);
    else if (sort === 'watts-desc') filtered.sort((a, b) => b.runningW - a.runningW);
    else if (sort === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === 'btu') filtered.sort((a, b) => b.btuHr - a.btuHr);

    renderTable(filtered);
  }

  function renderTable(items) {
    const tbody = document.querySelector('.db-tbody');
    if (!tbody) return;

    if (items.length === 0) {
      tbody.innerHTML = '<tr class="db-empty"><td colspan="6">No appliances match your filters.</td></tr>';
      document.querySelector('.db-count').textContent = '0';
      return;
    }

    document.querySelector('.db-count').textContent = items.length;

    tbody.innerHTML = items.map((item, i) => `
      <tr>
        <td><strong>${item.name}</strong>${item.notes ? `<br><small>${item.notes}</small>` : ''}</td>
        <td>${item.cat}</td>
        <td>${item.runningW}</td>
        <td>${item.startingW}</td>
        <td>${item.btuHr.toLocaleString()}</td>
        <td><button class="btn btn-sm db-add-btn" data-index="${i}">+ Add</button></td>
      </tr>
    `).join('');
  }

  function updateCategoryCounts() {
    const select = document.querySelector('.db-category-filter');
    if (!select) return;
    const counts = {};
    DB.forEach(item => { counts[item.cat] = (counts[item.cat] || 0) + 1; });
    const opt = select.querySelector('option[value=""]');
    if (opt) opt.textContent = `All Categories (${DB.length})`;
    select.querySelectorAll('option[value!=""]').forEach(opt => {
      if (counts[opt.value]) opt.textContent = `${opt.value} (${counts[opt.value]})`;
    });
  }

  function updateEstimator(container) {
    const list = container.querySelector('.db-estimator-list');
    const totalWh = container.querySelector('.est-total-wh');
    const totalBtu = container.querySelector('.est-total-btu');
    const totalW = container.querySelector('.est-total-watts');

    if (!list) return;

    if (selected.length === 0) {
      list.innerHTML = '<p class="empty-estimator">Click "+ Add" on appliances above to build your load profile.</p>';
      if (totalWh) totalWh.textContent = '0';
      if (totalBtu) totalBtu.textContent = '0';
      if (totalW) totalW.textContent = '0';
      return;
    }

    let sumWh = 0;
    let sumBtu = 0;
    let sumW = 0;

    list.innerHTML = selected.map(item => {
      const wh = item.runningW * item.usageHrs;
      const btu = wh * WATTS_TO_BTU;
      sumWh += wh;
      sumBtu += btu;
      sumW += item.runningW;
      return `
        <div class="est-item">
          <span class="est-name">${item.name}</span>
          <span class="est-detail">${item.runningW}W × ${item.usageHrs}h = ${Math.round(wh)} Wh/day</span>
          <input type="number" class="db-hours-input" data-name="${item.name}" value="${item.usageHrs}" step="0.5" min="0" max="24">
          <button class="btn btn-sm btn-remove db-remove-item" data-name="${item.name}">✕</button>
        </div>
      `;
    }).join('');

    if (totalWh) totalWh.textContent = Math.round(sumWh).toLocaleString();
    if (totalBtu) totalBtu.textContent = Math.round(sumBtu).toLocaleString();
    if (totalW) totalW.textContent = Math.round(sumW).toLocaleString();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();