#!/usr/bin/env python3
"""Build 7 Phase 11 lead magnet landing pages with MailerLite placeholders."""
import os, shutil

SITE_CONTENT = "/home/team/shared/zeroflow-hub/src/content"
SITE_PAGES = "/home/team/shared/zeroflow-hub/src"
SITE_IMAGES = "/home/team/shared/zeroflow-hub/src/assets/images"
SHARED_IMAGES = "/home/team/shared/assets/lead-magnets"
EXISTING_SITE_LM = "/home/team/shared/zeroflow-hub/src/assets/lead-magnets"

# Copy all cover images to site assets/images
for f in os.listdir(SHARED_IMAGES):
    if f.endswith(".png"):
        shutil.copy2(os.path.join(SHARED_IMAGES, f), os.path.join(SITE_IMAGES, f))
        print(f"✅ Copied {f}")

# Also copy existing lead magnet images
if os.path.exists(EXISTING_SITE_LM):
    for f in os.listdir(EXISTING_SITE_LM):
        if f.endswith(".png"):
            shutil.copy2(os.path.join(EXISTING_SITE_LM, f), os.path.join(SITE_IMAGES, f))
            print(f"✅ Copied existing {f}")

# Landing page templates with technical content
landing_pages = [
    {
        "slug": "cloud-exit-roi-lead-magnet",
        "hero": "/assets/images/cloud-exit-roi-cover.png",
        "title": "Cloud Exit ROI Calculator — Get the Spreadsheet",
        "desc": "Download the interactive Cloud Exit ROI spreadsheet. Compare your actual SaaS costs vs local hardware TCO with break-even analysis.",
        "category": "AI Tools",
        "h1": "📊 Cloud Exit ROI Calculator",
        "intro": "Stop renting your data. This interactive spreadsheet models the exact month your Local Titan AI Rig or Privacy NAS pays for itself.",
        "spec_section": "### The Math Behind It\n- **SaaS Baseline:** $20/mo per service (ChatGPT, Midjourney, Claude)\n- **Hardware Tiers:** RTX 3060 ($300), RTX 4070 Ti Super ($800), RTX 4090 ($1,800)\n- **Break-even:** Typically 14-18 months for prosumer setups\n- **Formula:** `Local ROI = Hardware + (kW × hrs/day × 365 × 3 × $/kWh)`"
    },
    {
        "slug": "geothermal-feasibility-scorecard",
        "hero": "/assets/images/geothermal-scorecard-cover.png",
        "title": "Geothermal Feasibility Scorecard — Download",
        "desc": "Download the Geothermal Feasibility Scorecard. Assess your property for ground-source heat pump installation with our technical checklist.",
        "category": "Renewable HVAC",
        "h1": "🌡️ Geothermal Feasibility Scorecard",
        "intro": "Is your property suitable for a ground-source heat pump? This technical scorecard walks you through space requirements, soil conditions, and ROI projections.",
        "spec_section": "### Key Metrics\n- **Horizontal Loop:** 1,500–3,000 sq ft per ton\n- **Vertical Loop:** 15–20 ft spacing, 200–500 ft boreholes\n- **Capacity Formula:** `Required Tons = Home Sq Ft / 500`\n- **Efficiency:** COP 3.0–5.0 vs 0.95 for gas"
    },
    {
        "slug": "digital-faraday-blueprint",
        "hero": "/assets/images/faraday-blueprint-cover.png",
        "title": "Digital Faraday Blueprint — Mesh & NAS Guide",
        "desc": "Download the Digital Faraday Blueprint. Everything you need for resilient communications: Meshtastic mesh networks and local NAS backup.",
        "category": "Off-Grid Comms",
        "h1": "🔒 Digital Faraday Blueprint",
        "intro": "Build a resilient communications infrastructure that survives infrastructure outages. This blueprint covers Meshtastic mesh networking and local NAS backup.",
        "spec_section": "### Technical Specs\n- **Meshtastic Range:** Urban 0.5–2 mi, Rural LOS 10–20 mi\n- **NAS Sizing:** `(Users × 50GB Photos) + (Users × 200GB Video) × 1.5 RAID`\n- **Recommended:** Raspberry Pi 5 + 8TB HDD + RAID 1"
    },
    {
        "slug": "20a-dedicated-circuit-protocol",
        "hero": "/assets/images/20a-safety-protocol-cover.png",
        "title": "20A Dedicated Circuit DIY Protocol — Download",
        "desc": "Download the 20A Dedicated Circuit DIY Protocol. Safety checklist for wiring high-draw hardware: heat pumps, servers, and AI workstations.",
        "category": "Home Resilience",
        "h1": "⚡ 20A Dedicated Circuit DIY Protocol",
        "intro": "Safe electrical installation for high-draw hardware. Follow this protocol when wiring dedicated circuits for heat pumps, servers, and AI workstations.",
        "spec_section": "### Safety Rules\n- **The 80% Rule:** Max 16A continuous on a 20A breaker\n- **Wire Gauge:** 12 AWG mandatory — never use 14 AWG\n- **Voltage Drop:** `V_drop = (2 × L × R × I) / 1000` — keep under 3%"
    },
    {
        "slug": "hems-interoperability-matrix",
        "hero": "/assets/images/hems-matrix-cover.png",
        "title": "HEMS Interoperability Matrix — Smart Home Guide",
        "desc": "Download the HEMS Interoperability Matrix. Compare Matter, Zigbee, Z-Wave, and WiFi for your energy management system.",
        "category": "Home Automation",
        "h1": "🏠 HEMS Interoperability Matrix",
        "intro": "Choose the right smart home protocol for your Home Energy Management System. This matrix compares Matter, Zigbee, Z-Wave, and WiFi across key criteria.",
        "spec_section": "### Protocol Comparison\n- **Matter:** Local-only, Thread-based, zero latency ✅\n- **Zigbee:** Low power, high compatibility, requires hub\n- **Z-Wave:** Best range, 908 MHz, proprietary\n- **WiFi:** Cloud-dependent — avoid for sovereignty"
    },
    {
        "slug": "winter-solar-sizing-guide",
        "hero": "/assets/images/solar-sizing-cover.png",
        "title": "Worst-Case Solar Sizing Guide — Winter Edition",
        "desc": "Download the Winter Solar Sizing Guide. Ensure year-round power with December solstice calculations for your off-grid solar array.",
        "category": "Energy Tech",
        "h1": "☀️ Worst-Case Solar Sizing (Winter Solstice)",
        "intro": "Most solar systems fail in winter. This guide uses December solstice Peak Sun Hours to properly size your array for year-round energy independence.",
        "spec_section": "### Winter Math\n- **PSH December:** Northern US 1.5–2.5 hrs, Southern US 3.0–4.0 hrs\n- **Formula:** `Panels = (Daily Wh / PSH) / Panel W / 0.8`\n- **Efficiency Loss:** 20% buffer for inverter, wiring, temperature"
    },
    {
        "slug": "water-sovereignty-rainfall-audit",
        "hero": "/assets/images/water-sovereignty-audit-cover.png",
        "title": "Water Sovereignty Rainfall Audit — Catchment Calculator",
        "desc": "Download the Water Sovereignty Rainfall Audit. Calculate your rainwater catchment potential with our technical audit spreadsheet.",
        "category": "Water Systems",
        "h1": "💧 Water Sovereignty Rainfall Audit",
        "intro": "How much water can you collect from your roof? This audit calculates catchment potential based on your local rainfall data and roof area.",
        "spec_section": "### Catchment Math\n- **Yield Formula:** `Gallons = Area (sq ft) × Rainfall (in) × 0.623`\n- **Efficiency Loss:** Subtract 10% for first-flush diverters\n- **Example:** 2,000 sq ft roof × 30 in/yr × 0.623 = 37,380 gal/yr"
    },
]

