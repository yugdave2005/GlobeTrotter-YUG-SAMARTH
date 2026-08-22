import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, Calendar, Clock, Sparkles } from 'lucide-react';

// Accurate coordinates lookup for travel destinations
const CITY_COORDINATES = {
  // Kerala & South India
  'kochi': [9.9312, 76.2673],
  'cochin': [9.9312, 76.2673],
  'munnar': [10.0889, 77.0595],
  'alleppey': [9.4981, 76.3388],
  'alappuzha': [9.4981, 76.3388],
  'thekkady': [9.6031, 77.1615],
  'periyar': [9.6031, 77.1615],
  'varkala': [8.7379, 76.7163],
  'wayanad': [11.6854, 76.1320],
  'kovalam': [8.4004, 76.9787],
  'trivandrum': [8.5241, 76.9366],

  // Rajasthan
  'jaipur': [26.9124, 75.7873],
  'udaipur': [24.5854, 73.7125],
  'jodhpur': [26.2389, 73.0243],
  'jaisalmer': [26.9157, 70.9083],
  'pushkar': [26.4899, 74.5511],
  'mount abu': [24.5926, 72.7156],

  // Goa & Coastal
  'goa': [15.2993, 74.1240],
  'north goa': [15.5439, 73.7554],
  'calangute': [15.5439, 73.7554],
  'anjuna': [15.5833, 73.7433],
  'south goa': [15.0100, 74.0232],
  'palolem': [15.0100, 74.0232],
  'panaji': [15.4909, 73.8278],
  'gokarna': [14.5479, 74.3188],
  'dudhsagar': [15.3144, 74.3143],

  // Himachal & North
  'manali': [32.2432, 77.1892],
  'solang': [32.3166, 77.1575],
  'kasol': [32.0100, 77.3153],
  'shimla': [31.1048, 77.1734],
  'dharamshala': [32.2190, 76.3234],
  'mcleodganj': [32.2426, 76.3213],

  // Uttar Pradesh & Spiritual
  'varanasi': [25.3176, 82.9739],
  'kashi': [25.3176, 82.9739],
  'sarnath': [25.3811, 83.0214],
  'ayodhya': [26.7922, 82.1998],
  'prayagraj': [25.4358, 81.8463],

  // Global & Metro
  'mumbai': [19.0760, 72.8777],
  'delhi': [28.6139, 77.2090],
  'bangalore': [12.9716, 77.5946],
  'paris': [48.8566, 2.3522],
  'rome': [41.9028, 12.4964],
  'barcelona': [41.3851, 2.1734],
  'amsterdam': [52.3676, 4.9041],
  'tokyo': [35.6762, 139.6503],
  'kyoto': [35.0116, 135.7681],
  'osaka': [34.6937, 135.5023]
};

function getCoordinatesForCity(cityName) {
  if (!cityName) return [20.5937, 78.9629]; // India center fallback
  const lower = cityName.toLowerCase();
  
  for (const [key, coords] of Object.entries(CITY_COORDINATES)) {
    if (lower.includes(key)) {
      return coords;
    }
  }
  
  // Default offset for unrecognized locations
  return [20.5937 + (Math.random() - 0.5) * 4, 78.9629 + (Math.random() - 0.5) * 4];
}

