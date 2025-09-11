
// // src/MapView.jsx
// import { useEffect } from "react";
// import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// // Fix for missing default marker icons in Leaflet + Vite
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
//   iconUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
// });

// // Recenter component
// function RecenterMap({ userLocation }) {
//   const map = useMap();
//   useEffect(() => {
//     if (userLocation && userLocation.length === 2) {
//       map.setView([userLocation[0], userLocation[1]], 14, { animate: true });
//     }
//   }, [userLocation, map]);
//   return null;
// }

// export default function MapView({ selectedBus, userLocation }) {
//   // ✅ Safeguard against missing location
//   if (!userLocation || userLocation.length !== 2) return null;

//   const [userLat, userLng] = userLocation;

//   return (
//     <div className="w-full h-[80vh]">
//       <MapContainer
//         center={[userLat, userLng]}
//         zoom={14}
//         className="w-full h-full rounded-2xl shadow-md"
//       >
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />

//         <RecenterMap userLocation={userLocation} />

//         {/* User Marker */}
//         <Marker position={[userLat, userLng]}>
//           <Popup>You are here</Popup>
//         </Marker>

//         {/* Bus Marker */}
//         {selectedBus?.location?.coordinates && (
//           <Marker
//             position={[
//               selectedBus.location.coordinates[1],
//               selectedBus.location.coordinates[0],
//             ]}
//           >
//             <Popup>{selectedBus.name || "Bus Location"}</Popup>
//           </Marker>
//         )}
//       </MapContainer>
//     </div>
//   );
// }


// import { useEffect, useState } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   Polyline,
//   useMap,
// } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// // --- Custom Icons ---
// const userIcon = new L.Icon({
//   iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png", // person icon
//   iconSize: [32, 32],
//   iconAnchor: [16, 32],
//   popupAnchor: [0, -32],
// });

// const busIcon = new L.Icon({
//   iconUrl: "https://cdn-icons-png.flaticon.com/512/59/59196.png", // bus icon
//   iconSize: [32, 32],
//   iconAnchor: [16, 32],
//   popupAnchor: [0, -32],
// });

// function RecenterMap({ center }) {
//   const map = useMap();
//   useEffect(() => {
//     if (center && center.length === 2) {
//       map.setView(center, 14, { animate: true });
//     }
//   }, [center, map]);
//   return null;
// }

// export default function MapView({ selectedBus, userLocation }) {
//   const [eta, setEta] = useState(null);

//   if (!userLocation || userLocation.length !== 2) return null;

//   const [userLat, userLng] = userLocation;
//   const busCoords = selectedBus?.location?.coordinates;
//   const hasBus =
//     Array.isArray(busCoords) &&
//     busCoords.length === 2 &&
//     typeof busCoords[0] === "number" &&
//     typeof busCoords[1] === "number";

//   const busLatLng = hasBus ? [busCoords[1], busCoords[0]] : null;
//   const center = busLatLng || [userLat, userLng];

//   // --- ETA Calculation ---
//   const getDistance = (coord1, coord2) => {
//     const [lon1, lat1] = coord1;
//     const [lon2, lat2] = coord2;
//     const R = 6371e3;
//     const φ1 = (lat1 * Math.PI) / 180;
//     const φ2 = (lat2 * Math.PI) / 180;
//     const Δφ = ((lat2 - lat1) * Math.PI) / 180;
//     const Δλ = ((lon2 - lon1) * Math.PI) / 180;

//     const a =
//       Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
//       Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c;
//   };

//   useEffect(() => {
//     if (hasBus) {
//       const distance = getDistance(busCoords, [userLng, userLat]);
//       const busSpeedMps = 25 / 3.6;
//       const timeInMinutes = Math.round(distance / busSpeedMps / 60);
//       setEta(timeInMinutes);
//     } else {
//       setEta(null);
//     }
//   }, [hasBus, busCoords, userLat, userLng]);

//   return (
//     <div className="relative w-full h-[80vh] rounded-2xl overflow-hidden shadow-lg">
//       {/* ETA BAR */}
//       {hasBus && eta !== null && (
//         <div className="absolute top-0 left-0 w-full bg-blue-600 text-white py-2 text-center font-semibold z-[1000] shadow-md">
//           ETA: {eta} min
//         </div>
//       )}

//       <MapContainer center={center} zoom={14} className="w-full h-full">
//         <RecenterMap center={center} />

//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />

//         {/* Your Marker */}
//         <Marker position={[userLat, userLng]} icon={userIcon}>
//           <Popup>Your Location</Popup>
//         </Marker>

//         {/* Bus Marker */}
//         {hasBus && (
//           <Marker position={busLatLng} icon={busIcon}>
//             <Popup>Bus {selectedBus?.busNumber || "Live Bus"}</Popup>
//           </Marker>
//         )}

//         {/* Polyline connecting user and bus */}
//         {hasBus && (
//           <Polyline positions={[[userLat, userLng], busLatLng]} color="blue" weight={3} />
//         )}
//       </MapContainer>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// --- Custom Icons ---
const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const busIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/59/59196.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center.length === 2) {
      map.setView(center, 14, { animate: true });
    }
  }, [center, map]);
  return null;
}

export default function MapView({ selectedBus, userLocation }) {
  const [eta, setEta] = useState(null);

  if (!userLocation || userLocation.length !== 2) return null;

  const [userLat, userLng] = userLocation;
  const busCoords = selectedBus?.location?.coordinates;
  const hasBus =
    Array.isArray(busCoords) &&
    busCoords.length === 2 &&
    typeof busCoords[0] === "number" &&
    typeof busCoords[1] === "number" &&
    (busCoords[0] !== 0 || busCoords[1] !== 0);

  const busLatLng = hasBus ? [busCoords[1], busCoords[0]] : null;
  const center = busLatLng || [userLat, userLng];

  // --- ETA Calculation ---
  const getDistance = (coord1, coord2) => {
    const [lon1, lat1] = coord1;
    const [lon2, lat2] = coord2;
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    if (hasBus) {
      const distance = getDistance(busCoords, [userLng, userLat]);
      const busSpeedMps = 25 / 3.6;
      const timeInMinutes = Math.round(distance / busSpeedMps / 60);
      setEta(timeInMinutes);
    } else {
      setEta(null);
    }
  }, [hasBus, busCoords, userLat, userLng]);

  return (
    <div className="relative w-full h-[80vh] rounded-2xl overflow-hidden shadow-lg">
      {/* ETA BAR */}
      {hasBus && eta !== null && (
        <div className="absolute top-0 left-0 w-full bg-blue-600 text-white py-2 text-center font-semibold z-[1000] shadow-md">
          ETA: {eta} min
        </div>
      )}

      <MapContainer center={center} zoom={14} className="w-full h-full">
        <RecenterMap center={center} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Your Marker */}
        <Marker position={[userLat, userLng]} icon={userIcon}>
          <Popup>Your Location</Popup>
        </Marker>

        {/* Bus Marker */}
        {hasBus && (
          <Marker position={busLatLng} icon={busIcon}>
            <Popup>Bus {selectedBus?.busNumber || "Live Bus"}</Popup>
          </Marker>
        )}

        {/* Polyline connecting user and bus */}
        {hasBus && (
          <Polyline positions={[[userLat, userLng], busLatLng]} color="blue" weight={3} />
        )}
      </MapContainer>
    </div>
  );
}