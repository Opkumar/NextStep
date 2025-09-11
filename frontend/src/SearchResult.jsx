// src/SearchResults.js
import React from 'react';

const SearchResults = ({ results, onSelectBus, onBack }) => {
    return (
        <div>
            <button onClick={onBack} className="text-blue-600 mb-4">&larr; Back to search</button>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Available Buses</h2>
            {results.length > 0 ? (
                <ul className="space-y-4">
                    {results.map(route => (
                        <li key={route.routeId} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                            <h3 className="font-semibold text-lg text-blue-600">Route {route.routeNumber}</h3>
                            <p className="text-sm text-gray-600">{route.name}</p>
                            {route.availableBuses.length > 0 ? (
                                <div className="mt-2">
                                    <p className="text-sm font-medium">Available Buses:</p>
                                    <ul className="mt-1 space-y-1">
                                        {route.availableBuses.map(bus => (
                                            <li key={bus._id} onClick={() => onSelectBus(bus)} className="p-2 border border-gray-200 rounded-md flex items-center justify-between hover:bg-white cursor-pointer transition-colors">
                                                <span>Bus {bus.busNumber}</span>
                                                <span className="text-xs font-semibold text-green-600">Click for details &rarr;</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <p className="mt-2 text-sm text-red-500">No buses currently on this route.</p>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">No bus routes found for this trip. Please try a different destination.</p>
            )}
        </div>
    );
};

export default SearchResults;