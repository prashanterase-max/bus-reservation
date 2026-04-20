const express = require('express');
const router = express.Router();
const auth = require('../middleware/adminAuth');
const c = require('../controllers/adminController');

// Stats
router.get('/stats', auth, c.getStats);

// Users — full CRUD
router.get('/users', auth, c.getAllUsers);
router.post('/users', auth, c.createUser);
router.put('/users/:id', auth, c.updateUser);
router.delete('/users/:id', auth, c.deleteUser);

// Buses — full CRUD
router.get('/buses', auth, c.getAllBuses);
router.post('/buses', auth, c.createBus);
router.put('/buses/:id', auth, c.updateBus);
router.delete('/buses/:id', auth, c.deleteBus);

// Bookings — status control + delete
router.get('/bookings', auth, c.getAllBookings);
router.put('/bookings/:id/status', auth, c.updateBookingStatus);
router.delete('/bookings/:id', auth, c.deleteBooking);

// Messages
router.get('/messages', auth, c.getMessages);
router.put('/messages/:id/read', auth, c.markMessageRead);
router.delete('/messages/:id', auth, c.deleteMessage);

module.exports = router;
