const Booking = require('../models/Booking');
const Bus = require('../models/Bus');

exports.createBooking = async (req, res) => {
    try {
        const { busId, selectedSeats, passengerDetails, totalAmount, journeyDate } = req.body;
        const userId = req.user.id;
        
        // Generate PNR
        const pnr = 'PB' + Math.random().toString(36).substr(2, 6).toUpperCase();

        const booking = new Booking({
            user: userId,
            bus: busId,
            seatNumbers: selectedSeats,
            passengerDetails,
            totalAmount,
            journeyDate,
            pnr
        });

        await booking.save();

        // Update bus booked seats
        await Bus.findByIdAndUpdate(busId, {
            $push: { bookedSeats: { $each: selectedSeats } },
            $inc: { seatsAvailable: -selectedSeats.length }
        });

        res.status(201).json(booking);
    } catch (err) {
        console.error('Create booking error:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate('bus')
            .sort({ bookingDate: -1 });
        res.json(bookings);
    } catch (err) {
        console.error('Get user bookings error:', err);
        res.status(500).json({ message: err.message });
    }
};
