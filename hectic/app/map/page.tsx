import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GoogleMapComponent from "@/components/GoogleMapComponent";

export const metadata = {
  title: "Interactive Google Map | APAC Resilience AI",
  description: "Interactive Google Maps integration centered at India default coordinates with InfoWindow popups, search, and preset location controls."
};

export default function MapPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 flex flex-col gap-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
              Interactive Google Map Module
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Dynamic Google Maps JavaScript API integration loaded via <code className="bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-cyan-300 font-mono">VITE_GOOGLE_MAPS_API_KEY</code>.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-full font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> API Online
            </span>
          </div>
        </div>

        {/* Google Map Component Container */}
        <GoogleMapComponent />
      </main>

      <Footer />
    </div>
  );
}
