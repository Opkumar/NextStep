// import React, { useState } from 'react';

// const TripSearch = ({ onSearch, userLocation }) => {
//     const [destination, setDestination] = useState('');


    

//     const handleSubmit = (e) => {
//         e.preventDefault();
        
//         const originCoords = userLocation ? { lat: userLocation[0], lng: userLocation[1] } : null;
//         if (!originCoords) {
//             alert("Your location is needed to search for buses.");
//             return;
//         }

//         let destCoords = null;
//           if (destination.toLowerCase().includes('tagore nagar')) {
//             destCoords = { lat: 31.3150, lng: 75.5601 };
//         } else if (destination.toLowerCase().includes('phagwara gate')) {
//             destCoords = { lat: 31.3270, lng: 75.5790 };
//         } else {
//             alert("Please enter a valid destination: 'Tagore Nagar' or 'Phagwara Gate'");
//             return;
//         }
//         onSearch(originCoords, destCoords);
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <h2 className="text-xl font-bold text-gray-800 mb-4">Find a Bus</h2>
//             <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">Your Location</label>
//                 <input 
//                     type="text" 
//                     value={userLocation ? `Lat: ${userLocation[0].toFixed(4)}, Lng: ${userLocation[1].toFixed(4)}` : 'Loading...'} 
//                     readOnly 
//                     className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100" 
//                 />
//             </div>
//             <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">Destination</label>
//                 <input 
//                     type="text" 
//                     placeholder="e.g., Model Town or Phagwara Gate" 
//                     value={destination}
//                     onChange={(e) => setDestination(e.target.value)}
//                     className="mt-1 block w-full p-2 border border-gray-300 rounded-md" 
//                 />
//             </div>
//             <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Search</button>
//         </form>
//     );
// };

// export default TripSearch;
import React, { useState, useEffect } from 'react';

const TripSearch = ({ onSearch, userLocation }) => {
    const [originName, setOriginName] = useState('Loading...');
    const [destination, setDestination] = useState('');

    // Hardcoded stops for reverse geocoding lookup
    const allStops = [
        { name: 'Bus Stand', coords: [31.3260, 75.5762] },
        { name: 'Shaheed Udham Singh Nagar', coords: [31.3228, 75.5721] },
        { name: 'Avtar Nagar', coords: [31.3195, 75.5670] },
        { name: 'Asha Vidya Mandir School', coords: [31.3170, 75.5630] },
        { name: 'Tagore Nagar', coords: [31.3150, 75.5601] },
        { name: 'Urban Estate Phase II', coords: [31.3340, 75.5890] },
        { name: 'Lajpat Nagar', coords: [31.3325, 75.5850] },
        { name: 'B.M.C. Chowk', coords: [31.3295, 75.5820] },
        { name: 'Phagwara Gate', coords: [31.3270, 75.5790] }
    ];

    // Helper function to find the closest stop name
    const getPlaceName = (coords) => {
        if (!coords) return 'Unknown Location';
        let closestStop = null;
        let minDistance = Infinity;
        
        allStops.forEach(stop => {
            const latDiff = Math.abs(stop.coords[0] - coords[0]);
            const lngDiff = Math.abs(stop.coords[1] - coords[1]);
            const distance = latDiff + lngDiff; // A simple approximation for distance
            
            if (distance < minDistance) {
                minDistance = distance;
                closestStop = stop.name;
            }
        });
        return closestStop || 'Jalandhar City Center';
    };

    useEffect(() => {
        if (userLocation) {
            const name = getPlaceName(userLocation);
            setOriginName(name);
        }
    }, [userLocation]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const originCoords = userLocation ? { lat: userLocation[0], lng: userLocation[1] } : null;
        if (!originCoords) {
            alert("Your location is needed to search for buses.");
            return;
        }

        let destCoords = null;
        // Updated logic to find destination coordinates based on name
        const foundStop = allStops.find(stop => destination.toLowerCase().includes(stop.name.toLowerCase()));
        if (foundStop) {
            destCoords = { lat: foundStop.coords[0], lng: foundStop.coords[1] };
        } else {
            alert("Please enter a valid destination from the list: 'Tagore Nagar', 'Phagwara Gate', etc.");
            return;
        }

        onSearch(originCoords, destCoords);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Find a Bus</h2>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Your Location</label>
                <input 
                    type="text" 
                    value={originName}
                    readOnly 
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100" 
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Destination</label>
                <input 
                    type="text" 
                    placeholder="e.g., Tagore Nagar or Phagwara Gate" 
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md" 
                />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Search</button>
        </form>
    );
};

export default TripSearch;
