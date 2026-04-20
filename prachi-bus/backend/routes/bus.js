const express = require('express');
const router = express.Router();
const { searchBuses, getAllBuses, getBusById, addBus } = require('../controllers/busController');

router.get('/', getAllBuses);
router.get('/search', searchBuses);
router.get('/:id', getBusById);
router.post('/', addBus);

module.exports = router;
