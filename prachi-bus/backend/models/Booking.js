const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
    seatNumbers: [Number],
    passengerDetails: [{
        name: { type: String, required: true },
        age: { type: Number, required: true },
        gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true }
    }],
    totalAmount: { type: Number, required: true },
    bookingDate: { type: Date, default: Date.now },
    journeyDate: { type: Date, required: true },
    pnr: { type: String, unique: true },
    status: { type: String, enum: ['Booked', 'Cancelled', 'Pending'], default: 'Booked' }
});

module.exports = mongoose.model('Booking', bookingSchema);
