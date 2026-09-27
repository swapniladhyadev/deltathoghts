/**
 * Leaflet GIS Map Engine & Cyclone Trajectory Controller
 * APAC-Resilience AI Platform - Bay of Bengal
 */

window.MapController = (function() {
  'use strict';

  let map = null;
  let cyclonePolyline = null;
  let forecastConePolygon = null;
  let waypointMarkers = [];
  let surgePolygonLayers = [];
  let infraMarkers = [];
  let buoyMarkers = [];

  // Simulated cyclone tracks for presets
  const CYCLONE_PRESETS = {
    "bay26x": {
      name: "Super Cyclone Bay-26X",
      category: "Category 4 Very Severe Cyclonic Storm",
      wind_speed_kmh: 195,
      pressure_hpa: 932,
      surge_m: 4.2,
      landfall_target: "Cox's Bazar & Sundarbans Estuary",
      waypoints: [
        { lat: 14.2, lng: 88.5, time: "T - 72h", wind: 95, press: 990 },
        { lat: 16.5, lng: 89.2, time: "T - 48h", wind: 140, press: 965 },
        { lat: 19.2, lng: 90.4, time: "T - 24h", wind: 175, press: 945 },
        { lat: 21.6, lng: 91.5, time: "Landfall (T - 0h)", wind: 195, press: 932 },
        { lat: 23.4, lng: 92.1, time: "T + 24h (Inland)", wind: 75, press: 998 }
      ]
    },
    "remal": {
      name: "Cyclone Remal (Historical Benchmark)",
      category: "Severe Cyclonic Storm",
      wind_speed_kmh: 135,
      pressure_hpa: 968,
      surge_m: 2.8,
      landfall_target: "West Bengal & Khepupara (Bangladesh)",
      waypoints: [
        { lat: 15.0, lng: 87.8, time: "T - 72h", wind: 70, press: 998 },
        { lat: 17.8, lng: 88.5, time: "T - 48h", wind: 95, press: 985 },
        { lat: 20.1, lng: 89.1, time: "T - 24h", wind: 120, press: 974 },
        { lat: 21.9, lng: 89.4, time: "Landfall (T - 0h)", wind: 135, press: 968 },
        { lat: 23.8, lng: 89.9, time: "T + 24h", wind: 55, press: 1002 }
      ]
    },
    "mocha": {
      name: "Cyclone Mocha (Category 5 Extreme)",
      category: "Category 5 Extremely Severe Cyclonic Storm",
      wind_speed_kmh: 250,
      pressure_hpa: 918,
      surge_m: 5.1,
      landfall_target: "Sittwe (Rakhine State, Myanmar)",
      waypoints: [
        { lat: 13.5, lng: 89.5, time: "T - 72h", wind: 130, press: 970 },
        { lat: 15.8, lng: 91.0, time: "T - 48h", wind: 185, press: 945 },
        { lat: 18.2, lng: 92.2, time: "T - 24h", wind: 230, press: 925 },
        { lat: 20.1, lng: 92.8, time: "Landfall (T - 0h)", wind: 250, press: 918 },
        { lat: 22.1, lng: 93.5, time: "T + 24h", wind: 90, press: 990 }
      ]
    }
  };

  function initMap(elementId) {
    if (map) return;

    // Centered on Bay of Bengal
    map = L.map(elementId, {
      center: [19.5, 89.5],
      zoom: 6,
      zoomControl: false,
      attributionControl: false
    });

    // Custom Zoom control top right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Google Maps API Key resolution from environment
    const googleApiKey = (typeof window !== 'undefined' && window.VITE_GOOGLE_MAPS_API_KEY)
      || (typeof process !== 'undefined' && process.env ? (process.env.VITE_GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY) : '')
      || '';

    // 1. Google Maps Base Layers
    const googleRoadmapTiles = L.tileLayer(`https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&key=${googleApiKey}`, {
      maxZoom: 20,
      attribution: '&copy; <a href="https://www.google.com/maps" target="_blank">Google Maps</a>'
    }).addTo(map);

    const googleSatTiles = L.tileLayer(`https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}&key=${googleApiKey}`, {
      maxZoom: 20,
      attribution: '&copy; <a href="https://www.google.com/maps" target="_blank">Google Maps Satellite</a>'
    });

    // 2. Free Public CartoDB Dark Matter Fallback Layer
    const darkTiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    });

    // 3. Esri World Imagery Satellite
    const esriSatTiles = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    // Base Layer Controls Mapping
    window._mapBaseLayers = {
      googleMaps: googleRoadmapTiles,
      googleSat: googleSatTiles,
      dark: darkTiles,
      esriSat: esriSatTiles
    };

    // Load initial active preset track
    loadCyclonePreset('bay26x');

    // Render Critical Infrastructure & Telemetry Buoys
    renderInfrastructureMarkers();
    renderBuoyMarkers();
  }

  function loadCyclonePreset(presetKey) {
    const preset = CYCLONE_PRESETS[presetKey] || CYCLONE_PRESETS["bay26x"];

    // Update HUD Text UI
    const nameElem = document.getElementById('hud-cyclone-name');
    const windElem = document.getElementById('hud-top-wind');
    const surgeElem = document.getElementById('hud-top-surge');
    const pressureElem = document.getElementById('hud-pressure');
    const surgeDepthElem = document.getElementById('hud-surge-depth');

    if (nameElem) nameElem.textContent = `🌀 ${preset.name}`;
    if (windElem) windElem.textContent = `${preset.wind_speed_kmh} km/h`;
    if (surgeElem) surgeElem.textContent = `${preset.surge_m}m`;
    if (pressureElem) pressureElem.textContent = `${preset.pressure_hpa} hPa`;
    if (surgeDepthElem) surgeDepthElem.textContent = `${preset.surge_m} meters`;

    // Clear existing track layers
    if (cyclonePolyline) map.removeLayer(cyclonePolyline);
    if (forecastConePolygon) map.removeLayer(forecastConePolygon);
    waypointMarkers.forEach(m => map.removeLayer(m));
    waypointMarkers = [];

    const latLngs = preset.waypoints.map(w => [w.lat, w.lng]);

    // Draw Track Line
    cyclonePolyline = L.polyline(latLngs, {
      color: '#f43f5e',
      weight: 4,
      dashArray: '8, 8',
      lineCap: 'round'
    }).addTo(map);

    // Draw Uncertainty Cone Polygon around Landfall
    const coneCoords = [
      [preset.waypoints[0].lat, preset.waypoints[0].lng],
      [preset.waypoints[2].lat - 0.4, preset.waypoints[2].lng - 0.6],
      [preset.waypoints[3].lat - 0.8, preset.waypoints[3].lng - 1.2],
      [preset.waypoints[3].lat + 0.8, preset.waypoints[3].lng + 1.2],
      [preset.waypoints[2].lat + 0.4, preset.waypoints[2].lng + 0.6]
    ];
    forecastConePolygon = L.polygon(coneCoords, {
      color: '#f59e0b',
      fillColor: '#f59e0b',
      fillOpacity: 0.18,
      weight: 1.5,
      dashArray: '4, 4'
    }).addTo(map);

    // Draw Waypoint Markers
    preset.waypoints.forEach((wp, idx) => {
      const isLandfall = wp.time.includes("Landfall");
      const iconHtml = `<div style="
        background: ${isLandfall ? '#f43f5e' : '#06b6d4'};
        color: #fff;
        width: ${isLandfall ? '26px' : '20px'};
        height: ${isLandfall ? '26px' : '20px'};
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-size: 11px; font-weight: bold;
        box-shadow: 0 0 12px ${isLandfall ? 'rgba(244,63,94,0.8)' : 'rgba(6,182,212,0.8)'};
        border: 2px solid #fff;">
        ${isLandfall ? '🌀' : idx + 1}
      </div>`;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-cyclone-node',
        iconSize: [24, 24]
      });

      const marker = L.marker([wp.lat, wp.lng], { icon: customIcon }).addTo(map);
      marker.bindPopup(`
        <div style="padding: 4px;">
          <div style="font-weight:bold; color:#06b6d4; font-size: 0.9rem;">${preset.name} - ${wp.time}</div>
          <div style="font-size: 0.8rem; margin-top: 4px; color:#cbd5e1;">
            <b>Wind:</b> ${wp.wind} km/h<br/>
            <b>Central Pressure:</b> ${wp.press} hPa<br/>
            <b>Status:</b> ${isLandfall ? '⚠️ Severe Landfall Point' : 'In-Transit Trajectory'}
          </div>
        </div>
      `);
      waypointMarkers.push(marker);
    });

    // Compute GEE Surge Polygons
    if (window.GEEEngine) {
      const geeData = window.GEEEngine.computeSurgeModel({
        windSpeedKmh: preset.wind_speed_kmh,
        centralPressureHpa: preset.pressure_hpa
      });
      renderSurgePolygons(geeData.surgePolygons);
    }
  }

  function renderSurgePolygons(polygonsData) {
    surgePolygonLayers.forEach(l => map.removeLayer(l));
    surgePolygonLayers = [];

    if (!polygonsData) return;

    polygonsData.forEach(p => {
      const layer = L.polygon(p.coords, {
        color: '#06b6d4',
        fillColor: '#06b6d4',
        fillOpacity: p.opacity || 0.6,
        weight: 2
      }).addTo(map);

      layer.bindPopup(`
        <div style="padding:4px;">
          <div style="font-weight:bold; color:#38bdf8;">🌊 GEE Hydrodynamic Surge Inundation Zone</div>
          <div style="font-size:0.8rem; margin-top:4px; color:#e2e8f0;">
            <b>Target Zone:</b> ${p.name}<br/>
            <b>Surge Depth:</b> ${p.depth_m} meters<br/>
            <b>Satellite Feed:</b> Sentinel-1 SAR Automated Water Extent
          </div>
        </div>
      `);

      surgePolygonLayers.push(layer);
    });
  }

  function renderInfrastructureMarkers() {
    infraMarkers.forEach(m => map.removeLayer(m));
    infraMarkers = [];

    if (!window.GEEEngine) return;

    const zones = window.GEEEngine.COASTAL_ZONES;
    Object.keys(zones).forEach(key => {
      const zone = zones[key];
      zone.critical_infrastructure.forEach(item => {
        const iconHtml = `<div style="
          background: rgba(15,23,42,0.9);
          border: 1px solid #38bdf8;
          color: #38bdf8;
          border-radius: 6px;
          padding: 2px 6px;
          font-size: 10px;
          font-weight: bold;
          white-space: nowrap;
          box-shadow: 0 4px 10px rgba(0,0,0,0.5);">
          🏥 ${item.name}
        </div>`;

        const icon = L.divIcon({ html: iconHtml, className: 'infra-badge', iconSize: [120, 20] });
        const marker = L.marker([item.lat, item.lng], { icon: icon }).addTo(map);
        marker.bindPopup(`
          <div style="padding:4px;">
            <div style="font-weight:bold; color:#f43f5e;">🏥 Critical Infrastructure Exposed</div>
            <div style="font-size:0.8rem; color:#e2e8f0; margin-top:4px;">
              <b>Facility:</b> ${item.name}<br/>
              <b>Vulnerability Risk:</b> ${item.risk}<br/>
              <b>Capacity / Details:</b> ${item.capacity || item.beds || item.value_usd || 'N/A'}
            </div>
          </div>
        `);
        infraMarkers.push(marker);
      });
    });
  }

  function renderBuoyMarkers() {
    buoyMarkers.forEach(m => map.removeLayer(m));
    buoyMarkers = [];

    const buoys = [
      { name: "BOB-Buoy #23 (INCOIS Telemetry)", lat: 17.5, lng: 89.2, wave_m: 6.8, wind_kmh: 165 },
      { name: "BD-Moored Sensor Kutubdia", lat: 21.2, lng: 91.4, wave_m: 4.5, wind_kmh: 180 }
    ];

    buoys.forEach(b => {
      const iconHtml = `<div style="
        background: #f59e0b;
        width: 14px; height: 14px;
        border-radius: 50%;
        border: 2px solid #fff;
        box-shadow: 0 0 10px rgba(245,158,11,0.9);">
      </div>`;
      const icon = L.divIcon({ html: iconHtml, className: 'buoy-node', iconSize: [14, 14] });
      const marker = L.marker([b.lat, b.lng], { icon: icon }).addTo(map);
      marker.bindPopup(`
        <div style="padding:4px;">
          <div style="font-weight:bold; color:#f59e0b;">⚓ Oceanographic Telemetry Buoy</div>
          <div style="font-size:0.8rem; color:#cbd5e1; margin-top:4px;">
            <b>Sensor ID:</b> ${b.name}<br/>
            <b>Significant Wave Height:</b> ${b.wave_m} meters<br/>
            <b>Wind Speed:</b> ${b.wind_kmh} km/h
          </div>
        </div>
      `);
      buoyMarkers.push(marker);
    });
  }

  function updateTimelinePosition(leadTimeHours) {
    if (window.GEEEngine) {
      const currentWind = Math.max(70, Math.round(195 - (leadTimeHours * 1.6)));
      const geeData = window.GEEEngine.computeSurgeModel({
        leadTimeHours: leadTimeHours,
        windSpeedKmh: currentWind
      });
      renderSurgePolygons(geeData.surgePolygons);
    }
  }

  function toggleLayer(layerName, visible) {
    if (!map) return;
    if (layerName === 'geeSurge') {
      surgePolygonLayers.forEach(l => visible ? l.addTo(map) : map.removeLayer(l));
    } else if (layerName === 'infra') {
      infraMarkers.forEach(m => visible ? m.addTo(map) : map.removeLayer(m));
    } else if (layerName === 'buoys') {
      buoyMarkers.forEach(m => visible ? m.addTo(map) : map.removeLayer(m));
    } else if (layerName === 'googleMaps' && window._mapBaseLayers) {
      if (visible) window._mapBaseLayers.googleMaps.addTo(map);
      else map.removeLayer(window._mapBaseLayers.googleMaps);
    } else if (layerName === 'satTiles' && window._mapBaseLayers) {
      if (visible) window._mapBaseLayers.esriSat.addTo(map);
      else map.removeLayer(window._mapBaseLayers.esriSat);
    } else if (layerName === 'darkTiles' && window._mapBaseLayers) {
      if (visible) window._mapBaseLayers.dark.addTo(map);
      else map.removeLayer(window._mapBaseLayers.dark);
    }
  }

  return {
    initMap: initMap,
    loadCyclonePreset: loadCyclonePreset,
    updateTimelinePosition: updateTimelinePosition,
    toggleLayer: toggleLayer,
    CYCLONE_PRESETS: CYCLONE_PRESETS
  };
})();
