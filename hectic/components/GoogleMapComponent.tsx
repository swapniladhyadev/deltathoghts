"use client";

import React, { useEffect, useRef, useState } from "react";
import { Search, MapPin, AlertTriangle, RefreshCw, Layers, Compass } from "lucide-react";

interface PresetLocation {
  name: string;
  lat: number;
  lng: number;
  description: string;
}

const PRESET_LOCATIONS: PresetLocation[] = [
  { name: "Default Center", lat: 20.5937, lng: 78.9629, description: "Central Geographic Reference Point" },
  { name: "New Delhi", lat: 28.6139, lng: 77.209, description: "Capital Territory Hub" },
  { name: "Mumbai", lat: 19.076, lng: 72.8777, description: "Western Coastal Metropolis" },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639, description: "Eastern Estuary Region" },
  { name: "Bengaluru", lat: 12.9716, lng: 77.5946, description: "Southern Tech Hub" },
  { name: "Sundarbans Delta", lat: 21.9497, lng: 89.1833, description: "Coastal Mangrove Zone" }
];

const DARK_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }]
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }]
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }]
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }]
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }]
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }]
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }]
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }]
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }]
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }]
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }]
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }]
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }]
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }]
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }]
  }
];

export default function GoogleMapComponent() {
  const mapRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>({
    lat: 20.5937,
    lng: 78.9629
  });
  const [activeMapType, setActiveMapType] = useState<string>("roadmap");

  const mapInstanceRef = useRef<any>(null);
  const markerInstanceRef = useRef<any>(null);
  const infoWindowRef = useRef<any>(null);
  const autocompleteRef = useRef<any>(null);

  // Load Google Maps API script dynamically
  useEffect(() => {
    const apiKey =
      process.env.VITE_GOOGLE_MAPS_API_KEY ||
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
      process.env.GOOGLE_MAPS_API_KEY ||
      "AIzaSyDv78KVQ3bA356c6UZU-fFMxEX1Bf97mjI";

    if (!apiKey || apiKey === "YOUR_ACTUAL_API_KEY_HERE") {
      setErrorMsg("Google Maps API Key is missing. Please set VITE_GOOGLE_MAPS_API_KEY in your .env.local file.");
      setIsLoading(false);
      return;
    }

    // Check if script is already loaded
    if (typeof window !== "undefined" && (window as any).google && (window as any).google.maps) {
      initMap();
      return;
    }

    const scriptId = "google-maps-script";
    const existingScript = document.getElementById(scriptId);

    if (!existingScript) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        initMap();
      };

      script.onerror = () => {
        setErrorMsg("Failed to load Google Maps JavaScript API. Please check your API key & network connectivity.");
        setIsLoading(false);
      };

      document.head.appendChild(script);
    } else {
      existingScript.addEventListener("load", initMap);
    }

    return () => {
      if (existingScript) {
        existingScript.removeEventListener("load", initMap);
      }
    };
  }, []);

  const initMap = () => {
    if (!mapRef.current || !(window as any).google) return;

    try {
      const google = (window as any).google;
      const initialLocation = { lat: 20.5937, lng: 78.9629 };

      // Create Map Instance
      const mapOptions = {
        center: initialLocation,
        zoom: 10,
        styles: DARK_MAP_STYLE,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true
      };

      const map = new google.maps.Map(mapRef.current, mapOptions);
      mapInstanceRef.current = map;

      // Create Marker
      const marker = new google.maps.Marker({
        position: initialLocation,
        map: map,
        title: "Default Center Marker",
        animation: google.maps.Animation.DROP
      });
      markerInstanceRef.current = marker;

      // Create InfoWindow
      const infoWindowContent = `
        <div style="color: #1e293b; font-family: sans-serif; padding: 6px 10px; max-width: 220px;">
          <h4 style="margin: 0 0 4px; color: #0284c7; font-size: 14px; font-weight: 700;">📍 Selected Marker</h4>
          <p style="margin: 0 0 6px; font-size: 12px; color: #475569;">Central Reference Coordinate</p>
          <div style="font-family: monospace; font-size: 11px; background: #f1f5f9; padding: 4px 6px; border-radius: 4px;">
            Lat: ${initialLocation.lat.toFixed(4)}<br/>
            Lng: ${initialLocation.lng.toFixed(4)}
          </div>
        </div>
      `;

      const infoWindow = new google.maps.InfoWindow({
        content: infoWindowContent
      });
      infoWindowRef.current = infoWindow;
      infoWindow.open(map, marker);

      // Marker click event
      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });

      // Map click event to relocate marker
      map.addListener("click", (e: any) => {
        if (!e.latLng) return;
        const clickedLat = e.latLng.lat();
        const clickedLng = e.latLng.lng();
        updateMapLocation(clickedLat, clickedLng, `Clicked Location (${clickedLat.toFixed(4)}, ${clickedLng.toFixed(4)})`);
      });

      // Setup Places Autocomplete if search input exists
      if (searchInputRef.current) {
        const autocomplete = new google.maps.places.Autocomplete(searchInputRef.current, {
          fields: ["geometry", "name", "formatted_address"]
        });
        autocompleteRef.current = autocomplete;

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place.geometry && place.geometry.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            updateMapLocation(lat, lng, place.name || place.formatted_address || "Searched Place");
          }
        });
      }

      setIsLoading(false);
    } catch (err: any) {
      console.error("Google Maps initialization error:", err);
      setErrorMsg(`Map initialization error: ${err.message || err}`);
      setIsLoading(false);
    }
  };

  const updateMapLocation = (lat: number, lng: number, title: string = "Location Marker") => {
    if (!mapInstanceRef.current || !markerInstanceRef.current) return;

    const newPos = { lat, lng };
    setCurrentCoords(newPos);

    mapInstanceRef.current.panTo(newPos);
    mapInstanceRef.current.setZoom(10);
    markerInstanceRef.current.setPosition(newPos);

    if (infoWindowRef.current) {
      const contentStr = `
        <div style="color: #1e293b; font-family: sans-serif; padding: 6px 10px; max-width: 230px;">
          <h4 style="margin: 0 0 4px; color: #0284c7; font-size: 14px; font-weight: 700;">📍 ${title}</h4>
          <p style="margin: 0 0 6px; font-size: 12px; color: #475569;">Interactive Location Point</p>
          <div style="font-family: monospace; font-size: 11px; background: #f1f5f9; padding: 4px 6px; border-radius: 4px;">
            Lat: ${lat.toFixed(4)}<br/>
            Lng: ${lng.toFixed(4)}
          </div>
        </div>
      `;
      infoWindowRef.current.setContent(contentStr);
      infoWindowRef.current.open(mapInstanceRef.current, markerInstanceRef.current);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !(window as any).google) return;

    const geocoder = new (window as any).google.maps.Geocoder();
    geocoder.geocode({ address: searchQuery }, (results: any, status: string) => {
      if (status === "OK" && results[0]) {
        const location = results[0].geometry.location;
        updateMapLocation(location.lat(), location.lng(), results[0].formatted_address);
      } else {
        alert(`Location search failed: ${status}`);
      }
    });
  };

  const changeMapType = (type: string) => {
    setActiveMapType(type);
    if (!mapInstanceRef.current) return;

    if (type === "dark") {
      mapInstanceRef.current.setMapTypeId("roadmap");
      mapInstanceRef.current.setOptions({ styles: DARK_MAP_STYLE });
    } else if (type === "satellite") {
      mapInstanceRef.current.setOptions({ styles: null });
      mapInstanceRef.current.setMapTypeId("satellite");
    } else if (type === "hybrid") {
      mapInstanceRef.current.setOptions({ styles: null });
      mapInstanceRef.current.setMapTypeId("hybrid");
    } else {
      mapInstanceRef.current.setOptions({ styles: null });
      mapInstanceRef.current.setMapTypeId("roadmap");
    }
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl transition-all">
      {/* Top Header & Search Bar */}
      <div className="p-4 bg-slate-950/80 border-b border-slate-800 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              Interactive Google Map Component
              <span className="text-xs font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded-full">
                VITE / NEXT
              </span>
            </h3>
            <p className="text-xs text-slate-400">Dynamically loaded via VITE_GOOGLE_MAPS_API_KEY</p>
          </div>
        </div>

        {/* Search Controls */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search address or city..."
              className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-sm rounded-xl transition-colors shadow-lg shadow-cyan-600/20"
          >
            Locate
          </button>
        </form>
      </div>

      {/* Preset Quick Buttons & Map Type Toggles */}
      <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
          <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Presets:
          </span>
          {PRESET_LOCATIONS.map((loc, idx) => (
            <button
              key={idx}
              onClick={() => updateMapLocation(loc.lat, loc.lng, loc.name)}
              className="px-2.5 py-1 bg-slate-800/80 hover:bg-cyan-900/40 text-slate-300 hover:text-cyan-300 border border-slate-700/60 hover:border-cyan-500/50 rounded-lg transition-all"
            >
              {loc.name}
            </button>
          ))}
        </div>

        {/* Map Type Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <span className="text-slate-500 px-1">
            <Layers className="w-3.5 h-3.5" />
          </span>
          {["dark", "roadmap", "satellite", "hybrid"].map((mode) => (
            <button
              key={mode}
              onClick={() => changeMapType(mode)}
              className={`px-2 py-0.5 rounded capitalize text-[11px] font-medium transition-all ${
                activeMapType === mode
                  ? "bg-cyan-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Canvas / Loading / Error Container */}
      <div className="relative w-full h-[480px] bg-slate-950">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-20 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
            <h4 className="text-base font-semibold text-slate-200">Initializing Google Maps Engine...</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Loading Google Maps JavaScript API with VITE_GOOGLE_MAPS_API_KEY
            </p>
          </div>
        )}

        {/* Error Overlay */}
        {errorMsg && (
          <div className="absolute inset-0 z-30 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center">
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl mb-3">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-100">Google Maps Loading Error</h4>
            <p className="text-sm text-red-400 mt-1 max-w-md bg-slate-900 border border-slate-800 p-3 rounded-xl font-mono text-xs">
              {errorMsg}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium border border-slate-700 flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reload Application
            </button>
          </div>
        )}

        {/* Map Div element */}
        <div ref={mapRef} className="w-full h-full" />

        {/* Floating Telemetry Coordinates Bar */}
        <div className="absolute bottom-4 left-4 z-10 bg-slate-950/85 backdrop-blur-md border border-slate-800/80 px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-3 text-xs text-slate-300 font-mono">
          <div className="flex items-center gap-1.5 text-cyan-400">
            <MapPin className="w-3.5 h-3.5" />
            <span>Active Target:</span>
          </div>
          <div>Lat: {currentCoords.lat.toFixed(4)}</div>
          <div>Lng: {currentCoords.lng.toFixed(4)}</div>
          <div className="text-slate-500">| Zoom: 10</div>
        </div>
      </div>
    </div>
  );
}
