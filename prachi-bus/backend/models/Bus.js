const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['AC', 'Non-AC', 'Sleeper', 'Seater'], required: true },
    source: { type: String, required: true },
    destination: { type: String, required: true },
    departureTime: { type: String, required: true },
    arrivalTime: { type: String, required: true },
    duration: { type: String, required: true },
    fare: { type: Number, required: true },
    seatsAvailable: { type: Number, default: 40 },
    totalSeats: { type: Number, default: 40 },
    bookedSeats: [Number],
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Bus', busSchema);
