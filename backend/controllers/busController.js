const Bus = require("../Model/bus");
const Stop = require("../Model/stop");
const Route = require("../Model/routee");
const dummyData = require("../utils/DummyData");


const getDistance = (coord1, coord2) => {
    const lat1 = coord1[1];
    const lon1 = coord1[0];
    const lat2 = coord2[1];
    const lon2 = coord2[0];
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};

const seedDatabase = async (req, res) => {
    try {
        console.log("Seeding database...");
        await Stop.deleteMany({});
        await Route.deleteMany({});
        await Bus.deleteMany({});

        const insertedStops = {};
        for (const route of dummyData.routes) {
            for (const stop of route.stops) {
                if (!insertedStops[stop.name]) {
                    const newStop = await Stop.create({
                        name: stop.name,
                        location: stop.location
                    });
                    insertedStops[stop.name] = newStop._id;
                }
            }
        }

        const insertedRoutes = {};
        for (const route of dummyData.routes) {
            const routeStops = route.stops.map((stop, index) => ({
                stopId: insertedStops[stop.name],
                sequence: index
            }));
            const newRoute = await Route.create({
                _id: route._id,
                name: route.name,
                routeNumber: route.routeNumber,
                stops: routeStops
            });
            insertedRoutes[newRoute.routeNumber] = newRoute._id;
        }

        for (const bus of dummyData.buses) {
            await Bus.create({
                busNumber: bus.busNumber,
                licensePlate: bus.licensePlate,
                // FIX: Use the newly created route _id for the link
                currentRoute: insertedRoutes[bus.routeNumber],
                location: bus.location
            });
        }

        console.log('Database seeded successfully.');
        res.status(201).json({ message: 'Database seeded successfully!' });
    } catch (error) {
        console.error('Error seeding database:', error);
        res.status(500).json({ message: 'Error seeding database', error });
    }
};

const searchRoutes = async (req, res) => {
    try {
        const { origin, destination } = req.query;
        const [originLat, originLng] = origin.split(',').map(Number);
        const [destLat, destLng] = destination.split(',').map(Number);

        console.log("🔍 Searching routes...");
        console.log(`Origin: lat=${originLat}, lng=${originLng}`);
        console.log(`Destination: lat=${destLat}, lng=${destLng}`);

        const searchRadius = 1000;

        // Find stops near origin
        const originStops = await Stop.find({
            location: {
                $nearSphere: {
                    $geometry: { type: "Point", coordinates: [originLng, originLat] },
                    $maxDistance: searchRadius
                }
            }
        });
        console.log(`🟢 Found ${originStops.length} stops near origin:`, originStops.map(s => s.name));

        // Find stops near destination
        const destStops = await Stop.find({
            location: {
                $nearSphere: {
                    $geometry: { type: "Point", coordinates: [destLng, destLat] },
                    $maxDistance: searchRadius
                }
            }
        });
        console.log(`🟢 Found ${destStops.length} stops near destination:`, destStops.map(s => s.name));

        if (!originStops.length || !destStops.length) {
            console.log("❌ No stops found near origin or destination.");
            return res.json([]);
        }

        const originStopNames = originStops.map(stop => stop.name);
        const destStopNames = destStops.map(stop => stop.name);

        const matchingRoutes = await Route.find({}).populate('stops.stopId');

        const promises = matchingRoutes.map(async route => {
            const stops = route.stops.map(s => ({
                name: s.stopId.name,
                location: s.stopId.location,
                sequence: s.sequence
            }));

            console.log(`📍 Route ${route.routeNumber} has stops:`, stops.map(s => s.name));

            const originIndices = stops
                .map((s, i) => originStopNames.includes(s.name) ? i : -1)
                .filter(i => i !== -1);

            const destinationIndices = stops
                .map((s, i) => destStopNames.includes(s.name) ? i : -1)
                .filter(i => i !== -1);

            const originIndex = Math.min(...originIndices);
            const destinationIndex = Math.min(...destinationIndices.filter(i => i > originIndex));

            console.log(`🔎 Checking route ${route.routeNumber}: originIndex=${originIndex}, destinationIndex=${destinationIndex}`);

            if (Number.isFinite(originIndex) && Number.isFinite(destinationIndex)) {
                console.log(`✅ Route ${route.routeNumber} matches!`);
                
                 console.log("ROUTE",route._id)
                 const buses = await Bus.find({ currentRoute: route._id }).select('busNumber _id location');
                
                return {
                    routeId: route._id,
                    routeNumber: route.routeNumber,
                    name: route.name,
                    startStop: stops[originIndex].name,
                    endStop: stops[destinationIndex].name,
                    availableBuses: buses
                };
            }
            return null;
        });

        // FIX: Await the promise array and then filter
        const results = (await Promise.all(promises)).filter(Boolean);

        console.log(`🎯 Final matching routes: ${results.length}`);
        res.json(results);

    } catch (error) {
        console.error("💥 Error searching routes:", error);
        res.status(500).json({ message: 'Error searching routes', error });
    }
};

const getBusDetails = async (req, res) => {
    try {
        const { busId } = req.params;
        const bus = await Bus.findById(busId).populate({
            path: 'currentRoute',
            populate: {
                path: 'stops.stopId',
                model: 'Stop'
            }
        });
        if (!bus) {
            return res.status(404).json({ message: 'Bus not found' });
        }
        res.json(bus);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bus details', error });
    }
};


const getAllBuses = async (req, res) => {
    try {
        const buses = await Bus.find().select('busNumber location');
        res.json(buses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching buses', error });
    }
};


const getAllRoutes = async (req, res) => {
    try {
        const routes = await Route.find().populate('stops.stopId');
        res.json(routes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching routes', error });
    }
};

module.exports = {
    getAllBuses,
    getAllRoutes,
    seedDatabase,
    searchRoutes,
    getBusDetails
};