---
layout: layouts/article.njk
title: "BMS Configuration Guide for Sodium-Ion Batteries: Bridging the 1.5V Gap"
description: "A technical guide to configuring prosumer BMS units (JBD, Daly, JK) for Sodium-Ion chemistry. Learn why LFP settings fail and how to exploit the zero-volt safety ROI."
date: 2026-06-18
category: "Energy Tech"
author: "ZeroFlow Editorial Team"
tags:
  - "Sodium-Ion"
  - "BMS"
  - "Energy Storage"
  - "DIY"
keywords: "sodium-ion BMS configuration, Na-Ion voltage settings, JBD BMS sodium-ion, Daly BMS sodium-ion, JK BMS sodium-ion, zero-volt battery storage"
heroImage: "/assets/images/articles/sodium-ion-bms-protocol-hero.png"
---

# BMS Configuration Guide for Sodium-Ion Batteries: Bridging the 1.5V Gap

As prosumers pivot from Lithium Iron Phosphate (LFP) to **Sodium-Ion (Na-Ion)** for cold-weather performance and safety, the most common technical failure occurs at the Battery Management System (BMS). 

Most off-the-shelf BMS units are hardcoded for the LFP voltage curve (2.5V – 3.65V). Using these default settings on a Sodium-Ion bank results in a **40% loss of usable capacity** and triggers premature Low-Voltage Disconnects (LVD).

In this guide, we provide the exact parameter offsets required to calibrate prosumer BMS brands for Sodium-Ion chemistry.

## 1. The Voltage Gap: Na-Ion vs. LFP

The primary hurdle is the discharge floor. Sodium-Ion cells are designed to be discharged much deeper than LFP without structural degradation.

| Metric | LiFePO4 (LFP) | Sodium-Ion (Na-Ion) |
| :--- | :--- | :--- |
| **Nominal Voltage** | 3.2V | 3.0V - 3.1V |
| **Max Charge (Cut-off)** | 3.65V | 3.95V - 4.0V |
| **Min Discharge (Cut-off)** | 2.5V | **1.5V - 1.8V** |
| **Usable SOC Range** | 10% - 95% | 0% - 100% |

**The Failure Mode:** If you use an LFP-configured BMS, it will cut power at 2.5V. However, a Sodium-Ion cell still holds nearly 35-40% of its energy between 2.5V and 1.5V. To reclaim this "lost" energy, you must re-flash your BMS thresholds.

## 2. Specific Parameter Settings (JBD, Daly, JK)

To adjust these, you will need the vendor-specific communication cable (USB-to-UART or Bluetooth) and the "Pro" or "Manufacturer" versions of their configuration software.

### JBD (Jiabaida) BMS
JBD units are the most common in the prosumer space. Navigate to the **"Parameter Settings"** tab:
- **Cell Over-Voltage:** 4.00V
- **Cell Over-Voltage Release:** 3.85V
- **Cell Under-Voltage:** 1.50V (Set to 1.80V for increased cycle longevity)
- **Cell Under-Voltage Release:** 2.00V
- **Cell Balance Threshold:** 3.50V

### Daly Smart BMS
Daly units require the **Sinowealth** software or the **Smart BMS** app (Pro mode):
- **High Voltage Protection:** 4.0V
- **Low Voltage Protection:** 1.5V
- **Low Voltage Recovery:** 2.1V
- **Differential Pressure Protection:** 0.5V (Na-Ion curves are steeper at the ends; a wider delta is required to avoid nuisance trips).

### JK (JiKong) BMS
JK units are highly recommended for Na-Ion due to their high-current active balancing:
- **OVP (Over Voltage Protection):** 4.0V
- **UVP (Under Voltage Protection):** 1.5V
- **UVP Release:** 2.0V
- **Balance Start Voltage:** 3.4V

## 3. Safety ROI: The Zero-Volt Advantage

One of the most significant "ROI" features of Sodium-Ion is its ability to be shipped and stored at **0.0V (Zero Volts)**. 

### Why Zero-Volt Matters:
- **Transport Safety:** Lithium batteries (LFP/NMC) must be shipped at 30% SOC to maintain stability. At 0V, a Sodium-Ion bank is essentially an inert block of salt. It cannot enter thermal runaway, even if crushed or punctured.
- **Shelf-Life ROI:** Standard lithium batteries suffer from "Capacity Fade" if stored for years. Sodium-Ion can be shorted at the terminals (0V) for long-term storage, effectively "pausing" the chemical aging process.

**Technical Note:** To perform a Zero-Volt storage, the cell must be drained slowly to 0V. Upon reactivation, the BMS will require a "Jump Start" or "Pre-Charge" cycle to recognize the pack before normal charging can resume.

## 4. Recommended Hardware

To build a resilient Na-Ion system, ensure your BMS is "Chemistry Agnostic" (fully programmable). 

*   **[Signature Solar (EG4 Na-Ion Kits)](https://signaturesolar.com/affiliates)**: The premier source for validated Sodium-Ion server-rack modules that include pre-configured BMS units.
*   **[BigBattery (Na-Ion Series)](https://bigbattery.com/partners)**: High-density Sodium-Ion solutions for mobile and off-grid applications.
*   **JK Smart Active Balance BMS**: Available via major DIY distributors. Ensure you select the 2A active balance version to handle the Na-Ion voltage swings.

---
*Ready to build your bank? Check our [DIY Sodium-Ion vs LFP Cost Analysis](/content/diy-sodium-ion-vs-lfp-2026.md) or download our [Battery Safety Installation Checklist](/resources/battery-safety-checklist.pdf).*