for lp in landing_pages:
    body = f"""---
layout: layouts/base.njk
title: "{lp['title']}"
description: "{lp['desc']}"
schemaType: "WebPage"
showSidebar: false
---

<article class="zf-landing">
  <header class="zf-landing-header">
    <h1>{lp['h1']}</h1>
    <p class="zf-landing-intro">{lp['intro']}</p>
  </header>

  <div class="zf-landing-grid">
    <div class="zf-landing-content">
      <section class="zf-landing-specs">
        {lp['spec_section']}
      </section>

      <section class="zf-landing-features">
        <h3>What's Inside</h3>
        <ul>
          <li>Ready-to-use spreadsheet with pre-built formulas</li>
          <li>Step-by-step instructions for data entry</li>
          <li>Automated calculations and visualizations</li>
          <li>Reference tables for key constants</li>
        </ul>
      </section>
    </div>

    <aside class="zf-landing-form">
      <div class="zf-landing-card">
        <img src="{lp['hero']}" alt="{lp['title']}" class="zf-lead-cover" loading="eager" width="400" height="560">

        <div class="zf-mailerlite-placeholder" aria-label="Email signup form">
          <h3>📥 Get Your Free Download</h3>
          <p>Enter your email below and we'll send the spreadsheet straight to your inbox.</p>
          
          <!-- MailerLite Form Embed Placeholder -->
          <div class="zf-form-group">
            <label for="ml-name-{lp['slug']}">Your Name</label>
            <input type="text" id="ml-name-{lp['slug']}" class="zf-input" placeholder="First name" disabled>
          </div>
          <div class="zf-form-group">
            <label for="ml-email-{lp['slug']}">Email Address</label>
            <input type="email" id="ml-email-{lp['slug']}" class="zf-input" placeholder="your@email.com" disabled>
          </div>
          <button class="zf-btn" disabled>Send Me the Download →</button>
          <p class="zf-form-disclaimer">No spam. Unsubscribe anytime.</p>
          <!-- TODO: Replace with actual MailerLite embed code -->
        </div>
      </div>
    </aside>
  </div>
</article>
"""
    
    filepath = os.path.join(SITE_PAGES, f"{lp['slug']}.njk")
    with open(filepath, 'w') as f:
        f.write(body)
    print(f"✅ Created {lp['slug']}.njk")

print("\n✅ All 7 landing pages created!")