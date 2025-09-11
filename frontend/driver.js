const socket = io('http://localhost:5000');

const busSelect = document.getElementById('busSelect');
const trackButton = document.getElementById('trackButton');
const statusMessage = document.getElementById('statusMessage');

let isTracking = false;
let watchId = null;

// Function to fetch buses from the backend and populate the dropdown
async function fetchBuses() {
    try {
        const response = await fetch('http://localhost:5000/api/buses');
        const buses = await response.json();
        
        // Clear the loading message
        busSelect.innerHTML = '';
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Choose a bus';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        busSelect.appendChild(defaultOption);

        buses.forEach(bus => {
            const option = document.createElement('option');
            option.value = bus.busNumber;
            option.textContent = bus.busNumber;
            busSelect.appendChild(option);
        });

        // Enable the button after buses are loaded
        trackButton.disabled = false;
    } catch (error) {
        console.error('Failed to fetch buses:', error);
        statusMessage.innerHTML = '<p class="text-red-600">Failed to load buses. Please check the server connection.</p>';
    }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', fetchBuses);

trackButton.addEventListener('click', () => {
    if (!isTracking) {
        const busNumber = busSelect.value;
        if (!busNumber) {
            alert('Please select a bus number first.');
            return;
        }
        
        if (!navigator.geolocation) {
            statusMessage.innerHTML = '<p class="text-red-600">Geolocation is not supported by your browser.</p>';
            return;
        }

        trackButton.classList.remove('bg-green-600', 'hover:bg-green-700');
        trackButton.classList.add('bg-red-600', 'hover:bg-red-700');
        trackButton.textContent = 'Stop Tracking';
        busSelect.disabled = true;
        isTracking = true;

        statusMessage.innerHTML = '<p class="text-blue-600 animate-pulse">Tracking bus location...</p>';

        watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                statusMessage.innerHTML = `<p class="text-blue-600">Sending location: Lat ${latitude.toFixed(4)}, Lng ${longitude.toFixed(4)}</p>`;
                
                socket.emit('updateLocation', {
                    busNumber: busNumber,
                    lat: latitude,
                    lng: longitude
                });
            },
            (error) => {
                statusMessage.innerHTML = `<p class="text-red-600">Error: ${error.message}</p>`;
                console.error('Geolocation error:', error);
            },
            { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
        );

    } else {
        navigator.geolocation.clearWatch(watchId);
        isTracking = false;
        
        trackButton.classList.remove('bg-red-600', 'hover:bg-red-700');
        trackButton.classList.add('bg-green-600', 'hover:bg-green-700');
        trackButton.textContent = 'Start Tracking';
        busSelect.disabled = false;

        statusMessage.innerHTML = '<p class="text-slate-500">Tracking stopped. Ready to start again.</p>';
    }
});