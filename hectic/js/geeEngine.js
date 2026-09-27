/**
 * GEE Hydrodynamic Storm Surge & Sentinel-1 SAR Satellite Simulation Engine
 * APAC-Resilience AI Platform - Bay of Bengal
 */

window.GEEEngine = (function() {
  'use strict';

  // Regional predefined hydrodynamic coastal zones
  const COASTAL_ZONES = {
    sundarbans: {
      name: "Sundarbans Delta & West Bengal",
      center: [21.8, 88.8],
      elevation_m: 1.8,
      population_density_per_sqkm: 1450,
      critical_infrastructure: [
        { name: "Gosaba Cyclone Shelter #4", lat: 22.16, lng: 88.81, type: "shelter", capacity: 1200, risk: "HIGH" },
        { name: "Payradanga Coastal Embankment", lat: 21.85, lng: 88.92, type: "embankment", breach_elevation: 2.8, risk: "EXTREME" },
        { name: "Kakrapar Salt Pan & Hatchery", lat: 21.65, lng: 88.35, type: "aquaculture", value_usd: 850000, risk: "SEVERE" }
      ]
    },
    coxs_bazar: {
      name: "Cox's Bazar & Chittagong Coastal Corridor",
      center: [21.43, 91.97],
      elevation_m: 2.1,
      population_density_per_sqkm: 2100,
      critical_infrastructure: [
        { name: "Cox's Bazar Sadar District Hospital", lat: 21.44, lng: 91.98, type: "hospital", beds: 450, risk: "CRITICAL" },
        { name: "Kutubdia Offshore Telemetry Station", lat: 21.81, lng: 91.85, type: "telecom", frequency_mhz: 900, risk: "HIGH" },
        { name: "Teknaf Refugee Settlement Sector 9", lat: 21.05, lng: 92.25, type: "shelter", capacity: 18500, risk: "EXTREME" }
      ]
    },
    odisha_coast: {
      name: "Odisha Coast & Mahanadi Delta",
      center: [20.27, 86.48],
      elevation_m: 2.5,
      population_density_per_sqkm: 1100,
      critical_infrastructure: [
        { name: "Paradeep Deepwater Port Hub", lat: 20.26, lng: 86.67, type: "port", capacity_tonnage: "50M", risk: "HIGH" },
        { name: "Jagatsinghpur Multi-Purpose Shelter", lat: 20.15, lng: 86.35, type: "shelter", capacity: 2500, risk: "MODERATE" }
      ]
    },
    rakhine_coast: {
      name: "Rakhine Coast & Sittwe Delta (Myanmar)",
      center: [20.14, 92.89],
      elevation_m: 1.5,
      population_density_per_sqkm: 920,
      critical_infrastructure: [
        { name: "Sittwe Port Terminal", lat: 20.14, lng: 92.90, type: "port", risk: "CRITICAL" },
        { name: "Kyaukpyu Coastal Substation", lat: 19.42, lng: 93.55, type: "power", capacity_mw: 120, risk: "EXTREME" }
      ]
    }
  };

  // Calculate dynamic hydrodynamic parameters given lead time (hours) & parameters
  function computeSurgeModel(params) {
    const leadTime = params.leadTimeHours !== undefined ? params.leadTimeHours : 24; // 0 to 72h
    const windKmh = params.windSpeedKmh || 185;
    const centralPressureHpa = params.centralPressureHpa || 935;
    const seaLevelRiseM = params.seaLevelRiseM || 0.0;
    const tidePhase = params.tidePhase || 'high_tide';

    // Hydrodynamic storm surge estimation formula based on Jelesnianski SLOSH adaptation
    // Surge Peak ~ Delta P * 0.01 + Wind^2 * 0.00008 + Tide offset
    const pressureDrop = 1013 - centralPressureHpa; // e.g. 78 hPa
    let surgeSurgeBaseline = (pressureDrop * 0.022) + (Math.pow(windKmh / 10, 1.6) * 0.012);

    // Tide offset
    const tideFactor = (tidePhase === 'astronomical_high') ? 1.2 : (tidePhase === 'high_tide' ? 0.7 : 0.1);
    const timeProgressionFactor = Math.max(0.2, 1.0 - (leadTime / 72.0)); // surge builds up as landfall approaches

    const peakSurgeM = parseFloat((surgeSurgeBaseline * timeProgressionFactor + tideFactor + seaLevelRiseM).toFixed(2));
    
    // Sentinel-1 SAR inundation area (sq km)
    const inundatedAreaSqkm = Math.round(peakSurgeM * 380 + (72 - leadTime) * 4);

    // Population exposure estimation
    const exposedPopulation = Math.round(inundatedAreaSqkm * 1650);

    // Embankment breach probability
    const breachProbability = Math.min(99, Math.max(10, Math.round(peakSurgeM * 24)));

    // Generate dynamic geographic surge polygons (lat/lng points)
    const surgePolygons = generateSurgePolygons(peakSurgeM);

    return {
      leadTimeHours: leadTime,
      peakSurgeM: peakSurgeM,
      inundatedAreaSqkm: inundatedAreaSqkm,
      exposedPopulation: exposedPopulation,
      breachProbabilityPercent: breachProbability,
      windSpeedKmh: windKmh,
      centralPressureHpa: centralPressureHpa,
      surgePolygons: surgePolygons,
      timestamp: new Date().toISOString()
    };
  }

  // Generate realistic hydrodynamic flood polygon layers around Bay of Bengal estuaries
  function generateSurgePolygons(surgeHeightM) {
    const radiusOffset = surgeHeightM * 0.08; // degrees expansion
    
    // Sundarbans flood polygon
    const sundarbansPoly = [
      [21.60 - radiusOffset, 88.10 - radiusOffset],
      [21.90 + radiusOffset, 88.20],
      [22.30 + radiusOffset, 88.80 + radiusOffset],
      [22.10, 89.40 + radiusOffset],
      [21.50 - radiusOffset, 89.20]
    ];

    // Cox's Bazar / Meghna Estuary flood polygon
    const coxsBazarPoly = [
      [21.10 - radiusOffset, 91.80 - radiusOffset],
      [21.60 + radiusOffset, 91.90],
      [22.20 + radiusOffset, 91.40],
      [22.40 + radiusOffset, 90.80 + radiusOffset],
      [21.80, 90.50 - radiusOffset]
    ];

    return [
      { name: "Sundarbans Delta Hydrodynamic Surge", opacity: 0.65, depth_m: surgeHeightM, coords: sundarbansPoly },
      { name: "Meghna Estuary & Cox's Bazar Inundation", opacity: 0.70, depth_m: surgeHeightM * 0.9, coords: coxsBazarPoly }
    ];
  }

  return {
    COASTAL_ZONES: COASTAL_ZONES,
    computeSurgeModel: computeSurgeModel
  };
})();
