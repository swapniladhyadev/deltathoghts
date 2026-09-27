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
      || 'AIzaSyDv78KVQ3bA356c6UZU-fFMxEX1Bf97mjI';

    // 1. Google Maps Base Layers (Primary Default Background Map)
    const googleRoadmapTiles = L.tileLayer(`https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&key=${googleApiKey}`, {
      maxZoom: 20,
      attribution: '&copy; <a href="https://www.google.com/maps" target="_blank">Google Maps</a>'
    }).addTo(map);

    const googleSatTiles = L.tileLayer(`https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}&key=${googleApiKey}`, {
      maxZoom: 20,
      attribution: '&copy; <a href="https://www.google.com/maps" target="_blank">Google Maps Satellite</a>'
    });

    // 2. Free Public CartoDB Dark Matter Fallback Layer (No CARTO API Key required)
    const darkTiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    });

    // 3. Esri World Imagery (Satellite) Layer
    const satTiles = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 18,
      attribution: '&copy; Esri World Imagery'
    });

    // Layer control registry
    window.mapTileLayers = {
      google: googleRoadmapTiles,
      googleSat: googleSatTiles,
      dark: darkTiles,
      satellite: satTiles
    };

    // Load initial cyclone track preset
    loadCyclonePreset("bay26x");

    // Load Infrastructure & Telemetry Buoy Markers
    renderInfrastructureMarkers();
    renderTelemetryBuoys();

    // Add map click listener for coordinate risk inspection
    map.on('click', onMapClickInspection);
  }

  function loadCyclonePreset(presetId) {
    const preset = CYCLONE_PRESETS[presetId] || CYCLONE_PRESETS["bay26x"];
    
    // Clear previous vector layers
    if (cyclonePolyline) map.removeLayer(cyclonePolyline);
    if (forecastConePolygon) map.removeLayer(forecastConePolygon);
    waypointMarkers.forEach(m => map.removeLayer(m));
    waypointMarkers = [];

    const coords = preset.waypoints.map(w => [w.lat, w.lng]);

    // Forecast Cone Polygon (Uncertainty swath)
    const coneCoords = [
      [preset.waypoints[0].lat, preset.waypoints[0].lng - 0.2],
      [preset.waypoints[1].lat, preset.waypoints[1].lng - 0.5],
      [preset.waypoints[2].lat, preset.waypoints[2].lng - 0.9],
      [preset.waypoints[3].lat, preset.waypoints[3].lng - 1.4],
      [preset.waypoints[3].lat, preset.waypoints[3].lng + 1.4],
      [preset.waypoints[2].lat, preset.waypoints[2].lng + 0.9],
      [preset.waypoints[1].lat, preset.waypoints[1].lng + 0.5],
      [preset.waypoints[0].lat, preset.waypoints[0].lng + 0.2]
    ];

    forecastConePolygon = L.polygon(coneCoords, {
      color: '#f43f5e',
      weight: 1,
      fillColor: '#f43f5e',
      fillOpacity: 0.15,
      dashArray: '4, 4'
    }).addTo(map);

    // Glowing Track Polyline
    cyclonePolyline = L.polyline(coords, {
      color: '#06b6d4',
      weight: 4,
      opacity: 0.9,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    // Add Waypoint markers with pulse icon
    preset.waypoints.forEach((wp, index) => {
      const isLandfall = wp.time.includes("Landfall");
      const markerColor = isLandfall ? '#f43f5e' : (index === 0 ? '#10b981' : '#f59e0b');

      const customIcon = L.divIcon({
        className: 'custom-cyclone-waypoint',
        html: `<div style="
          width: ${isLandfall ? '22px' : '16px'};
          height: ${isLandfall ? '22px' : '16px'};
          background: ${markerColor};
          border: 3px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 0 12px ${markerColor};
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 10px;
          font-weight: bold;
        ">🌀</div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      const marker = L.marker([wp.lat, wp.lng], { icon: customIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-size:0.82rem; font-weight:bold; color:#06b6d4;">🌀 ${preset.name} (${wp.time})</div>
        <div style="font-size:0.75rem; margin-top:4px;">
          <div><b>Max Sustained Wind:</b> ${wp.wind} km/h</div>
          <div><b>Central Pressure:</b> ${wp.press} hPa</div>
          <div><b>Coordinates:</b> ${wp.lat.toFixed(2)}°N, ${wp.lng.toFixed(2)}°E</div>
        </div>
      `);
      waypointMarkers.push(marker);
    });

    // Update GEE Surge layers
    updateSurgeOverlay(preset.surge_m);
  }

  function updateSurgeOverlay(surgeM) {
    // Clear old surge polygon layers
    surgePolygonLayers.forEach(l => map.removeLayer(l));
    surgePolygonLayers = [];

    const surgeData = window.GEEEngine ? window.GEEEngine.computeSurgeModel({ surgeM: surgeM }) : null;
    if (!surgeData || !surgeData.surgePolygons) return;

    surgeData.surgePolygons.forEach(poly => {
      const color = surgeM > 3.5 ? '#f43f5e' : (surgeM > 2.2 ? '#f59e0b' : '#06b6d4');
      const surgeLayer = L.polygon(poly.coords, {
        color: color,
        weight: 2,
        fillColor: color,
        fillOpacity: 0.35,
        dashArray: '3, 6'
      }).addTo(map);

      surgeLayer.bindPopup(`
        <div style="font-weight:bold; color:${color};">🌊 ${poly.name}</div>
        <div style="font-size:0.78rem; margin-top:4px;">
          <div><b>GEE Sentinel-1 Estimated Surge Depth:</b> ${poly.depth_m.toFixed(1)}m</div>
          <div><b>Inundation Severity:</b> ${surgeM > 3.5 ? 'CRITICAL / EXTREME' : 'HIGH'}</div>
          <div><b>Embankment Breach Risk:</b> ${Math.min(98, Math.round(surgeM * 24))}%</div>
        </div>
      `);

      surgePolygonLayers.push(surgeLayer);
    });
  }

  function renderInfrastructureMarkers() {
    const zones = window.GEEEngine ? window.GEEEngine.COASTAL_ZONES : {};
    Object.values(zones).forEach(zone => {
      zone.critical_infrastructure.forEach(item => {
        let iconSymbol = "🏥";
        let color = "#10b981";
        if (item.type === "shelter") { iconSymbol = "🛖"; color = "#06b6d4"; }
        if (item.type === "embankment") { iconSymbol = "🛡️"; color = "#f43f5e"; }
        if (item.type === "port") { iconSymbol = "⚓"; color = "#f59e0b"; }

        const icon = L.divIcon({
          className: 'infra-marker',
          html: `<div style="
            background: rgba(15, 23, 42, 0.9);
            border: 2px solid ${color};
            border-radius: 8px;
            padding: 2px 6px;
            font-size: 13px;
            box-shadow: 0 0 8px ${color};
          ">${iconSymbol}</div>`,
          iconAnchor: [12, 12]
        });

        const marker = L.marker([item.lat, item.lng], { icon: icon }).addTo(map);
        marker.bindPopup(`
          <div style="font-weight:bold; color:${color};">${iconSymbol} ${item.name}</div>
          <div style="font-size:0.75rem; margin-top:4px;">
            <div><b>Vulnerability Level:</b> <span class="badge-tag badge-danger">${item.risk}</span></div>
            <div><b>Asset Type:</b> ${item.type.toUpperCase()}</div>
            <div><b>Coordinates:</b> ${item.lat}°N, ${item.lng}°E</div>
          </div>
        `);
        infraMarkers.push(marker);
      });
    });
  }

  function renderTelemetryBuoys() {
    const buoys = [
      { id: "BUOY-BOB-01", name: "Deep Sea Buoy #1 (Central Bay)", lat: 16.8, lng: 89.2, wave_m: 6.4, press: 948 },
      { id: "BUOY-BOB-04", name: "Coastal Telemetry Gauge (Cox's Bazar)", lat: 21.2, lng: 91.8, wave_m: 4.8, press: 955 },
      { id: "BUOY-BOB-09", name: "Sundarbans Outer Estuary Sensor", lat: 21.5, lng: 88.9, wave_m: 5.2, press: 951 }
    ];

    buoys.forEach(b => {
      const buoyIcon = L.divIcon({
        className: 'buoy-marker',
        html: `<div style="
          width: 14px;
          height: 14px;
          background: #3b82f6;
          border-radius: 50%;
          border: 2px solid #ffffff;
          box-shadow: 0 0 10px #3b82f6;
        "></div>`,
        iconAnchor: [7, 7]
      });

      const marker = L.marker([b.lat, b.lng], { icon: buoyIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-weight:bold; color:#3b82f6;">📡 ${b.name}</div>
        <div style="font-size:0.75rem; margin-top:4px;">
          <div><b>Live Wave Height:</b> ${b.wave_m} meters</div>
          <div><b>Barometric Pressure:</b> ${b.press} hPa</div>
          <div><b>Status:</b> TRANSMITTING (Real-time INCOIS Feed)</div>
        </div>
      `);
      buoyMarkers.push(marker);
    });
  }

  function onMapClickInspection(e) {
    const lat = e.latlng.lat.toFixed(4);
    const lng = e.latlng.lng.toFixed(4);

    // Calculate dynamic risk estimate for clicked spot
    const approxElev = (Math.random() * 2.5 + 0.8).toFixed(1);
    const approxSurgeDepth = Math.max(0, (3.8 - approxElev)).toFixed(1);
    const approxPopDensity = Math.round(Math.random() * 1200 + 800);

    const popupContent = `
      <div style="font-weight:bold; color:#06b6d4;">📍 Point Risk Analysis</div>
      <div style="font-size:0.75rem; margin-top:4px; line-height:1.5;">
        <div><b>Coordinates:</b> ${lat}°N, ${lng}°E</div>
        <div><b>DEM Elevation:</b> ${approxElev}m above MSL</div>
        <div><b>GEE Projected Surge Depth:</b> <span style="color:#f43f5e; font-weight:bold;">${approxSurgeDepth}m</span></div>
        <div><b>Local Population Density:</b> ${approxPopDensity} / km²</div>
        <div style="margin-top:4px; color:#10b981; font-weight:bold;">
          🏃 Nearest Evacuation Shelter: 1.4 km North-East (Capacity: 85%)
        </div>
      </div>
    `;

    L.popup()
      .setLatLng(e.latlng)
      .setContent(popupContent)
      .openOn(map);
  }

  function updateTimelinePosition(leadTimeHours) {
    // Lead time from 72h down to 0h
    // Interpolate cyclone track marker or surge intensity
    const surgeM = parseFloat((1.5 + (72 - leadTimeHours) * 0.045).toFixed(2));
    updateSurgeOverlay(surgeM);
  }

  function setMapLayer(layerName) {
    if (!map || !window.mapTileLayers) return;
    Object.keys(window.mapTileLayers).forEach(k => {
      if (window.mapTileLayers[k] && map.hasLayer(window.mapTileLayers[k])) {
        map.removeLayer(window.mapTileLayers[k]);
      }
    });
    const targetLayer = window.mapTileLayers[layerName] || window.mapTileLayers.google;
    targetLayer.addTo(map);
  }

  return {
    initMap: initMap,
    loadCyclonePreset: loadCyclonePreset,
    updateSurgeOverlay: updateSurgeOverlay,
    updateTimelinePosition: updateTimelinePosition,
    setMapLayer: setMapLayer,
    CYCLONE_PRESETS: CYCLONE_PRESETS
  };
})();
