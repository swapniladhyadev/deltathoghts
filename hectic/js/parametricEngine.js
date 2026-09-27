/**
 * Automated Parametric Insurance & Smart Contract Payout Engine
 * APAC-Resilience AI Platform - Bay of Bengal
 */

window.ParametricEngine = (function() {
  'use strict';

  let totalReservePoolUSD = 5000000;
  let totalDisbursedUSD = 0;
  let transactionHistory = [];

  async function evaluateTrigger(surgeM, windKmh) {
    const payload = { surge_m: surgeM, wind_kmh: windKmh };

    try {
      const response = await fetch('/api/parametric-payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("Parametric server endpoint failed");
      const data = await response.json();
      return data;
    } catch (err) {
      console.warn("Using client-side parametric payout evaluation fallback:", err);
      return evaluateClientFallback(surgeM, windKmh);
    }
  }

  function evaluateClientFallback(surgeM, windKmh) {
    const isTriggered = (surgeM >= 2.2 || windKmh >= 130);
    
    let breakdown = [];
    if (isTriggered) {
      breakdown = [
        { category: "Smallholder Paddy Farmers", households: 12400, payout_per_hh: 120, total_usd: 1488000, channel: "bKash / Mobile Wallet" },
        { category: "Artisanal Coastal Fishers", households: 8200, payout_per_hh: 150, total_usd: 1230000, channel: "Nagad / Direct Transfer" },
        { category: "Salt Pan & Aquaculture Workers", households: 4500, payout_per_hh: 100, total_usd: 450000, channel: "UPI / APB System" },
        { category: "Female-Headed Vulnerable HHs", households: 6100, payout_per_hh: 180, total_usd: 1098000, channel: "Direct Cash Mobile Transfer" }
      ];
    }

    const totalPayout = breakdown.reduce((sum, item) => sum + item.total_usd, 0);

    return {
      status: "success",
      parametric_triggered: isTriggered,
      trigger_reason: isTriggered 
        ? `GEE Hydrodynamic Surge (${surgeM}m >= 2.2m threshold) & Wind (${windKmh}km/h >= 130km/h)`
        : `Conditions below trigger threshold (Surge: ${surgeM}m < 2.2m)`,
      total_disbursement_usd: totalPayout,
      payout_breakdown: breakdown
    };
  }

  function executeInstantDisbursement(breakdown) {
    if (!breakdown || breakdown.length === 0) return [];

    const newTxns = [];
    breakdown.forEach((item, index) => {
      const txHash = "0x" + Array.from({length: 16}, () => Math.floor(Math.random()*16).toString(16)).join('');
      const txn = {
        id: `TXN-BOB-${Date.now()}-${index}`,
        hash: txHash,
        category: item.category,
        households: item.households,
        amount_usd: item.total_usd,
        channel: item.channel,
        status: "CONFIRMED_PRE_LANDFALL",
        timestamp: new Date().toLocaleTimeString()
      };
      newTxns.push(txn);
      transactionHistory.unshift(txn);
    });

    totalDisbursedUSD += breakdown.reduce((s, i) => s + i.total_usd, 0);
    return newTxns;
  }

  return {
    evaluateTrigger: evaluateTrigger,
    executeInstantDisbursement: executeInstantDisbursement,
    getTransactionHistory: () => transactionHistory,
    getTotalReservePoolUSD: () => totalReservePoolUSD,
    getTotalDisbursedUSD: () => totalDisbursedUSD
  };
})();
