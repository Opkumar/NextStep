// import React, { useState, useEffect } from 'react';
// import { io } from 'socket.io-client';
// import TripSearch from './TripSearch';
// import SearchResults from './SearchResult';
// import MapView from './MapView';


// const socket = io('http://localhost:5000');

// function App() {
//   const [view, setView] = useState('search');
//   const [searchResults, setSearchResults] = useState([]);
//   const [selectedBus, setSelectedBus] = useState(null);
//   const [userLocation, setUserLocation] = useState(null);
//   const [isLocationLoading, setIsLocationLoading] = useState(true);

//   const defaultJalandharLocation = [31.3260, 75.5762];

//   useEffect(() => {
//     let timeoutId = null;

//     if (navigator.geolocation) {
//       timeoutId = setTimeout(() => {
//         if (isLocationLoading) {
//           console.error("Geolocation request timed out, using default location.");
//           setUserLocation(defaultJalandharLocation);
//           setIsLocationLoading(false);
//         }
//       }, 7000); // 7-second timeout

//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           clearTimeout(timeoutId);
//           setUserLocation([position.coords.latitude, position.coords.longitude]);
//           setIsLocationLoading(false);
//         },
//         (error) => {
//           clearTimeout(timeoutId);
//           console.error("Could not get user location, using default Jalandhar location.", error);
//           setUserLocation(defaultJalandharLocation);
//           setIsLocationLoading(false);
//         },
//         { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
//       );
//     } else {
//       setUserLocation(defaultJalandharLocation);
//       setIsLocationLoading(false);
//     }

//     return () => {
//       clearTimeout(timeoutId);
//     };
//   }, []);

//  const handleSearch = async (origin, destination) => {
//   try {
//     // 👇 Here we explicitly send longitude first, latitude second
//     const response = await fetch(
//       `http://localhost:5000/api/routes/search?origin=${origin.lng},${origin.lat}&destination=${destination.lng},${destination.lat}`
//     );

//     const data = await response.json();
//     console.log("Search Results:", data); // <-- Added debug log
//     setSearchResults(data);
//     setView('results');
//   } catch (error) {
//     console.error('Error searching for routes', error);
//     setSearchResults([]);
//     setView('results');
//   }
// };

//   const handleSelectBus = async (bus) => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/bus-details/${bus.busId}`);
//       const data = await response.json();
//       setSelectedBus(data);
//       setView('details');
      
//       socket.off('busLocationUpdate');
//       socket.on('busLocationUpdate', (locationData) => {
//           if (locationData.busNumber === data.busNumber) {
//               setSelectedBus(prevBus => ({
//                   ...prevBus,
//                   location: {
//                       ...prevBus.location,
//                       coordinates: [locationData.lng, locationData.lat]
//                   }
//               }));
//           }
//       });
//     } catch (error) {
//       console.error('Error fetching bus details', error);
//     }
//   };

//   if (isLocationLoading) {
//     return <div className="flex items-center justify-center h-screen bg-gray-100"><p className="text-xl text-gray-600">Loading your location...</p></div>;
//   }

//  return (
//     <div className="flex flex-col md:flex-row h-screen">
//       <div className="w-full md:w-1/4 p-4 bg-white shadow-lg z-10 overflow-y-auto">
//         {view === 'search' && <TripSearch onSearch={handleSearch} userLocation={userLocation} />}
//         {view === 'results' && <SearchResults results={searchResults} onSelectBus={handleSelectBus} onBack={() => setView('search')} />}
//         {view === 'details' && selectedBus && (
//           <div className="p-4">
//             <button onClick={() => setView('results')} className="text-blue-600 mb-4">&larr; Back to results</button>
//             <div className="bg-gray-50 p-4 rounded-lg">Trip Details for {selectedBus.busNumber}</div>
//           </div>
//         )}
//       </div>
//       <div className="w-full md:w-3/4">
//         {userLocation ? (
//           <MapView selectedBus={selectedBus} userLocation={userLocation} />
//         ) : (
//           <div className="w-full h-full bg-gray-200 flex items-center justify-center">
//             <p className="text-gray-500">Map is loading...</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
 
// }

// export default App;
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import TripSearch from './TripSearch';
import SearchResults from './SearchResult';
import MapView from './MapView';

const socket = io('http://localhost:5000', { transports: ['websocket'] });

function App() {
  const [view, setView] = useState('search');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLocationLoading, setIsLocationLoading] = useState(true);

  const defaultJalandharLocation =  [31.3195,75.5670]


  useEffect(() => {
    let timeoutId = null;

    if (navigator.geolocation) {
      timeoutId = setTimeout(() => {
        if (isLocationLoading) {
          console.error("Geolocation request timed out, using default location.");
          setUserLocation(defaultJalandharLocation);
          setIsLocationLoading(false);
        }
      }, 7000);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timeoutId);
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          setIsLocationLoading(false);
        },
        (error) => {
          clearTimeout(timeoutId);
          console.error("Could not get user location, using default Jalandhar location.", error);
          setUserLocation(defaultJalandharLocation);
          setIsLocationLoading(false);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );
    } else {
      setUserLocation(defaultJalandharLocation);
      setIsLocationLoading(false);
    }

    return () => {
      clearTimeout(timeoutId);
      socket.off('busLocationUpdate');
    };
  }, []);

  const handleSearch = async (origin, destination) => {
    try {
      // The origin and destination are now guaranteed to be valid coordinates
      const response = await fetch(`http://localhost:5000/api/routes/search?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}`);
      const data = await response.json();
      setSearchResults(data);
      setView('results');
    } catch (error) {
      console.error('Error searching for routes', error);
      setSearchResults([]);
      setView('results');
    }
  };

  const handleSelectBus = async (bus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bus-details/${bus._id}`);
      const data = await response.json();
      setSelectedBus(data);
      setView('details');
      
      socket.off('busLocationUpdate');
      socket.on('busLocationUpdate', (locationData) => {
          if (locationData.busNumber === data.busNumber) {
              setSelectedBus(prevBus => ({
                  ...prevBus,
                  location: {
                      ...prevBus.location,
                      coordinates: [locationData.lng, locationData.lat]
                  }
              }));
          }
      });
    } catch (error) {
      console.error('Error fetching bus details', error);
    }
  };

  if (isLocationLoading) {
    return <div className="flex items-center justify-center h-screen bg-gray-100"><p className="text-xl text-gray-600">Loading your location...</p></div>;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="w-full md:w-1/4 p-4 bg-white shadow-lg z-10 overflow-y-auto">
        {view === 'search' && <TripSearch onSearch={handleSearch} userLocation={userLocation} />}
        {view === 'results' && <SearchResults results={searchResults} onSelectBus={handleSelectBus} onBack={() => setView('search')} />}
        {view === 'details' && selectedBus && (
          <div className="p-4">
            <button onClick={() => setView('results')} className="text-blue-600 mb-4">&larr; Back to results</button>
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Bus {selectedBus.busNumber}</h3>
                <p className="text-sm text-gray-600">License Plate: {selectedBus.licensePlate}</p>
                <div className="mt-4">
                    <h4 className="font-semibold">Route: {selectedBus.currentRoute.name}</h4>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-gray-700">
                        {selectedBus.currentRoute.stops.map(stop => (
                            <li key={stop.stopId._id}>{stop.stopId.name}</li>
                        ))}
                    </ul>
                </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-50">
        {userLocation && (
          <MapView selectedBus={selectedBus} userLocation={userLocation} />
          
        )}
      </div>
    </div>
  );
}

export default App;