const express = require('express');
const router = express.Router();
const {getAllBuses,getAllRoutes, seedDatabase, searchRoutes, getBusDetails,} = require('../controllers/busController');

router.post('/seed-db',seedDatabase);
router.get('/buses', getAllBuses);
router.get('/routes',getAllRoutes);
router.get('/routes/search', searchRoutes); 
router.get('/bus-details/:busId',getBusDetails); 

module.exports = router;