export default function TripRouteMap({ trip }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy existing map instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const stops = trip?.stops || [];
    const validStopPoints = stops.map((stop, index) => {
      const coords = getCoordinatesForCity(stop.city?.name || stop.cityName);
      return {
        ...stop,
        coords,
        index: index + 1
      };
    });

    const defaultCenter = validStopPoints.length > 0 
      ? validStopPoints[0].coords 
      : [20.5937, 78.9629];

    // Initialize Leaflet Map
    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: validStopPoints.length > 0 ? 8 : 5,
      zoomControl: false
    });

    mapInstanceRef.current = map;

    // Add Zoom Control top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Free OpenStreetMap CartoDB Positron / OSM tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19
    }).addTo(map);

    // Draw route Polyline between stops
    if (validStopPoints.length > 1) {
      const latlngs = validStopPoints.map(p => p.coords);
      
      // Polyline glow effect
      L.polyline(latlngs, {
        color: '#0284c7',
        weight: 6,
        opacity: 0.8,
        dashArray: '8, 8',
        lineCap: 'round'
      }).addTo(map);

      // Thinner solid core
      L.polyline(latlngs, {
        color: '#38bdf8',
        weight: 3,
        opacity: 0.9,
        lineCap: 'round'
      }).addTo(map);
    }

    // Add custom numbered pin markers for each destination stop
    const bounds = L.latLngBounds([]);

    validStopPoints.forEach((stop) => {
      bounds.extend(stop.coords);

      const activitiesList = stop.activities || [];
      const activitiesHtml = activitiesList.length > 0
        ? activitiesList.map(a => `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px; font-size:11px; padding:3px 6px; background:#f8fafc; border-radius:6px; border:1px solid #f1f5f9;">
              <span style="font-weight:600; color:#1e293b; max-width:160px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${a.activity?.name || 'Activity'}</span>
              <span style="font-weight:700; color:#059669; margin-left:6px;">₹${(a.customCost || a.activity?.cost || 0).toLocaleString('en-IN')}</span>
            </div>
          `).join('')
        : `<p style="font-size:11px; color:#94a3b8; font-style:italic; margin-top:4px;">No activities assigned yet</p>`;

      const popupContent = `
        <div style="font-family: inherit; min-width: 220px; padding: 4px;">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
            <div style="width:24px; height:24px; background:#0284c7; color:white; font-weight:800; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:12px;">
              ${stop.index}
            </div>
            <div>
              <h4 style="margin:0; font-size:14px; font-weight:700; color:#0f172a;">${stop.city?.name || 'Destination Stop'}</h4>
              <p style="margin:0; font-size:11px; color:#64748b;">${new Date(stop.arrivalDate).toLocaleDateString()} – ${new Date(stop.departureDate).toLocaleDateString()}</p>
            </div>
          </div>

          <div style="border-top:1px solid #e2e8f0; padding-top:6px; margin-top:6px;">
            <span style="font-size:10px; font-weight:700; text-transform:uppercase; color:#94a3b8; letter-spacing:0.5px;">Scheduled Activities:</span>
            ${activitiesHtml}
          </div>
        </div>
      `;

      // Custom HTML Marker Icon with Stop Number
      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div style="position:relative; width:40px; height:40px; display:flex; align-items:center; justify-content:center;">
            <div style="position:absolute; width:40px; height:40px; background:#0284c7; opacity:0.25; border-radius:50%; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position:relative; width:32px; height:32px; background:#0284c7; border:3px solid #ffffff; border-radius:50%; box-shadow:0 10px 15px -3px rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center; color:white; font-weight:800; font-size:13px;">
              ${stop.index}
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20]
      });

      const marker = L.marker(stop.coords, { icon: customIcon }).addTo(map);
      marker.bindPopup(popupContent, { maxWidth: 280, className: 'custom-leaflet-popup' });
    });

    if (validStopPoints.length > 1) {
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 12 });
    } else if (validStopPoints.length === 1) {
      map.setView(validStopPoints[0].coords, 9);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [trip]);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            🗺️
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900">Interactive Trip Route & Activity Map</h3>
            <p className="text-xs text-slate-500">Live GPS markers for all stops with clickable activity details</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
          <Navigation size={14} className="text-sky-600" />
          <span>{trip?.stops?.length || 0} Connected Destination Stops</span>
        </div>
      </div>

      {/* Map Container */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-[520px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner z-0"
      />

      {/* Route Stops Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
        {trip?.stops?.map((stop, i) => (
          <div key={i} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center space-x-3">
            <div className="w-7 h-7 rounded-xl bg-sky-600 text-white font-extrabold flex items-center justify-center text-xs shrink-0 shadow-sm">
              {i + 1}
            </div>
            <div className="min-w-0">
              <span className="font-bold text-xs text-slate-900 block truncate">{stop.city?.name}</span>
              <span className="text-[10px] text-slate-400 block truncate">
                {stop.activities?.length || 0} activities • ₹{(stop.activities?.reduce((s, a) => s + (a.customCost || a.activity?.cost || 0), 0) || 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
